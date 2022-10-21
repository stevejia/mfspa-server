const controlStyleEl = document.createElement('style');
controlStyleEl.id = 'qn-video-control';
const createQNRtPlayer = () => {

    const qnVideoEl = createQNVideo();
    const qnRtPlayer = createElement('div', 'qn-rtplayer-web', [qnVideoEl]);
    const qnVideControl = createQNControl(qnVideoEl, qnRtPlayer);
    const cameraControl = createElement('div');
    cameraControl.innerHTML = "3ksadf";
    cameraControl.style.position = "absolute";
    cameraControl.style.left = "10%";
    cameraControl.style.bottom = "20%";
    cameraControl.style.color = "red";

    cameraControl.addEventListener('click', () => {
        console.log('cameraControl')
    })
    qnRtPlayer.append(qnVideControl);
    qnRtPlayer.append(cameraControl);
    setControlStyle(`.qn-rtplayer-web {
            width: 100%;
            height: 100%;
            position: relative;
        }
        .qn-rtplayer-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        `)
    document.head.appendChild(controlStyleEl);
    return qnRtPlayer;
}

const createQNVideo = () : HTMLVideoElement => {
    const qnVideoEl = createElement('video', 'qn-rtplayer-video');
    qnVideoEl.autoplay = true;
    qnVideoEl.muted = true;
    qnVideoEl.preload = "auto";
    // qnVideoEl.controls = true;
    qnVideoEl.src = "http://localhost:8080/2K_60_6040.mp4";
    // qnVideoEl.src = "https://sdk-release.qnsdk.com/2K_60_6040.mp4";
    return qnVideoEl;
}

