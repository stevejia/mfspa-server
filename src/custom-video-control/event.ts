import QNCameraControl from "./cameraControl";
import QNControlBar from "./controlBar";
import {CAMERA_CONTROL_TYPE} from "./types";
import {formatTime, getDistance} from "./utils";


class QNVideoPlayerEvent {
    private videoEl : HTMLVideoElement;
    private playerContainer : HTMLDivElement;

    private controlBar : QNControlBar;
    private cameraControl : QNCameraControl;

    private _dotMouseMoveEvent : any;

    // // 自定义控制container
    // container: HTMLDivElement;
    // // 播放按钮
    // playBtn: HTMLButtonElement;
    // // 暂停按钮
    // pauseBtn: HTMLButtonElement;
    // // 静音按钮
    // muteBtn: HTMLButtonElement;
    // // 取消静音按钮
    // unmuteBtn: HTMLButtonElement;
    // // 全屏按钮
    // fullScreenBtn: HTMLButtonElement;
    // // 退出全屏按钮
    // exitFullScreenBtn: HTMLButtonElement;
    // // video时间显示
    // videoTime: HTMLDivElement;

    private changingVolume : boolean = false;
    private _mouseupEvent : any;

    private controlBarTimer;
    constructor(playerContainer : HTMLDivElement, videoEl : HTMLVideoElement, controlBar : QNControlBar, cameraControl : QNCameraControl) {
        this._dotMouseMoveEvent = this.dotMouseMoveEvent.bind(this);
        this._mouseupEvent = this.mouseupEvent.bind(this);
        this.playerContainer = playerContainer;
        this.videoEl = videoEl;
        this.controlBar = controlBar;
        this.cameraControl = cameraControl;
        this.registerEvents();
        // const {playBtn, pauseBtn, muteBtn, unmuteBtn, fullScreenBtn, exitFullScreenBtn, videoTime} = controlBar;
        // Object.assign(this, {playBtn, pauseBtn, muteBtn, unmuteBtn, fullScreenBtn, exitFullScreenBtn, videoTime});
    }

    private autoplay : boolean = true;

    private cameraControlTimer;

    registerEvents() {
        this.registerGlobalEvents();
        this.registerVideoEvents();
        this.registerControlEvents();
        this.registreCameraControlEvents();
    }

    /**
     * 注册播放器video的事件
     * @param playerContainer 播放器container
     * @param videoEl 播放器video
     * @param controlBar 播放器控制
     */
    private registerVideoEvents() {
        const {videoEl, playerContainer, controlBar} = this;
        let durationText = "00:00";
        videoEl.addEventListener('canplay', () => {
            durationText = formatTime(videoEl.duration);
        })

        videoEl.addEventListener('play', () => {
            controlBar.playBtn.classList.add('hidden');
            controlBar.pauseBtn.classList.remove('hidden');
            if (this.autoplay) {
                let timer = setTimeout(() => {
                    controlBar.container.classList.add('height-0');
                    clearTimeout(timer);
                    timer = null;
                }, 400);
            } else {
                this.controlBarTimer = setTimeout(() => {
                    controlBar.container.classList.add('height-0');
                    playerContainer.style.cursor = 'none';
                }, 3000);
            }
            // controlBar.container.classList.add('height-0');
        });

        videoEl.addEventListener('pause', () => {
            controlBar.pauseBtn.classList.add('hidden');
            controlBar.playBtn.classList.remove('hidden');
            if (this.controlBarTimer) {
                clearTimeout(this.controlBarTimer);
                this.controlBarTimer = null;
            }
            controlBar.container.classList.remove('height-0');
            controlBar.container.style.cursor = 'inherit';
        })

        // videoEl.addEventListener('dblclick', () => {
        //     const isFullScreen = (document as any).webkitIsFullScreen;
        //     if (isFullScreen) {

        //         this.exitFullScreen();
        //         return;
        //     }
        //     this.reqFullScreen();
        // }, {passive: false})

        // videoEl.addEventListener('click', () => {
        //     const paused = videoEl.paused;
        //     if (paused) {
        //         this.autoplay = false;
        //         this.controlBarTimer = setTimeout(() => {
        //             controlBar.container.classList.add('height-0');
        //             playerContainer.style.cursor = 'none';
        //         }, 3000);
        //         videoEl.play();
        //         return false;
        //     }
        //     videoEl.pause();
        //     return false;
        // })

        videoEl.addEventListener('volumechange', () => {

            const {volume, muted} = videoEl;

            if (muted) {
                controlBar.unmuteBtn.classList.add('hidden');
                controlBar.muteBtn.classList.remove('hidden');
            } else {
                controlBar.muteBtn.classList.add('hidden');
                controlBar.unmuteBtn.classList.remove('hidden');
            }
        });
        playerContainer.addEventListener('mousemove', (event) => {

            if (event.target !== videoEl) {
                if (this.controlBarTimer) {
                    clearTimeout(this.controlBarTimer);
                    this.controlBarTimer = null;
                }
                return false;
            }

            playerContainer.style.cursor = 'inherit';
            if (this.changingVolume) {
                return;
            }

            if (videoEl.paused) {
                return;
            }

            controlBar.container.classList.remove('height-0');
            if (this.controlBarTimer) {
                clearTimeout(this.controlBarTimer);
                this.controlBarTimer = null;
            }
            this.controlBarTimer = setTimeout(() => {
                controlBar.container.classList.add('height-0');
                playerContainer.style.cursor = 'none';
            }, 3000);
        });

        playerContainer.addEventListener('mouseleave', () => {
            if (videoEl.paused) {
                return;
            }
            controlBar.container.classList.add('height-0');
        })

        videoEl.addEventListener('loadeddata', () => {
            const {clientWidth, clientHeight, videoWidth, videoHeight} = videoEl;
            this.getControlBarWidth(clientWidth, clientHeight, videoWidth, videoHeight);
        })

    }

