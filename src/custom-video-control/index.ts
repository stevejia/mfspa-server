import QNCameraControl from "./cameraControl";
import QNControlBar from "./controlBar";
import QNVideoPlayerEvent from "./event";
import { QNVideoConfig } from "./types";
import { createElement } from "./utils";

const DEFAULT_CONFIG: QNVideoConfig = {
    width: '100%',
    height: '100%',
    cameraControl: true,
    volume: 0.3
}

class QNVideoPlayer {
    // 播放器container
    playerContainer: HTMLDivElement;
    // 播放器本身
    private videoEl: HTMLVideoElement;
    // 播放器control
    private controlBar: QNControlBar;

    private cameraControl: QNCameraControl;
    private config: QNVideoConfig;

    constructor(config: QNVideoConfig = DEFAULT_CONFIG) {
        this.config = config;
        this.controlBar = new QNControlBar(config);
        this.createVideo(config);

        if(config.cameraControl) {
            this.cameraControl = new QNCameraControl(config);
        }
        this.createPlayerContainer();
        
        new QNVideoPlayerEvent(this.playerContainer, this.videoEl, this.controlBar, this.cameraControl);

    }

    private createVideo(config: QNVideoConfig) {
        const videoEl = createElement('video', 'qn-rtplayer-video');
        // qnVideoEl.autoplay = false;
        videoEl.muted = config.muted;
        videoEl.volume = config.volume;
        // qnVideoEl.preload = "auto";
        // videoEl.controls = true;
        videoEl.src = "http://100.100.34.255:8080/2K_60_6040.mp4";
        videoEl.autoplay = true;
        this.videoEl = videoEl;
    }

    private createPlayerContainer () {
        const playerContainer = createElement('div', 'qn-rtplayer-web', [this.videoEl, this.controlBar.containerWrapper]);
        if(this.cameraControl) {
            playerContainer.append(this.cameraControl.container);
        }
        this.playerContainer = playerContainer
    }
}

export default QNVideoPlayer;