import React from "react";
import { BaseProps, RIGHT_TYPE } from "../../types/types";
import "./room.less";

import {
  AudioOutlined,
  AudioMutedOutlined,
  VideoCameraOutlined,
  UserAddOutlined,
  DesktopOutlined,
  WechatOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { getCommonData, getQueryParam } from "../../utils";
import { Button } from "antd";
import RoomRight from "./components/room-right";
import MeetingRtc from "./rtc";
import { RTC_APP_ID } from "./rtc/api";
import Players from "./components/player";
import Chat from "./components/room-right/chat";
interface RoomProps extends BaseProps {}

interface RoomState {
  muteMicrophone: boolean;
  muteCamera: boolean;
  openRight: boolean;
  rightType: RIGHT_TYPE;
  remoteUsers: any[];
  subscribedTracks: {[key: string]: any};
  publishedTracks: any[];
  messageList: Array<{userid: string, message: string}>;
  notShared: boolean;
}

const { muteCamera, muteMicrophone } = getCommonData();

export default class Room extends React.Component<RoomProps, RoomState> {
  state = {
    muteCamera,
    muteMicrophone,
    openRight: false,
    rightType: RIGHT_TYPE.CHAT,
    remoteUsers: [],
    subscribedTracks: {},
    publishedTracks: [],
    messageList: [],
    notShared: true
  };
  private meetingRtc:MeetingRtc;
  componentDidMount(): void {
    console.log(this.props);
    console.log(this.props.location.search);
    const {userid, meetingId} = getQueryParam(this.props.location.search);
    this.meetingRtc = new MeetingRtc({appid:RTC_APP_ID,userid, meetingId, onChange: this.rtcChange.bind(this)} );
    this.meetingRtc.joinMeeting();
  }

  rtcChange() {
    console.log('rtc change');
    const {remoteUsers, subscribedTracks, localTracks, messageList} = this.meetingRtc;
    this.setState({remoteUsers, subscribedTracks, publishedTracks: localTracks, messageList});
    console.log(this.meetingRtc.remoteUsers, this.meetingRtc.subscribedTracks);
  }

  toggleChat = () => {
    this.setState({
      openRight: !this.state.openRight,
      rightType: RIGHT_TYPE.CHAT
    })
  }

  toggleMicrophone = () => {
    const muted = !this.state.muteMicrophone;
    this.setState({muteMicrophone: !this.state.muteMicrophone});
    if(!muted) {
      this.meetingRtc.unmuteTrack();
    }else {
      this.meetingRtc.muteTrack();
    }
  } 

  toggleCamera = () => {
    const muted = !this.state.muteCamera;
    this.setState({muteCamera: muted});
    if(!muted) {
      this.meetingRtc.unmuteTrack(true);
    }else {
      this.meetingRtc.muteTrack(true);
    }
  } 

  shareScreen = async() => {
    const {notShared} = this.state;
    if(notShared) {
      await this.meetingRtc.shareScreen();
    } else {
      await this.meetingRtc.unshareScreen();
    }
    this.setState({notShared: !notShared})
  }

  componentWillUnmount(): void {
      this.meetingRtc.leaveMeeting();
  }
  render(): React.ReactNode {
    const {userid} = getCommonData();
    const { notShared, muteCamera, muteMicrophone, openRight,rightType, publishedTracks, subscribedTracks, remoteUsers, messageList} = this.state;
    return (
      <div className="meeting-room">
        <div className="room-left">
          <div className="room-content">
            <Players userid={userid} tracks={publishedTracks} subscribedTracks={subscribedTracks}></Players>
          </div>
          <div className="room-footer">
            <div className="room-action-group">
              <div onClick={this.toggleMicrophone} className="room-action-item room-microphone">
                {muteMicrophone ? (
                  <>
                    <AudioMutedOutlined />
                    <div>解除静音</div>
                  </>
                ) : (
                  <>
                    <AudioOutlined />
                    <div>静音</div>
                  </>
                )}
              </div>
              <div onClick={this.toggleCamera} className="room-action-item m-l-md room-microphone">
                {muteCamera ? (
                  <>
                    <VideoCameraOutlined size={26} />
                    <div>开启视频</div>
                  </>
                ) : (
                  <>
                    <VideoCameraOutlined size={26} />
                    <div>停止视频</div>
                  </>
                )}
              </div>
            </div>
            <div className="room-other">
              <div className="room-action-group">
                <div onClick={this.shareScreen} className="room-action-item">
                  <DesktopOutlined />
                  { notShared ?  <div>共享屏幕</div> : <div>取消共享</div>}
                </div>
                <div className="room-action-item m-l-md">
                  <UserAddOutlined />

                  <div>邀请</div>
                </div>
                <div className="room-action-item m-l-md">
                  <TeamOutlined />
                  <div>管理成员</div>
                </div>
                <div onClick={this.toggleChat} className="room-action-item m-l-md">
                  <WechatOutlined />
                  <div>聊天</div>
                </div>
              </div>
            </div>
            <div className="room-end">
              <Button type="primary">结束会议</Button>
            </div>
          </div>
        </div>
        <RoomRight open={openRight} type={rightType} >
          {rightType === RIGHT_TYPE.CHAT && <Chat messageList={messageList}  hidden={!openRight} onSendMessage={(userid, message)=> this.meetingRtc.sendMessage(userid, message)} users={remoteUsers}></Chat>}
        </RoomRight>
      </div>
    );
  }
}