    private getControlBarWidth = (clientWidth : number, clientHeight : number, videoWidth : number, videoHeight : number, resize? : boolean) => {
        console.log(333);
        const aspectRatio = videoWidth / videoHeight;
        const {cameraControl} = this;
        const currentRatio = clientWidth / clientHeight;
        console.log('camera control');
        if (currentRatio >= aspectRatio) {
            const barWidth = clientHeight * videoWidth / videoHeight;
            this.controlBar.container.style.width = `${barWidth}px`;
            this.controlBar.container.classList.remove('height-0');
            if (cameraControl) {
                console.log('has camera control')
                cameraControl.content.style.width = `${barWidth}px`;
                if (!resize) {
                    cameraControl.content.classList.remove('hidden');
                }
            }
        } else {
            const bottom = (clientHeight - clientWidth / videoWidth * videoHeight) / 2;
            this.controlBar.container.style.bottom = `${bottom}px`;
        }
    }

    private reqFullScreen() {
        this.controlBar.fullScreenBtn.classList.add('hidden');
        this.controlBar.exitFullScreenBtn.classList.remove('hidden');
        const doc = document as any;
        console.log(document.fullscreenEnabled);
        if (document.fullscreenEnabled) {
            const root = doc.documentElement || doc.documentElement || doc.documentElement || doc.documentElement || null


            // const root = (document.documentElement as any) as any;
            console.log(document.fullscreenEnabled, root.requestFullScreen, root.webkitRequestFullScreen, root.mozRequestFullScreen, root.msRequestFullscreen);
            var reqFullScreen = root.requestFullScreen || root.webkitRequestFullScreen || root.mozRequestFullScreen || root.msRequestFullscreen;
            reqFullScreen.call(this.playerContainer);
            window.screen.orientation.lock("landscape-secondary")
            console.log(screen.orientation.type);
        } else {
            this.horizontalScreen();
        }


        // const keys = Object.keys(document.documentElement);
        // debugger;
        // console.log(document.documentElement.webkitRequestFullscreen);
        // if ((document.documentElement as any).requestFullscreen) {
        //     (document.documentElement as any).requestFullscreen.call(this.playerContainer);
        // } else if ((document.documentElement as any).mozRequestFullScreen) {
        //     (document.documentElement as any).mozRequestFullScreen.call(this.playerContainer);
        // } else if ((document.documentElement as any).webkitRequestFullscreen) {
        //     (document.documentElement as any).webkitRequestFullscreen.call(this.playerContainer);
        // } else if ((document.documentElement as any).msRequestFullscreen) {
        //     (document.documentElement as any).msRequestFullscreen.call(this.playerContainer);
        // }
        // this.horizontalScreen();
    }

