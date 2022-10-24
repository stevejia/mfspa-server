import { Button, Drawer, Input, Switch } from "antd";
import React from "react";
import { HIDE_TIME, MUTE_CAMERA, MUTE_MICROPHONE, USER_MEETING_ID, USR_ID } from "../../constant/constant";
import { BaseProps } from "../../types/types";
import "./login.less";
import {SettingOutlined} from '@ant-design/icons';
import { guid } from "../../utils";

interface LoginProps extends BaseProps {

}

interface LoginState {
  userid: string;
  openSetting: boolean;
  muteCamera: boolean;
  muteMicrophone: boolean;
  hideTime: boolean;
}

export default class Login extends React.Component<LoginProps, LoginState> {
  state = {
    userid: "",
    openSetting: false,
    muteCamera: JSON.parse(localStorage.getItem(MUTE_CAMERA) || 'true'),
    muteMicrophone: JSON.parse(localStorage.getItem(MUTE_MICROPHONE) || 'true'),
    hideTime: JSON.parse(localStorage.getItem(HIDE_TIME) || 'true')
  }
  
  login() {
    localStorage.setItem(USR_ID, this.state.userid);
    const userMeettingId = localStorage.getItem(USER_MEETING_ID);
    if(!userMeettingId) {
      const newMeetId = guid();
      localStorage.setItem(USER_MEETING_ID, `${newMeetId}`);
    }
    this.props.navigate('/meeting/home');
  }

  toggleSetting() {
    this.setState({openSetting: !this.state.openSetting});
  }

  toggleSettingItem(itemKey: string, value) {
    this.state[itemKey] = !value;
    this.setState({...this.state});
    localStorage.setItem(itemKey, JSON.stringify(!value));
  }

  setUserid(value) {
    this.setState({userid: value});
    
  }

  render(): React.ReactNode {
    const { openSetting, muteCamera, muteMicrophone, hideTime } = this.state;
    return <div>
      <div className="meeting-container">
        <div className="meeting-logo-wrapper">
          <div className="meeting-logo">
          <SettingOutlined onClick={()=> this.toggleSetting()} className="meeting-setting" />

        </div>
        </div>
        <div className="meeting-form">
          <Input onChange={(e)=> this.setUserid(e.target.value)}></Input>
          <Button onClick={()=> this.login()} className="meeting-login" type="primary">登陆</Button>
        </div>
      </div>
      <Drawer
        title="设置"
        placement="right"
        closable={false}
        onClose={() => {
          this.toggleSetting();
        }}
        open={openSetting}
      >
        <div className="setting-item">
          <div className="setting-item-label">入会开启摄像头</div>
          <Switch checked={!muteCamera} onChange={(e)=> this.toggleSettingItem('muteCamera', e)} className="setting-item-switch"></Switch>
        </div>
        <div className="setting-item m-t-sm">
          <div className="setting-item-label">入会开启麦克风</div>
          <Switch checked={!muteMicrophone} onChange={(e)=> this.toggleSettingItem('muteMicrophone', e)} className="setting-item-switch"></Switch>
        </div>
        <div className="setting-item m-t-sm">
          <div className="setting-item-label">入会显示时间</div>
          <Switch checked={!hideTime} onChange={(e)=> this.toggleSettingItem('hideTime', e)} className="setting-item-switch"></Switch>
        </div>
      </Drawer>
    </div>
  }
}