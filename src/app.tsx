import { Layout } from "antd";
import React from "react";
import QNPlayerDemo from "./components/qnplayer-demo";
import QNRtcPlayerDemo from "./components/qnrtc-player";
const { Content, Footer, Header, Sider } = Layout;
import MfspaLayout from "./mfspa/layout";
class App extends React.Component {
  render() {
    return (
      <MfspaLayout>
        {/* <div id="mfspa-root" className="mfspa-content"></div> */}
        {/* <QNRtcPlayerDemo></QNRtcPlayerDemo> */}
        <QNPlayerDemo></QNPlayerDemo>
      </MfspaLayout>
    );
  }
}

export default App;
