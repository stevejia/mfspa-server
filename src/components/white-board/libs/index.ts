import SJBrush from "./brush/brush";
import { setCanvasPosition } from "./dom/event";
import { DEFAULT_BRUSH_CONFIG } from "./types/types";

interface SJWhiteBoardConfig {
    // TODO::
    width: string | number | undefined;
    height: string | number | undefined;
}

const DEFAULT_CONFIG: Required<SJWhiteBoardConfig> = {
    width: 800,
    height: 400
}

class SJWhiteBoard {
    private config: SJWhiteBoardConfig
    private container: HTMLElement | string;
    private canvas: HTMLCanvasElement;
    private brush: SJBrush;
    constructor(container:HTMLElement | string, config?: SJWhiteBoardConfig) {
        this.config = {...DEFAULT_CONFIG, ...config};
        this.container = container;
        this.createWiteBoard();
        this.initWhiteboard();
        setCanvasPosition(this.canvas);
        this.brush = new SJBrush(this.canvas, DEFAULT_BRUSH_CONFIG);
    }

    private get containerEl(): HTMLElement {
        const rootContainer = this.container;
        let container: HTMLElement;
        if(typeof rootContainer === 'string') {
            container = document.querySelector(rootContainer);
        }else {
            container = rootContainer;
        }
        return container;
    }

    private initWhiteboard() {
        const containerEl = this.containerEl;
        this.canvas = containerEl.querySelector('.sj-wb-canvas');
        const {clientWidth, clientHeight} = this.canvas;
        this.canvas.width = clientWidth;
        this.canvas.height = clientHeight;
    }

    attchBrush() {

    }

    private createWiteBoard() {
        const {config:{width, height}, container: rootContainer} = this;
        const styleWidth = typeof width === 'number' ? `${width}px` : width;
        const styleHeight = typeof height === 'number' ? `${height}px` : height;
        const template = 
            `<div class="sj-wb-container" style="width: ${styleWidth}; height: ${styleHeight}">
                <div class="sj-wb-toolbar">toolbar</div>
                <div class="sj-wb-canvas-container">
                    <canvas class="sj-wb-canvas"></canvas>
                </div>
            </div>`
        const tempDivEl = document.createElement('div');
        
        tempDivEl.innerHTML = template;
        let container: HTMLElement = this.containerEl;
        tempDivEl.childNodes.forEach((node)=> {
            container.append(node);
        });
    }
}

export default SJWhiteBoard;