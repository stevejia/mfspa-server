const setStyle  =()=> {
    let styleEl = document.querySelector('#qn-video-player');
    if(styleEl) {
        return;
    }
    styleEl = document.createElement('style');
    styleEl.id = 'qn-video-player';

    

    document.head.appendChild(styleEl);
}

const setContainerStyle = (styleEl: HTMLStyleElement) => {
    //TODO::
}