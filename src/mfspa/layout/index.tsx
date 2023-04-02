import * as React from "react";

import { Layout } from "antd";
const { Content, Footer, Header, Sider } = Layout;
import "./index.less";
import MfspaSider from "./sider";
import MfspaRouter from "../router";
import MfspaContent from "./content";
class MfspaLayout extends React.Component<any, any, any> {
  render() {
    const { children } = this.props;
    return (
      <Layout className="mfspa-container">
        <MfspaSider>Sider</MfspaSider>
        <Layout>
          <Header className="mfspa-header">Mfspa 测试站</Header>
          <MfspaContent>{children}</MfspaContent>
          <Footer className="mfspa-footer">
            <a target="blank" href="https://beian.miit.gov.cn/">备案号：皖ICP备2022005345号</a>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default MfspaLayout;
