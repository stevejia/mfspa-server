import { createElement } from "./utils";

class QNProgress {
    container: HTMLDivElement;
    progress: HTMLDivElement;
    bufferedProgress: HTMLDivElement;
    progressDot: HTMLDivElement;
    mainProgress: HTMLDivElement;

    constructor(progressValue: number, ) {
        const progressDot = createElement('div', 'qn-progress-dot hidden');
        const progress = createElement('div', 'qn-progress-h qn-progress-value', [progressDot]);
        const progressWrapper = createElement('div', 'qn-progress-value-wrapper', [progress]);

        const bufferedProgress = createElement('div', 'qn-progress-h qn-buffered-progress');
        const mainProgress = createElement('div', 'qn-progress-h qn-main-progress');
        const container = createElement('div', 'qn-progress-container width-0', [progressWrapper, bufferedProgress, mainProgress]);
        Object.assign(this, {container, progress: progressWrapper, bufferedProgress, progressDot, mainProgress});
        this.progressValue = progressValue;

    }

    private _progressValue: number = 0;

    set progressValue(value: number) {
        this.progress.style.width = `${value * 100}%`;
        this._progressValue = value;
    }

    get progressValue() {
        return this._progressValue;
    }


}

export default QNProgress;