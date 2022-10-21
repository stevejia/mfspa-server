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

const formatTime = (time : number) => {
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

const getDistance = (x1 : number, y1 : number, x2 : number, y2 : number) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

export {
    createElement,
    formatTime,
    getDistance
};
