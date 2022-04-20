import { Modal } from "antd";
import React from "react";
import request from "../../request/request";
import "./index.less";

import config from "../../../mfspa.config";
export default class DebugMode extends React.Component<any, any> {
  private quitDebug = () => {
    const { currentAppName, quitDebug } = this.props;
    Modal.confirm({
      content: "确认退出调试模式？",
      async onOk() {
        await request.del(`${config.nodeHost}api/v1/debuginfo/delete`, {
          appName: currentAppName,
        });
        console.log("delete success");
        quitDebug && quitDebug();
      },
    });
  };
  render() {
    const { currentAppName } = this.props;
    return (
      <div className="mfspa-debug-mode">
        调试模式
        <div>{currentAppName}</div>
        <div onClick={this.quitDebug}>退出调试模式</div>
      </div>
    );
  }
}