const createQNControl = (qnVideoEl : HTMLVideoElement, qnRtPlayer : HTMLElement) : HTMLDivElement => {
    const playBtn = createElement('button', `qn-rtplayer-control-button qn-rtplayer-play`);

    const pauseBtn = createElement('button', `qn-rtplayer-control-button qn-rtplayer-pause hidden`);

    const muteBtn = createElement(
        'button',
        `qn-rtplayer-control-button qn-rtplayer-mute ${
            qnVideoEl.muted ? '' : 'hidden'
        }`
    );

    const unmuteBtn = createElement(
        'button',
        `qn-rtplayer-control-button qn-rtplayer-unmute ${
            qnVideoEl.muted ? 'hidden' : ''
        }`
    );
    const fullScreenBtn = createElement('button', 'qn-rtplayer-control-button qn-rtplayer-full')

    const exitBtn = createElement('button', 'qn-rtplayer-control-button qn-rtplayer-exit hidden')


    document.addEventListener('fullscreenchange', () => {
        const isFullScreen = (document as any).webkitIsFullScreen;
        if (! isFullScreen) {
            fullScreenBtn.classList.remove('hidden');
            exitBtn.classList.add('hidden');
        }
    })

    const time = createElement('div', 'qn-rtplayer-control-time');
    let durationText = "00:00";
    time.innerHTML = `${
        timeToMinute(qnVideoEl.currentTime)
    }  /  ${durationText}`;
    setInterval(() => {
        time.innerHTML = `${
            timeToMinute(qnVideoEl.currentTime)
        }  /  ${durationText}`;
    }, 1000);

    qnVideoEl.addEventListener('canplay', () => {
        console.log(qnVideoEl.duration);
        durationText = timeToMinute(qnVideoEl.duration);
    })

    qnVideoEl.addEventListener('play', () => {
        console.log('play');
        playBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
    });

    qnVideoEl.addEventListener('pause', ()=> {
        console.log('paused');
        pauseBtn.classList.add('hidden');
        playBtn.classList.remove('hidden');
    })

    qnVideoEl.addEventListener('dblclick', () => {
        const isFullScreen = (document as any).webkitIsFullScreen;
        if (isFullScreen) {
            fullScreenBtn.classList.remove('hidden');
            exitBtn.classList.add('hidden');
            document.exitFullscreen();
            return;
        }
        console.log('dblclick');
        fullScreenBtn.classList.add('hidden');
        exitBtn.classList.remove('hidden');
        document.documentElement.requestFullscreen.call(qnRtPlayer);
    })

    qnVideoEl.addEventListener('click', () => {
        const paused = qnVideoEl.paused;
        if (paused) {
            qnVideoEl.play();
            return false;
        }
        qnVideoEl.pause();
        return false;
    })

    qnVideoEl.addEventListener('volumechange', () => {
        console.log(qnVideoEl.volume);
        if(qnVideoEl.muted) {
            unmuteBtn.classList.add('hidden');
            muteBtn.classList.remove('hidden');
        }else {
            muteBtn.classList.add('hidden');
            unmuteBtn.classList.remove('hidden');
        }
    })

    


    fullScreenBtn.addEventListener('click', () => {
        fullScreenBtn.classList.add('hidden');
        exitBtn.classList.remove('hidden');
        document.documentElement.requestFullscreen.call(qnRtPlayer);

    })

    exitBtn.addEventListener('click', () => {
        exitBtn.classList.add('hidden');
        fullScreenBtn.classList.remove('hidden');
        document.exitFullscreen();

    })

    muteBtn.addEventListener('click', () => {
        qnVideoEl.muted = false;
    });

    unmuteBtn.addEventListener('click', () => {
        qnVideoEl.muted = true;
    });


    playBtn.addEventListener('click', () => {
        qnVideoEl.play();
    })

    pauseBtn.addEventListener('click', () => {
        qnVideoEl.pause();
    })


    const qnVideoControlEl = createElement('div', 'qn-rtplayer-control', [
        playBtn,
        pauseBtn,
        muteBtn,
        unmuteBtn,
        fullScreenBtn,
        exitBtn,
        time
    ]);
    setControlStyle(`
        .hidden {
            display: none;
        }
        .qn-rtplayer-control {
            background-color: rgba(43, 51, 63, 0.7);
            width: 100%;
            height: 3em;
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 0;
        }

        .qn-rtplayer-control-button {
            background: none;
            color: #ffffff;
            border: none;
            width: 4em;
            position: relative;
            outline: none;
            text-align: center;
            margin: 0;
            padding: 0;
            height: 100%;
            flex: none;
            border-radius: 50%;
        }

        .qn-rtplayer-play {
            position: absolute;
        }

        .qn-rtplayer-play::before {
            cursor: pointer;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiNmZmZmZmYiIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIEZvbnQgQXdlc29tZSBGcmVlIDUuMTUuNCBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIChJY29uczogQ0MgQlkgNC4wLCBGb250czogU0lMIE9GTCAxLjEsIENvZGU6IE1JVCBMaWNlbnNlKSAtLT48cGF0aCBkPSJNNDI0LjQgMjE0LjdMNzIuNCA2LjZDNDMuOC0xMC4zIDAgNi4xIDAgNDcuOVY0NjRjMCAzNy41IDQwLjcgNjAuMSA3Mi40IDQxLjNsMzUyLTIwOGMzMS40LTE4LjUgMzEuNS02NC4xIDAtODIuNnoiLz48L3N2Zz4=);
        }
        .qn-rtplayer-pause {
            position: absolute;
        }
        .qn-rtplayer-pause::before {

            cursor: pointer;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            content: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgMTIgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjUgKDY3NDY5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5wYXVzZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJJY29ucyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IlR3by1Ub25lIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDQ2LjAwMDAwMCwgLTk1NS4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IkFWIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMDAuMDAwMDAwLCA4NTIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iVHdvLVRvbmUtLy1BVi0vLXBhdXNlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNDAuMDAwMDAwLCA5OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgiIHBvaW50cz0iMCAwIDI0IDAgMjQgMjQgMCAyNCI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNiw1IEwxMCw1IEwxMCwxOSBMNiwxOSBMNiw1IFogTTE0LDUgTDE4LDUgTDE4LDE5IEwxNCwxOSBMMTQsNSBaIiBpZD0i8J+UuS1QcmltYXJ5LUNvbG9yIiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);
        }
        .qn-rtplayer-mute {
            position: absolute;
            right: 4.5em;
        }

        .qn-rtplayer-mute::before {
            cursor: pointer;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            content: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgMTggMTgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjUgKDY3NDY5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT52b2x1bWVfb2ZmPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9Ikljb25zIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iUm91bmRlZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc4My4wMDAwMDAsIC05OTcuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJBViIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAwLjAwMDAwMCwgODUyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ii1Sb3VuZC0vLUFWLS8tdm9sdW1lX29mZiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjgwLjAwMDAwMCwgMTQyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMy42MywzLjYzIEMzLjI0LDQuMDIgMy4yNCw0LjY1IDMuNjMsNS4wNCBMNy4yOSw4LjcgTDcsOSBMNCw5IEMzLjQ1LDkgMyw5LjQ1IDMsMTAgTDMsMTQgQzMsMTQuNTUgMy40NSwxNSA0LDE1IEw3LDE1IEwxMC4yOSwxOC4yOSBDMTAuOTIsMTguOTIgMTIsMTguNDcgMTIsMTcuNTggTDEyLDEzLjQxIEwxNi4xOCwxNy41OSBDMTUuNjksMTcuOTYgMTUuMTYsMTguMjcgMTQuNTgsMTguNSBDMTQuMjIsMTguNjUgMTQsMTkuMDMgMTQsMTkuNDIgQzE0LDIwLjE0IDE0LjczLDIwLjYgMTUuMzksMjAuMzMgQzE2LjE5LDIwIDE2Ljk0LDE5LjU2IDE3LjYxLDE5LjAyIEwxOC45NSwyMC4zNiBDMTkuMzQsMjAuNzUgMTkuOTcsMjAuNzUgMjAuMzYsMjAuMzYgQzIwLjc1LDE5Ljk3IDIwLjc1LDE5LjM0IDIwLjM2LDE4Ljk1IEw1LjA1LDMuNjMgQzQuNjYsMy4yNCA0LjAzLDMuMjQgMy42MywzLjYzIFogTTE5LDEyIEMxOSwxMi44MiAxOC44NSwxMy42MSAxOC41OSwxNC4zNCBMMjAuMTIsMTUuODcgQzIwLjY4LDE0LjcgMjEsMTMuMzkgMjEsMTIgQzIxLDguMTcgMTguNiw0Ljg5IDE1LjIyLDMuNiBDMTQuNjMsMy4zNyAxNCwzLjgzIDE0LDQuNDYgTDE0LDQuNjUgQzE0LDUuMDMgMTQuMjUsNS4zNiAxNC42MSw1LjUgQzE3LjE4LDYuNTQgMTksOS4wNiAxOSwxMiBaIE0xMC4yOSw1LjcxIEwxMC4xMiw1Ljg4IEwxMiw3Ljc2IEwxMiw2LjQxIEMxMiw1LjUyIDEwLjkyLDUuMDggMTAuMjksNS43MSBaIE0xNi41LDEyIEMxNi41LDEwLjIzIDE1LjQ4LDguNzEgMTQsNy45NyBMMTQsOS43NiBMMTYuNDgsMTIuMjQgQzE2LjQ5LDEyLjE2IDE2LjUsMTIuMDggMTYuNSwxMiBaIiBpZD0i8J+UuUljb24tQ29sb3IiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==);
        }

        .qn-rtplayer-unmute {
            position: absolute;
            right: 4.5em;
        }

        .qn-rtplayer-unmute::before {
            cursor: pointer;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            content: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgMTggMTgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjUgKDY3NDY5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT52b2x1bWVfdXA8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iSWNvbnMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJSb3VuZGVkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODE3LjAwMDAwMCwgLTk5Ny4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IkFWIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMDAuMDAwMDAwLCA4NTIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iLVJvdW5kLS8tQVYtLy12b2x1bWVfdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcxNC4wMDAwMDAsIDE0Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTMsMTAgTDMsMTQgQzMsMTQuNTUgMy40NSwxNSA0LDE1IEw3LDE1IEwxMC4yOSwxOC4yOSBDMTAuOTIsMTguOTIgMTIsMTguNDcgMTIsMTcuNTggTDEyLDYuNDEgQzEyLDUuNTIgMTAuOTIsNS4wNyAxMC4yOSw1LjcgTDcsOSBMNCw5IEMzLjQ1LDkgMyw5LjQ1IDMsMTAgWiBNMTYuNSwxMiBDMTYuNSwxMC4yMyAxNS40OCw4LjcxIDE0LDcuOTcgTDE0LDE2LjAyIEMxNS40OCwxNS4yOSAxNi41LDEzLjc3IDE2LjUsMTIgWiBNMTQsNC40NSBMMTQsNC42NSBDMTQsNS4wMyAxNC4yNSw1LjM2IDE0LjYsNS41IEMxNy4xOCw2LjUzIDE5LDkuMDYgMTksMTIgQzE5LDE0Ljk0IDE3LjE4LDE3LjQ3IDE0LjYsMTguNSBDMTQuMjQsMTguNjQgMTQsMTguOTcgMTQsMTkuMzUgTDE0LDE5LjU1IEMxNCwyMC4xOCAxNC42MywyMC42MiAxNS4yMSwyMC40IEMxOC42LDE5LjExIDIxLDE1Ljg0IDIxLDEyIEMyMSw4LjE2IDE4LjYsNC44OSAxNS4yMSwzLjYgQzE0LjYzLDMuMzcgMTQsMy44MiAxNCw0LjQ1IFoiIGlkPSLwn5S5SWNvbi1Db2xvciIgZmlsbD0iI2ZmZmZmZiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
        }

        .qn-rtplayer-full {
            position: absolute;
            right: 0;
        }

        .qn-rtplayer-full::before {
            cursor: pointer;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            content: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgdmlld0JveD0iMCAwIDIwIDIwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjguMSAoMjk2ODcpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPmZ1bGxfc2NyZWVuIFsjOTA0XTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJEcmliYmJsZS1MaWdodC1QcmV2aWV3IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzAwLjAwMDAwMCwgLTQxOTkuMDAwMDAwKSIgZmlsbD0iI2ZmZmZmZiI+CiAgICAgICAgICAgIDxnIGlkPSJpY29ucyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTYuMDAwMDAwLCAxNjAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjYyLjQ0NDUsNDAzOSBMMjU2LjAwMDUsNDAzOSBMMjU2LjAwMDUsNDA0MSBMMjYyLjAwMDUsNDA0MSBMMjYyLjAwMDUsNDA0NyBMMjY0LjAwMDUsNDA0NyBMMjY0LjAwMDUsNDAzOS45NTUgTDI2NC4wMDA1LDQwMzkgTDI2Mi40NDQ1LDQwMzkgWiBNMjYyLjAwMDUsNDA1NyBMMjU2LjAwMDUsNDA1NyBMMjU2LjAwMDUsNDA1OSBMMjYyLjQ0NDUsNDA1OSBMMjY0LjAwMDUsNDA1OSBMMjY0LjAwMDUsNDA1NS45NTUgTDI2NC4wMDA1LDQwNTEgTDI2Mi4wMDA1LDQwNTEgTDI2Mi4wMDA1LDQwNTcgWiBNMjQ2LjAwMDUsNDA1MSBMMjQ0LjAwMDUsNDA1MSBMMjQ0LjAwMDUsNDA1NS45NTUgTDI0NC4wMDA1LDQwNTkgTDI0Ni40NDQ1LDQwNTkgTDI1Mi4wMDA1LDQwNTkgTDI1Mi4wMDA1LDQwNTcgTDI0Ni4wMDA1LDQwNTcgTDI0Ni4wMDA1LDQwNTEgWiBNMjQ2LjAwMDUsNDA0NyBMMjQ0LjAwMDUsNDA0NyBMMjQ0LjAwMDUsNDAzOS45NTUgTDI0NC4wMDA1LDQwMzkgTDI0Ni40NDQ1LDQwMzkgTDI1Mi4wMDA1LDQwMzkgTDI1Mi4wMDA1LDQwNDEgTDI0Ni4wMDA1LDQwNDEgTDI0Ni4wMDA1LDQwNDcgWiIgaWQ9ImZ1bGxfc2NyZWVuLVsjOTA0XSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);
        }

        .qn-rtplayer-exit {
            position: absolute;
            right: 0;
        }

        .qn-rtplayer-exit::before {
            cursor: pointer;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 14px;
            height: 14px;
            content: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgdmlld0JveD0iMCAwIDIwIDIwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjguMSAoMjk2ODcpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPmV4aXRfZnVsbF9zY3JlZW4gWyM5MDVdPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkRyaWJiYmxlLUxpZ2h0LVByZXZpZXciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNjAuMDAwMDAwLCAtNDE5OS4wMDAwMDApIiBmaWxsPSIjZmZmZmZmIj4KICAgICAgICAgICAgPGcgaWQ9Imljb25zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1Ni4wMDAwMDAsIDE2MC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMTgsNDA0NyBMMjI0LDQwNDcgTDIyNCw0MDQ1IEwyMTgsNDA0NSBMMjE4LDQwMzkgTDIxNiw0MDM5IEwyMTYsNDA0My45NTkgTDIxNiw0MDQ3IEwyMTgsNDA0NyBaIE0yMTgsNDA1MyBMMjI0LDQwNTMgTDIyNCw0MDUxIEwyMTgsNDA1MSBMMjE2LDQwNTEgTDIxNiw0MDUxLjk1OSBMMjE2LDQwNTkgTDIxOCw0MDU5IEwyMTgsNDA1MyBaIE0yMTAsNDA1OSBMMjEyLDQwNTkgTDIxMiw0MDUxLjk1OSBMMjEyLDQwNTEgTDIxMCw0MDUxIEwyMDQsNDA1MSBMMjA0LDQwNTMgTDIxMCw0MDUzIEwyMTAsNDA1OSBaIE0yMTAsNDAzOSBMMjEyLDQwMzkgTDIxMiw0MDQzLjk1OSBMMjEyLDQwNDcgTDIxMCw0MDQ3IEwyMDQsNDA0NyBMMjA0LDQwNDUgTDIxMCw0MDQ1IEwyMTAsNDAzOSBaIiBpZD0iZXhpdF9mdWxsX3NjcmVlbi1bIzkwNV0iPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
        }
        .qn-rtplayer-control-time {
            color: #ffffff;
            position: relative;
            left: 4em;
        }
        `)
    return qnVideoControlEl;
}


