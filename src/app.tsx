import { Layout } from "antd";
import React from "react";
import QNRtcPlayerDemo from "./components/qnrtc-player";
const { Content, Footer, Header, Sider } = Layout;
import MfspaLayout from "./mfspa/layout";
class App extends React.Component {
  render() {
    return (
      <MfspaLayout>
        {/* <div id="mfspa-root" className="mfspa-content"></div> */}
        <QNRtcPlayerDemo></QNRtcPlayerDemo>
      </MfspaLayout>
    );
  }
}

export default App;