    /*强制横屏*/
    horizontalScreen() { // transform 强制横屏
        var conW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var conH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        // transform: rotate(90deg); width: 667px; height: 375px;transform-origin:28% 50%;
        // var iosTopHe = 0;//若有其他样式判断，写于此

        const cssObj = {
            "transform": "rotate(90deg) translate(" + (
                (conH - conW) / 2
            ) + "px," + (
                (conH - conW) / 2
            ) + "px)",
            "width": conH + "px",
            "height": conW + "px",
            // "margin-top":iosTopHe+"px",
            // "border-left":iosTopHe+"px solid #000",
            "transform-origin": "center center",
            "-webkit-transform-origin": "center center",
            position: 'fixed',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: '#000000'
        };


        let cssText = '';

        Object.keys(cssObj).forEach(key => {
            cssText += `${key}: ${
                cssObj[key]
            };`;
        })

        console.log(cssText);

        this.playerContainer.style.cssText = cssText;
    }

    private exitFullScreen() {
        this.controlBar.fullScreenBtn.classList.remove('hidden');
        this.controlBar.exitFullScreenBtn.classList.add('hidden');
        if (document.fullscreenEnabled) {
            const doc = document as any;
            const exitFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
            exitFullScreen.bind(doc)();
        } else {
            this.playerContainer.style.cssText = 'cursor: none';
        }

    }

    /**
     * 注册播放器控制器事件
     * @param playerContainer 播放器container
     * @param videoEl 播放器video
     * @param controlBar 播放器控制器
     */
    private registerControlEvents() {
        const {controlBar, playerContainer, videoEl} = this;
        controlBar.fullScreenBtn.addEventListener('click', () => {
            this.reqFullScreen();
        })

        controlBar.exitFullScreenBtn.addEventListener('click', () => {
            this.exitFullScreen();

        })

        controlBar.muteBtn.addEventListener('click', () => { // 如果vide volume = 0，则无法取消静音
            if (videoEl.volume === 0) {
                return;
            }
            videoEl.muted = false;
            controlBar.volumeProgress.progressValue = videoEl.volume;
        });

        controlBar.unmuteBtn.addEventListener('click', () => {
            videoEl.muted = true;
            // 静音下 音量进度条值为0
            controlBar.volumeProgress.progressValue = 0;
        });

        let timer = null;

        controlBar.muteBtn.addEventListener('mouseover', () => {
            clearTimeout(timer);
            timer = null;
            controlBar.volumeProgress.container.classList.remove('width-0');
        })

        controlBar.unmuteBtn.addEventListener('mouseover', () => {
            clearTimeout(timer);
            timer = null;
            controlBar.volumeProgress.container.classList.remove('width-0');
        })

        controlBar.muteBtn.addEventListener('mouseleave', () => {
            timer = setTimeout(() => {
                controlBar.volumeProgress.container.classList.add('width-0');
                controlBar.volumeProgress.progressDot.classList.add('hidden');
            }, 500);
        })

        controlBar.unmuteBtn.addEventListener('mouseleave', () => {
            timer = setTimeout(() => {
                controlBar.volumeProgress.container.classList.add('width-0');
                controlBar.volumeProgress.progressDot.classList.add('hidden');
            }, 500);
        });

        controlBar.volumeProgress.container.addEventListener('mouseover', () => {
            clearTimeout(timer);
            timer = null;
        });


        controlBar.volumeProgress.container.addEventListener('mouseleave', () => {
            if (!this.changingVolume) {
                controlBar.volumeProgress.container.classList.add('width-0');
                controlBar.volumeProgress.progressDot.classList.add('hidden');
            }

        })

        controlBar.volumeProgress.container.addEventListener('mouseover', (event) => {
            controlBar.volumeProgress.progressDot.classList.remove('hidden');
        })
        controlBar.volumeProgress.container.addEventListener('mousedown', (event) => {
            const {clientX} = event;
            const rect = controlBar.volumeProgress.container.getBoundingClientRect();
            const {width, left} = rect;

            const offset = clientX - left;

            let volume = offset / width;
            volume = Math.max(0, volume);
            volume = Math.min(1, volume);

            controlBar.volumeProgress.progressValue = volume;
            videoEl.volume = volume;

            if (volume === 0) {
                controlBar.muteBtn.classList.remove('hidden');
                controlBar.unmuteBtn.classList.add('hidden');
            }
            if (volume > 0) {
                videoEl.muted = false;
            }
        });
        controlBar.volumeProgress.progressDot.addEventListener('mousedown', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.changingVolume = true;
            document.addEventListener('mousemove', this._dotMouseMoveEvent, false);
            document.addEventListener('mouseup', this._mouseupEvent, false);
        })

