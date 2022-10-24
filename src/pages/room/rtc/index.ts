import { meetingRtcConfig } from "../../../types/types";
import { getToken } from "./api";
import QNRTC, {
  QNRTCClient,
  QNLocalTrack,
  QNRemoteUser,
  QNRemoteTrack,
  QNMicrophoneAudioTrack,
  QNCameraVideoTrack,
  QNScreenVideoTrack,
  QNCustomMessage
} from "qnweb-rtc";
import { getCommonData, isScreenVideo } from "../../../utils";

export default class MeetingRtc {
  private config: meetingRtcConfig;
  private client: QNRTCClient;
  private _localTracks: (QNCameraVideoTrack | QNMicrophoneAudioTrack | QNScreenVideoTrack)[];
  public subscribedTracks: { [key: string]: QNRemoteTrack[] } = {};
  public remoteUsers: QNRemoteUser[] = [];
  public messageList: Array<{userid: string, message: string}> = [];
  constructor(config: meetingRtcConfig) {
    this.config = config;
    this.client = QNRTC.createClient();
    this.registerEvents();
  }

  async joinMeeting() {
    const {roomtoken: token} = await this.getToken();
    await this.joinRoom(token);
    this.publish();
    console.log(token);
  }

  private async getToken() {
    const { appid, userid, meetingId } = this.config;
    return await getToken(appid, meetingId, userid);
  }
  async joinRoom(token: string) {
    await this.client.join(token, this.config.userid);
  }

  async publish() {
    const { muteCamera, muteMicrophone } = getCommonData();

    if (muteCamera && muteMicrophone) {
      return;
    }
    let localTracks: (QNCameraVideoTrack | QNMicrophoneAudioTrack | QNScreenVideoTrack)[] = [];
    if (!muteCamera && this.localVideoTracks.length === 0) {
      const videoTrack = await QNRTC.createCameraVideoTrack({
        tag: "camera",
        encoderConfig: "1080p",
      });
      localTracks.push(videoTrack);
    }
    if (!muteMicrophone && this.localAudioTracks.length === 0) {
      const audioTrack = await QNRTC.createMicrophoneAudioTrack({
        tag: "microphone",
      });
      localTracks.push(audioTrack);
    }
    this.localTracks = localTracks;
    // localTracks.forEach(track=> {
    //     track.play(this.config.container);
    //     // track.setMuted(true);
    // });
    if (localTracks.length) {
      await this.client.publish(localTracks);
      this.config.onChange();
    }
  }

  public get localTracks() {
    return this._localTracks;
  }

  private _localAudioTracks: QNMicrophoneAudioTrack[] = [];
  private _localVideoTracks: QNCameraVideoTrack[] = [];
  private set localTracks(
    localTracks: (QNMicrophoneAudioTrack | QNCameraVideoTrack | QNScreenVideoTrack)[]
  ) {
    this.localAudioTracks = localTracks
      .filter((track) => track.isAudio())
      .map((track) => track as QNMicrophoneAudioTrack);
    this.localVideoTracks = localTracks
      .filter((track) => track.isVideo())
      .map((track) => track as QNCameraVideoTrack);
    this._localTracks = localTracks;
  }

  private get localVideoTracks() {
    return this._localVideoTracks;
  }

  private set localVideoTracks(audioTracks: QNCameraVideoTrack[]) {
    this._localVideoTracks = audioTracks;
  }

  private get localAudioTracks() {
    return this._localAudioTracks;
  }

  private set localAudioTracks(audioTracks: QNMicrophoneAudioTrack[]) {
    this._localAudioTracks = audioTracks;
  }

  muteTrack(isCamera: boolean = false) {
    // if()
    if (isCamera) {
      this.localVideoTracks.forEach((track) => {
        track.setMuted(true);
      });
      return;
    }
    this.localAudioTracks.forEach((track) => {
      track.setMuted(true);
    });
  }

  unmuteTrack(isCamera: boolean = false) {
    if (isCamera) {
      this.localVideoTracks.forEach((track) => {
        track.setMuted(false);
      });
      return;
    }
    this.localAudioTracks.forEach((track) => {
      track.setMuted(false);
    });
  }

  registerEvents() {
    this.client.on("user-joined", (a, b, c) => {
      const remoteUsers = this.client.remoteUsers;
      this.remoteUsers = remoteUsers;
      this.config.onChange();
    });
    this.client.on("user-left", () => {
      const remoteUsers = this.client.remoteUsers;
      this.remoteUsers = remoteUsers;
      this.config.onChange();
    });
    this.client.on(
      "user-published",
      async (userid: string, tracks: QNRemoteTrack[]) => {
        const userPubished = this.subscribedTracks[userid];
        
        if (!userPubished) {
          this.subscribedTracks[userid] = tracks;
        } else {
          this.subscribedTracks[userid] = [...userPubished, ...tracks];
        }
        await this.client.subscribe(tracks);
        tracks.forEach(track => {
          track.on('mute-state-changed', () => {
            this.config.onChange();
          })
        });
        this.config.onChange();
      }
    );

    this.client.on(
      "user-unpublished",
      async (userid: string, tracks: QNRemoteTrack[]) => {
        let userPubished = this.subscribedTracks[userid];
        if (userPubished) {
          const restTracks = [];
          userPubished.forEach(track => {
            if(!tracks.some(t=> t.trackID === track.trackID)) {
              restTracks.push(track);
            }
          })
          this.subscribedTracks[userid] = restTracks;
          if(restTracks.length === 0 ) {
            delete this.subscribedTracks[userid];
          }
        }
        await this.client.unsubscribe(tracks);
        this.config.onChange();
      }
    );

    window.onbeforeunload = () => {
      this.leaveMeeting();
    }

    this.client.on('message-received', (message: QNCustomMessage) => {
      const messageInfo = {
        userid: message.userID,
        message: message.content
      }
      this.messageList.push(messageInfo);
      this.config.onChange();
    })
  }

  public async shareScreen() {
    const track = await QNRTC.createScreenVideoTrack({encoderConfig: '720p', screenVideoTag: 'screen'}, 'disable');
    await this.client.publish(track);
    if(track instanceof QNScreenVideoTrack) {
        this.localTracks = [...this.localTracks, track];
        this.config.onChange();
    }
  }

  public async unshareScreen() {
    const track = this.localTracks.find(track => isScreenVideo(track.tag));
    if(track) {
      await this.client.unpublish(track);
      this.localTracks = this.localTracks.filter(track => !isScreenVideo(track.tag));
      this.config.onChange();
    }
  }


  public async leaveMeeting(): Promise<void> {
    this.releaseLocalTracks();
    // this.subscribedTracks.forEach(t => (t.rtcTrack as QNLocalTrack).destroy());
    // this.subscribedTracks.clear();
    // this.subscribedTracks.clear();
    // this.remoteTracks.clear();
    // this.users.clear();
    // this.token = '';
    // this.id = '';
    this.client.leave();
  }
  releaseLocalTracks() {
    this.localTracks.forEach((track) => track.destroy());
  }

  sendMessage(userid, message) {
    if(!userid) {
      this.client.sendMessage(`${Math.random()}`, message)
      return;
    }
    const users = this.remoteUsers.filter(user=> user.userID === userid);
    if(users.length >0) {
      this.client.sendMessage(`${Math.random()}`, message, users);
    }
    const {userid: sendUserId} = getCommonData();
    this.messageList.push({userid: sendUserId, message});
    this.config.onChange();
  }
}
