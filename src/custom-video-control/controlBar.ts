import QNProgress from "./progress";
import { QNVideoConfig } from "./types";
import { createElement } from "./utils";

class QNControlBar {

    // 自定义控制container
    container: HTMLDivElement;

    containerWrapper: HTMLDivElement;
    // 播放按钮
    playBtn: HTMLDivElement;
    // 暂停按钮
    pauseBtn: HTMLDivElement;
    // 静音按钮
    muteBtn: HTMLDivElement;
    // 取消静音按钮
    unmuteBtn: HTMLDivElement;
    // 全屏按钮
    fullScreenBtn: HTMLDivElement;
    // 退出全屏按钮
    exitFullScreenBtn: HTMLDivElement;
    // video时间显示
    videoTime: HTMLDivElement;

    volumeProgress: QNProgress;

    constructor(config: QNVideoConfig) {
        // 播放按钮
        this.playBtn = createElement('div', `qn-rtplayer-control-button qn-rtplayer-play`);
        // 暂停按钮
        this.pauseBtn = createElement('div', `qn-rtplayer-control-button qn-rtplayer-pause hidden`);
        // 时间按钮
        this.videoTime = createElement('div', 'qn-rtplayer-control-time');

        const leftContent = createElement('div', 'qn-rtplayer-control-left', [this.playBtn, this.pauseBtn, this.videoTime]);

        // 静音按钮
        this.muteBtn = createElement(
            'div',
            `qn-rtplayer-control-button qn-rtplayer-mute ${
                config.muted ? '' : 'hidden'
            }`
        );
        // 取消静音
        this.unmuteBtn = createElement(
            'div',
            `qn-rtplayer-control-button qn-rtplayer-unmute ${
                config.muted ? 'hidden' : ''
            }`
        );

        // 全屏按钮

        this.fullScreenBtn = createElement('div', 'qn-rtplayer-control-button qn-rtplayer-full')
        // 退出全屏按钮
        this.exitFullScreenBtn = createElement('div', 'qn-rtplayer-control-button qn-rtplayer-exit hidden')

        

        this.volumeProgress = new QNProgress(config.volume || 0);

        const rightContent = createElement('div', 'qn-rtplayer-control-right', [this.muteBtn, this.unmuteBtn, this.fullScreenBtn, this.exitFullScreenBtn, this.volumeProgress.container]);

        this.container = createElement('div', 'qn-rtplayer-control height-0', [
            leftContent,
            rightContent
        ]);
        this.containerWrapper = createElement('div', 'qn-rtplayer-control-wrapper', [this.container]);
    }
}

export default QNControlBar;