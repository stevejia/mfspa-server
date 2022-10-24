import { Button, Input, Select } from "antd";
import React from "react";
import { BaseProps } from "../../../../types/types";
import { QNRemoteUser } from "qnweb-rtc";
import "./chat.less";
import { getCommonData } from "../../../../utils";
interface ChatProps extends BaseProps {
  onSendMessage?: (userid: string, message: string) => void;
  hidden: boolean;
  users: QNRemoteUser[];
  messageList: { userid: string; message: string }[];
}
interface ChatState {
  messageList: { userid: string; message: string }[];
  message: string;
  selectUser: string;
}

export default class Chat extends React.Component<ChatProps, ChatState> {
  state = {
    messageList: [
      {
        userid: "93939494",
        message: "skfkaskdfjkasdfj",
      },
    ],
    message: "",
    selectUser: "chat_all_user",
  };
  private lastKey = "";
  componentDidMount(): void {}
  onSendMessage() {
    const { userid } = getCommonData();
    const { message, selectUser, messageList } = this.state;
    if (!message) {
      console.log("不能发送空信息");
      return;
    }
    const { onSendMessage } = this.props;
    onSendMessage && onSendMessage(selectUser, message);
    // messageList.push({ userid, message });
    // this.setState({ messageList });
  }
  render() {
    const { hidden, users, messageList } = this.props;
    const { selectUser } = this.state;
    const { userid } = getCommonData();
    return (
      <div hidden={hidden} className="room-chat">
        <div className="message-container">
          {messageList.map((item) => {
            return (
              <div className={`message-item${userid === item.userid ? ' item-right' : ''}`}>
                <div className="userid">{item.userid}</div>
                <div className="message-wrapper">
                  <div className="message">{item.message}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="chat-footer">
          <div className="footer-top">
            <div>
              发送至
              <Select
                value={selectUser}
                onChange={(e) => this.setState({ selectUser: e })}
                bordered={false}
                className="sender-select"
                allowClear={false}
              >
                <Select.Option value="chat_all_user">所有人</Select.Option>
                {users?.map((user) => (
                  <Select.Option key={user.userID} value={user.userID}>
                    {user.userID}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <Button
              type="primary"
              onClick={() => this.onSendMessage()}
              size="small"
            >
              发送
            </Button>
          </div>
          <div className="footer-bottom">
            <Input.TextArea
              onChange={(e) => this.setState({ message: e.target.value })}
              placeholder="说点什么"
            ></Input.TextArea>
          </div>
        </div>
      </div>
    );
  }
}
