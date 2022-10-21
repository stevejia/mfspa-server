import React from "react";
import {QNRTPlayer} from 'qn-rtplayer-web';
class QNPlayer extends React.Component<any,any> {
    private containerRef;
    private player: QNRTPlayer;
    componentDidMount() {
        this.player = new QNRTPlayer();

        this.player.init({
            width: '100%',
            height: '100%',
            controls: true,
        });
        this.player.play('rtmp://pili-publish.qnsdk.com/sdk-live/sdk-direct-livestreaming-demo', this.containerRef);
    }
    render(): React.ReactNode {
        return <div ref={ref => this.containerRef = ref}></div>
    }
}

export default QNPlayer;