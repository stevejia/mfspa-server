import { Layout } from "antd";
import React from "react";
import OpenAward from "./components/open-award";
const { Content, Footer, Header, Sider } = Layout;
import MfspaLayout from "./mfspa/layout";
class App extends React.Component {
  render() {
    return (
      // <MfspaLayout>
      //   <div id="mfspa-root" className="mfspa-content"></div>
      // </MfspaLayout>
      <OpenAward></OpenAward>
    );
  }
}

export default App;
