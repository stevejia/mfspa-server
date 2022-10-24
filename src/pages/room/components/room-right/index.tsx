import React from "react";
import { BaseProps, RIGHT_TYPE } from "../../../../types/types";
import { QNRemoteUser } from "qnweb-rtc";
import Chat from "./chat";
import './index.less';
interface RoomRightProps extends BaseProps {
    open: boolean;
    type: RIGHT_TYPE;
}

interface RoomRightState {

}

export default class RoomRight extends React.Component<RoomRightProps, RoomRightState> {
  componentDidMount(): void {

  }
  render() {
    console.log('this.props.children', this.props.children);
    return <div className={`room-right${this.props.open? ' visible' : ''}`}>
      {this.props.children }
    </div>
  }
}