        controlBar.volumeProgress.progressDot.addEventListener('mouseup', (event) => {})


        controlBar.playBtn.addEventListener('click', () => {
            this.autoplay = false;


            videoEl.play();
        })

        controlBar.pauseBtn.addEventListener('click', () => {
            videoEl.pause();
        })

        let durationText = "00:00";
        let duration = null;
        controlBar.videoTime.innerHTML = `${
            formatTime(videoEl.currentTime)
        }  /  ${durationText}`;
        setInterval(() => {
            if (videoEl.duration !== duration) {
                durationText = formatTime(videoEl.duration);
                duration = videoEl.duration;
            }
            controlBar.videoTime.innerHTML = `${
                formatTime(videoEl.currentTime)
            }  /  ${durationText}`;
        }, 1000);

        controlBar.container.addEventListener('mousemove', (event) => {
            // event.stopPropagation();
            // event.preventDefault();

        })
        controlBar.container.addEventListener('mouseleave', (event) => {
            if (this.controlBarTimer) {
                clearTimeout(this.controlBarTimer);
                this.controlBarTimer = null;
            }
        })
    }

    private dotMouseMoveEvent = (event : MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const {controlBar, videoEl} = this;

        const {clientX, clientY} = event;

        const {left, width} = controlBar.volumeProgress.container.getBoundingClientRect();
        const offset = clientX - left;

        let volume = offset / width;
        volume = Math.max(0, volume);
        volume = Math.min(1, volume);

        controlBar.volumeProgress.progressValue = volume;
        videoEl.volume = volume;

        if (volume === 0) {
            controlBar.muteBtn.classList.remove('hidden');
            controlBar.unmuteBtn.classList.add('hidden');
        }
        if (volume > 0) {
            videoEl.muted = false;
        }
    }

    private mouseupEvent = (event : MouseEvent) => {
        const {controlBar} = this;

        event.preventDefault();
        event.stopPropagation();
        this.changingVolume = false;
        const {clientX, clientY} = event;

        const {width, height, left, top} = controlBar.volumeProgress.container.getBoundingClientRect();

        if (!(clientX >= left && clientX <= width + left && clientY >= top && clientY <= top + height)) {
            controlBar.volumeProgress.container.classList.add('width-0');
            controlBar.volumeProgress.progressDot.classList.add('hidden');
        }
        document.removeEventListener('mouseup', this._mouseupEvent, false);
        document.removeEventListener('mousemove', this._dotMouseMoveEvent, false);
    }

    private registerGlobalEvents() {
        const {controlBar, cameraControl} = this;

        const fullScreenChange = (event) => {
            console.log('fullscreenchange')
            const isFullScreen = (document as any).webkitIsFullScreen;
            if (! isFullScreen) {
                controlBar.fullScreenBtn.classList.remove('hidden');
                controlBar.exitFullScreenBtn.classList.add('hidden');
                controlBar.container.classList.remove('full-screen-width');
                if (cameraControl) {
                    cameraControl.content.classList.remove('full-screen-width');
                }

            } else {
                controlBar.container.classList.add('full-screen-width');
                if (cameraControl) {
                    cameraControl.content.classList.add('full-screen-width');
                }

            }
        }

        document.addEventListener('fullscreenchange', fullScreenChange);

        document.addEventListener('webkitfullscreenchange', fullScreenChange);

        document.addEventListener('mozfullscreenchange', fullScreenChange);

        document.addEventListener('msfullscreenchange', fullScreenChange);
        let resizeTimer;
        window.onresize = () => {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
                resizeTimer = null;
            }
            const {clientWidth, clientHeight, videoHeight, videoWidth} = this.videoEl;
            resizeTimer = setTimeout(() => {
                this.getControlBarWidth(clientWidth, clientHeight, videoWidth, videoHeight, true);
            }, 300);
        }

        let startDistance;
        let endDistance;
        this.playerContainer.addEventListener('touchmove', (event) => {
            event.preventDefault();
            const touches = event.touches;
            if (touches.length === 2) {
                console.log('双指操作中。。。');
                const {clientX: x1, clientY: y1} = touches[0];
                const {clientX: x2, clientY: y2} = touches[1];
                const newDistance = getDistance(x1, y1, x2, y2);
                if (! startDistance) {
                    startDistance = newDistance;
                }
                endDistance = newDistance;

            }
        }, {passive: false});

        this.playerContainer.addEventListener('touchend', (event) => {
            console.log(event.touches);
            if (startDistance && endDistance) {
                const ratio = endDistance / startDistance;
                if (ratio > 1) {
                    this.cameraControl.virtualDir.innerText = `${
                        CAMERA_CONTROL_TYPE.ZOOM_IN
                    }`;
                } else if (ratio < 1) {
                    this.cameraControl.virtualDir.innerText = `${
                        CAMERA_CONTROL_TYPE.ZOOM_OUT
                    }`;
                }
            }

            startDistance = null;
            endDistance = null;
        });
        // 禁用双击放大
        let lastTouchEnd = 0;
        document.documentElement.addEventListener('touchend', function (event) {
            var now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, {passive: false});

    }

    private registreCameraControlEvents() {
        const {cameraControl} = this;
        if (cameraControl) {
            const callback = (type : CAMERA_CONTROL_TYPE) => {
                console.log('callback', type);
                cameraControl.virtualDir.innerText = `${type}`;
            }
            cameraControl.dirUp.addEventListener('mousedown', this.onCameraControl(CAMERA_CONTROL_TYPE.UP, callback).bind(this), false);
            cameraControl.dirUp.addEventListener('mouseup', this.offCameraControl(CAMERA_CONTROL_TYPE.UP).bind(this), false);

            cameraControl.dirRight.addEventListener('mousedown', this.onCameraControl(CAMERA_CONTROL_TYPE.RIGHT, callback).bind(this), false);
            cameraControl.dirRight.addEventListener('mouseup', this.offCameraControl(CAMERA_CONTROL_TYPE.RIGHT).bind(this), false);


            cameraControl.dirDown.addEventListener('mousedown', this.onCameraControl(CAMERA_CONTROL_TYPE.BOTTOM, callback).bind(this), false);
            cameraControl.dirDown.addEventListener('mouseup', this.offCameraControl(CAMERA_CONTROL_TYPE.BOTTOM).bind(this), false);


            cameraControl.dirLeft.addEventListener('mousedown', this.onCameraControl(CAMERA_CONTROL_TYPE.LEFT, callback).bind(this), false);
            cameraControl.dirLeft.addEventListener('mouseup', this.offCameraControl(CAMERA_CONTROL_TYPE.LEFT).bind(this), false);


            cameraControl.zoomIn.addEventListener('mousedown', this.onCameraControl(CAMERA_CONTROL_TYPE.ZOOM_IN, callback).bind(this), false);
            cameraControl.zoomIn.addEventListener('mouseup', this.offCameraControl(CAMERA_CONTROL_TYPE.ZOOM_IN).bind(this), false);

            cameraControl.zoomOut.addEventListener('mousedown', this.onCameraControl(CAMERA_CONTROL_TYPE.ZOOM_OUT, callback).bind(this), false);
            cameraControl.zoomOut.addEventListener('mouseup', this.offCameraControl(CAMERA_CONTROL_TYPE.ZOOM_OUT).bind(this), false);

            let rect: DOMRect;
            let direction: CAMERA_CONTROL_TYPE;
            const dirAllTouchMoveEvent = (event : TouchEvent) => {
                event.preventDefault();
                const {left, top, width, height} = rect;
                const centerPos = {
                    x: left + width / 2,
                    y: top + height / 2
                }
                const {changedTouches} = event;
                const touch = changedTouches[0];
                const {clientX, clientY} = touch;
                const len = Math.sqrt(Math.pow(clientX - centerPos.x, 2) + Math.pow(clientY - centerPos.y, 2));
                const deltaX = (clientX - centerPos.x);
                const deltaY = (clientY - centerPos.y);
                const cosAng = deltaX / len;
                const sinAng = deltaY / len;
                cameraControl.dirAll.style.left = `${
                    40 * cosAng + 40
                }px`;
                cameraControl.dirAll.style.top = `${
                    40 * sinAng + 40
                }px`;

                const angle = Math.acos(cosAng);
                const newDir = getDirection(angle, deltaY);
                if (direction !== newDir) {
                    callback(newDir);
                    this._controlCamera(newDir, callback);
                    direction = newDir;
                }
            }
            const getDirection = (angle : number, deltaY : number) => {
                let dir: CAMERA_CONTROL_TYPE;
                if (angle >= 0 && angle < Math.PI / 4) { // [0, π/4]时表示方向向右
                    cameraControl.dirRight.classList.add('move');
                    cameraControl.dirLeft.classList.remove('move');
                    cameraControl.dirUp.classList.remove('move');
                    cameraControl.dirDown.classList.remove('move');
                    dir = CAMERA_CONTROL_TYPE.RIGHT;

                } else if (angle >= Math.PI / 4 && angle < Math.PI * 3 / 4) {
                    // [π/4, π3/4]时，需要根据deltaY的值判断向上/向下
                    // deltaY<0表示向上 >0表示向下
                    if (deltaY < 0) {
                        cameraControl.dirUp.classList.add('move');
                        cameraControl.dirLeft.classList.remove('move');
                        cameraControl.dirRight.classList.remove('move');
                        cameraControl.dirDown.classList.remove('move');
                        dir = CAMERA_CONTROL_TYPE.UP;
                    } else {
                        cameraControl.dirDown.classList.add('move');
                        cameraControl.dirLeft.classList.remove('move');
                        cameraControl.dirRight.classList.remove('move');
                        cameraControl.dirUp.classList.remove('move');
                        dir = CAMERA_CONTROL_TYPE.BOTTOM;
                    }
                } else if (angle >= Math.PI * 3 / 4 && angle <= Math.PI) { // [π3/4, π]时，表示方向向左
                    cameraControl.dirLeft.classList.add('move');
                    cameraControl.dirDown.classList.remove('move');
                    cameraControl.dirRight.classList.remove('move');
                    cameraControl.dirDown.classList.remove('move');
                    dir = CAMERA_CONTROL_TYPE.LEFT;
                }
                return dir;
            }


            const dirAllTouchEndEvent = () => {
                cameraControl.dirAll.classList.remove('qn-camera-control-inner-move');
                cameraControl.dirAll.style.left = '';
                cameraControl.dirAll.style.top = '';
                cameraControl.dirRight.classList.remove('move');
                cameraControl.dirLeft.classList.remove('move');
                cameraControl.dirUp.classList.remove('move');
                cameraControl.dirDown.classList.remove('move');

                clearTimeout(this.cameraControlTimer);
                this.cameraControlTimer = null;
                document.removeEventListener('touchmove', dirAllTouchMoveEvent);
                document.removeEventListener('touchend', dirAllTouchEndEvent);
            }
            cameraControl.dirAll.addEventListener('touchstart', (event) => {
                console.log('touch start');
                rect = cameraControl.dirAll.getBoundingClientRect();
                cameraControl.dirAll.classList.add('qn-camera-control-inner-move');
                document.addEventListener('touchmove', dirAllTouchMoveEvent, {passive: false});
                document.addEventListener('touchend', dirAllTouchEndEvent, {passive: false});
            }, {passive: false})
        }
    }

    private onCameraControl(type : CAMERA_CONTROL_TYPE, callback) {
        console.log(type);
        return() => {
            callback(type);
            this._controlCamera(type, callback);
        }
    }

    private _controlCamera(type : CAMERA_CONTROL_TYPE, callback) {
        if (this.cameraControlTimer) {
            clearTimeout(this.cameraControlTimer);
            this.cameraControlTimer = null;
        }
        this.cameraControlTimer = setTimeout(() => {
            callback(type);
            clearTimeout(this.cameraControlTimer);
            this.cameraControlTimer = null;
            this._controlCamera(type, callback);
        }, 500);
    }

    private offCameraControl(type : CAMERA_CONTROL_TYPE) {
        return() => {
            this._offCameraControl(type);
        }
    }

    private _offCameraControl(type : CAMERA_CONTROL_TYPE) {
        if (this.cameraControlTimer) {
            clearTimeout(this.cameraControlTimer);
            this.cameraControlTimer = null;
        }
    }

}

export default QNVideoPlayerEvent;
