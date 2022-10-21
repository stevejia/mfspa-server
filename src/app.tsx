import { Layout } from "antd";
import React from "react";
import CustomVideo from "./components/custom-video";
import QNPlayer from "./components/qn-player";
const { Content, Footer, Header, Sider } = Layout;
import MfspaLayout from "./mfspa/layout";
class App extends React.Component {
  render() {
    return (
      // <MfspaLayout>
      //   <div id="mfspa-root" className="mfspa-content"></div>
      // </MfspaLayout>
      // <CustomVideo></CustomVideo>
        <QNPlayer></QNPlayer>
      );
  }
}

export default App;
