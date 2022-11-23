import { Layout } from "antd";
import React from "react";
import TestRotateResize from "./components/rotate-resize";
const { Content, Footer, Header, Sider } = Layout;
import MfspaLayout from "./mfspa/layout";
class App extends React.Component {
  render() {
    return (
      // <MfspaLayout>
      //   <div id="mfspa-root" className="mfspa-content"></div>
      // </MfspaLayout>
      <TestRotateResize></TestRotateResize>
    );
  }
}

export default App;
