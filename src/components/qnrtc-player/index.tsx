import React from "react";

import { QNRTPlayer } from "qn-rtplayer-web";
import { Button, Input } from "antd";

class QNRtcPlayerDemo extends React.Component<any, any> {
  private player: QNRTPlayer = null;
  private playerRef: HTMLDivElement = null;
  state = {
    url: "",
  };
  componentDidMount(): void {
    this.player = new QNRTPlayer();
    this.player.init({
      className: "test",
      width: "100%",
      height: "100%",
      objectFit: "contain",
      volumn: 1,
      controls: false,
      playsinline: true,
      audioOnly: false,
    });
  }

  private play = () => {
    this.player.play(this.state.url, this.playerRef);
  };
  render(): React.ReactNode {
    const { url } = this.state;
    return (
      <div className="qn-rtplayer-web">
        <div>
          <Input
            addonBefore="播放地址"
            value={url}
            onChange={(e) => this.setState({ url: e.target.value })}
          ></Input>
        </div>
        <div
          style={{ width: 800, height: 600, background: "grey" }}
          className="qn-rtplayer-container"
          ref={(ref) => (this.playerRef = ref)}
        ></div>
        <Button type="primary" onClick={this.play}>
          播放
        </Button>
      </div>
    );
  }
}

export default QNRtcPlayerDemo;
