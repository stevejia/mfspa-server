import React from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { createQNRtPlayer } from "../../custom-video-control/video-control";

import "../../custom-video-control/style.css";
import QNVideoPlayer from "../../custom-video-control";

class CustomVideo extends React.Component<any, any> {
    // private videoRef = null;

    private containerRef: HTMLDivElement = null;

    private quitDiv:HTMLDivElement;
    private fullDiv:HTMLDivElement;
    componentDidMount() {
        // const player = videojs(this.videoRef);
        // console.log(player);
        // const style = document.createElement('style');
        // style.innerHTML = `video::-webkit-media-controls-fullscreen-button {
        //     display: none;
        // }
        // video::-moz-media-controls-fullscreen-button {
        //     display: none;
        // }`
        // document.head.appendChild(style);

        const qnVideoPlayer = new QNVideoPlayer();
        this.containerRef.append(qnVideoPlayer.playerContainer);
        // this.containerRef.append(createQNRtPlayer());
        this.quitDiv.addEventListener('click', () => {
            setTimeout(() => {
                document.exitFullscreen();   
            });
        });

        // this.videoRef.addEventListener('webkitfullscreenchange', ()=> {
        //     console.log('change');
        //     // this.getCancelFullScreen().bind(document)();
        //     if((document as any).webkitIsFullScreen) {
        //         setTimeout(() => {
        //             this.quitDiv.click();
        //             setTimeout(() => {
        //                 this.fullDiv.click();
        //             });
        //         });
                

        //     }
        //     // this.fullScreen();
        // })

    }

    overrideFullScreen() {
        const root = document.documentElement as any;

        if(root.requestFullscreen) {
            root.requestFullscreen = this.fullScreenVideo.bind(this);
        }else if(root.webkitRequestFullscreen) {
            root.webkitRequestFullscreen = this.fullScreenVideo.bind(this);
        }else if(root.mozRequestFullScreen) {
            root.mozRequestFullScreen = this.fullScreenVideo.bind(this);
        }else if(root.msRequestFullscreen) {
            root.msRequestFullscreen = this.fullScreenVideo.bind(this);
        }
    }

    getReqFullScreen() {
        const root = document.documentElement as any;
        return root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen || root.msRequestFullscreen
    }

    getCancelFullScreen() {
        const root = document as any;
        return root.exitFullscreen || root.mozCancelFullScreen || root.webkitCancelFullScreen
    }


    fullScreenVideo() {
        console.log(this);
        // const fullScreen = this.getReqFullScreen();
        // console.log(fullScreen)
        // fullScreen.call(this.containerRef);
        // this.videoRef.style.width="100vw";
        // this.videoRef.style.height="100vh";
    }


    private fullScreen = () => {
        // const fullScreen = this.getReqFullScreen();
        // console.log(fullScreen)
        // fullScreen.call(this.containerRef);
        // this.videoRef.style.width="100vw";
        // this.videoRef.style.height="100vh";
        // this.videoRef.style.position='absolute';
        // this.videoRef.style.left=0;
        // this.videoRef.style.top=0;
    }

    render(): React.ReactNode {
        return <div style={{ width: '100%'}} ref={ref=> this.containerRef = ref} >
            <div style={{position: 'absolute', left: '10%', bottom: '20%', color: 'red', zIndex: 2}}>kdkaskdfkaskdf</div>
            {/* <video autoPlay controls width={600} height={400}>
                <source src="https://sdk-release.qnsdk.com/2K_60_6040.mp4"></source>
            </video> */}
            {/* <video style={{ height: 400}} controls>
                <source src="http://localhost:8080/2K_60_6040.mp4" type="video/mp4"/>

                </video> */}
            <div ref={ref=> this.fullDiv = ref} onClick={this.fullScreen}>fullScreen</div>

            <div ref={ref => this.quitDiv = ref}>quit</div>
            <div>
                <progress color="grey" max={100} value={33}></progress>
            </div>
        </div>
    }
}

export default CustomVideo;