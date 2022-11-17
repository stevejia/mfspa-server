import { Layout } from "antd";
import React from "react";
import TestProxyStateComponent from "./components/test-proxy-state-component";
import Test2 from "./components/test-proxy-state-component/index2";
import WhiteBoard from "./components/white-board";
const { Content, Footer, Header, Sider } = Layout;
import MfspaLayout from "./mfspa/layout";
class App extends React.Component {
  render() {
    return (
      // <MfspaLayout>
      //   <div id="mfspa-root" className="mfspa-content"></div>
      // </MfspaLayout>
      // <WhiteBoard></WhiteBoard>
      <>
      <TestProxyStateComponent></TestProxyStateComponent>
      <Test2></Test2>
      </>
      );
  }
}

export default App;
