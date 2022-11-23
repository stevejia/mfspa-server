import { Button, Input, message, Modal } from "antd";
import React from "react";

class Room extends React.Component<any, any, any> {
  private videoRef: HTMLVideoElement = null;
  private videoRef2: HTMLVideoElement = null;
  private audioRef: HTMLAudioElement = null;
  private pc: RTCPeerConnection = null;
  private userId: number = null;
  private client: WebSocket = null;
  state = {
    userList: [],
    userName: "",
    showAcceptModal: false,
    fromId: null
  };
  async componentDidMount(): Promise<any> {
    console.log(this.videoRef);
    //获取用户摄像头stream
    // const stream = await window.navigator.mediaDevices
    //   .getUserMedia({
    //     audio: false,
    //     video: true,
    //   })
    //   .catch((err) => console.log(err));
    // const stream = await navigator.mediaDevices
    //   .getDisplayMedia({
    //     audio: false,
    //     video: true,
    //   })
    //   .catch((err) => console.log(err));
    this.connectWS();
  }

  private connectWS = () => {
    this.client = new WebSocket("wss://www.mfspa.cc/ws", "json");
    this.client.onmessage = async (ev) => {
      console.log(ev);
      const { data: dataJson } = ev;
      const data = JSON.parse(dataJson);
      const { type } = data;
      switch (type) {
        case "id":
          this.userId = data.id;
          break;
        case "userlist":
          this.setState({ userList: data.users || [] });
          break;

        case "apply":
          const fromId = data.fromId;
          this.setState({ showAcceptModal: true, fromId });
          break;
        case "reply":
          await this.createPeerP2P();
          this.createOffer();
          break;
        case "giveoffer":
          const { sdp } = data;
          this.pc.setRemoteDescription(sdp);
          const answerSdp = await this.pc.createAnswer();
          this.pc.setLocalDescription(answerSdp);

          this.sendMessage({
            type: "backoffer",
            sdp: answerSdp,
            id: this.userId,
          });
          break;
        case "backoffer":
          const { sdp: backSdp } = data;
          this.pc.setRemoteDescription(backSdp);
          break;

        case "candidate":
          const { candidate } = data;
          this.pc.addIceCandidate(candidate);
          break;
      }
      this.setState({ userCount: data.currentUsers });
    };
  };

  private getUserMedia = async (config: MediaStreamConstraints = { audio: false, video: true }) => {
    config = {video: false, audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    }};
    const stream = await window.navigator.mediaDevices
      .getUserMedia(config)
      .catch((err) => {console.log(err)
        return undefined;
      });
    return stream;
  };

  private videoTalk = async () => {
    const stream = await this.getUserMedia({ video: true, audio: false });

    this.playWithStream(stream);
    this.sendMessage({ type: "apply", id: this.userId });
  };

  private sendMessage(messageObj) {
    const message = JSON.stringify({
      ...messageObj,
      id: this.userId,
    });
    this.client.send(message);
  }

  private audioTalk = async () => {
    const stream = await this.getUserMedia({ video: false, audio: true });
    // this.playWithStream(stream, this.audioRef);
    this.sendMessage({ type: "apply", id: this.userId });
  };
  private shareScreen = async () => {
    // const stream = await navigator.mediaDevices
    //   .getDisplayMedia({
    //     audio: false,
    //     video: true,
    //   })
    //   .catch((err) => console.log(err));
    // this.playWithStream(stream);
    this.sendMessage({ type: "apply", id: this.userId });
  };

  private async getDisplayMedia(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices
      .getDisplayMedia({
        audio: false,
        video: true,
      })
      .catch((err) => console.log(err));
    return stream as MediaStream;
  }

  /**
   * 播放流
   * @param stream 本地流
   */
  private playWithStream = (stream, videoRef: HTMLVideoElement | HTMLAudioElement = null) => {
    videoRef = videoRef || this.videoRef;
    videoRef.srcObject = stream;
    videoRef.onloadedmetadata = () => {
      videoRef.play();
    };
  };

  private changeUserName = () => {
    const { userName } = this.state;
    this.sendMessage({ type: "username", name: userName });
  };

  private agreeApply = async () => {
    this.setState({ showAcceptModal: false, fromId: null });
    message.success({ content: "我接听了" });
    await this.createPeerP2P();
    this.sendMessage({ type: "reply", replyId: this.userId });
  };
  private createOffer = async () => {
    const offer = await this.pc.createOffer({
      offerToReceiveVideo: false,
      offerToReceiveAudio: true,
    });
    this.pc.setLocalDescription(offer);
    this.sendMessage({ type: "giveoffer", sdp: offer, id: this.userId });
  };
  private inboundStream: MediaStream = null;
  private async createPeerP2P() {
    const displayStream = await this.getUserMedia({video: false, audio: true});
    // this.playWithStream(displayStream);
    //初始化peer connection;
    this.pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.mfspa.cc:8022",
          username: "stevejia",
          credential: "Xu19910209",
          credentialType: "password",
        },
      ],
    });
    const videoRef = this.videoRef2;
    let inboundStream = this.inboundStream;
    this.pc.ontrack = (ev) => {
      debugger;
      console.log(ev);
      let stream = null;
      if (ev.streams && ev.streams[0]) {
        // videoRef.srcObject = ev.streams[0];
        stream = ev.streams[0];
        this.playWithStream(stream, videoRef);
      } else {
        if (!inboundStream) {
          inboundStream = new MediaStream();
          this.playWithStream(inboundStream, videoRef);
        }
        inboundStream.addTrack(ev.track);
      }
    };

    this.pc.onicecandidate = (ev) => {
      const candidate = ev.candidate;
      if (candidate) {
        this.sendMessage({ type: "candidate", candidate });
      }
    };
    displayStream?.getTracks().forEach((track) => {
      this.pc.addTrack(track, displayStream);
    });
  }

  render(): React.ReactNode {
    const { userList, userName, showAcceptModal, fromId } = this.state;
    return (
      <div>
        <div>当前房间人数:{userList.length}</div>
        <Input
          placeholder="昵称"
          value={userName}
          onChange={(e) => this.setState({ userName: e.target.value })}
          addonAfter={<span onClick={this.changeUserName}>确定</span>}
        ></Input>
        <div
          style={{
            display: "flex",
            width: "60%",
            justifyContent: "space-between",
          }}
        >
          <video
            ref={(ref) => (this.videoRef = ref)}
            width={150}
            height={150}
            style={{ background: "#eeeeee" }}
          ></video>
          <video
            ref={(ref) => (this.videoRef2 = ref)}
            width={150}
            height={150}
            style={{ background: "#eeeeee" }}
          ></video>
          <audio>
            ref={(ref)=> this.audioRef = ref};
          </audio>
        </div>
        <div>
          <Button onClick={this.videoTalk}>视频通话</Button>
          <Button onClick={this.audioTalk}>语音通话</Button>
          <Button onClick={this.shareScreen}>分享屏幕</Button>
        </div>
        {showAcceptModal && (
          <Modal
            visible={true}
            okText="接受"
            cancelText="拒绝"
            onOk={this.agreeApply}
          >
            来自{fromId}的邀请
          </Modal>
        )}
      </div>
    );
  }
}

export default Room;
