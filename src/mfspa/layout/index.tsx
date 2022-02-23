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
          {/* <Footer>Footer</Footer> */}
        </Layout>
      </Layout>
    );
  }
}

export default MfspaLayout;