const createElement = <K extends keyof HTMLElementTagNameMap>(tagName : K, classNames : string = '', childs : HTMLElement[] = []) : HTMLElementTagNameMap[K] => {
    const el = document.createElement(tagName);
    const classes = classNames.split(' ');
    classes.forEach(cls => {
        if (cls) {
            el.classList.add(cls);
        }
    })
    childs.forEach(child => {
        el.append(child);
    })
    return el;
}

const setControlStyle = (cssText : string) => {
    let textContent = controlStyleEl.textContent;
    controlStyleEl.textContent = textContent + '\n' + cssText;
}

const timeToMinute = (time : number) => {
    time = Math.floor(time);

    const minutes = Math.floor(time / 60);

    const seconds = time % 60;

    const hours = Math.floor(minutes / 60);

    let timeFormat = '';
    if (hours > 0) {
        if (hours < 10) {
            timeFormat += `0${hours}:`;
        } else {
            timeFormat += `${hours}:`;
        }
    }

    if (minutes >= 0) {
        if (minutes < 10) {
            timeFormat += `0${minutes}:`;
        } else {
            timeFormat += `${minutes}:`;
        }
    }
    if (seconds >= 0) {
        if (seconds < 10) {
            timeFormat += `0${seconds}`;
        } else {
            timeFormat += seconds;
        }
    }
    return timeFormat;
}

export {
    createQNRtPlayer
};
