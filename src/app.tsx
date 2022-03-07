import { Layout } from "antd";
import React from "react";
const { Content, Footer, Header, Sider } = Layout;
import MfspaLayout from "./mfspa/layout";
class App extends React.Component {
  render() {
    return (
      <MfspaLayout>
        <div id="mfspa-root" className="mfspa-content"></div>
      </MfspaLayout>
    );
  }
}

export default App;
