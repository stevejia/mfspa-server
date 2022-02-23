import * as React from "react";
import { Layout } from "antd";
const { Content } = Layout;
import "./index.less";
import MfspaRouter from "../../router";
class MfspaContent extends React.Component<any, any, any> {
  render() {
    const { children } = this.props;
    return (
      <Content>
        <MfspaRouter>{children}</MfspaRouter>
      </Content>
    );
  }
}

export default MfspaContent;
