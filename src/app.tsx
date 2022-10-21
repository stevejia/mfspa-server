import { Layout } from "antd";
import React from "react";
import WhiteBoard from "./components/white-board";
const { Content, Footer, Header, Sider } = Layout;
import MfspaLayout from "./mfspa/layout";
class App extends React.Component {
  render() {
    return (
      // <MfspaLayout>
      //   <div id="mfspa-root" className="mfspa-content"></div>
      // </MfspaLayout>
      <WhiteBoard></WhiteBoard>
    );
  }
}

export default App;
