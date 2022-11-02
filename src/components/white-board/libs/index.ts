import SJBrush from "./brush/brush";
import { setCanvasPosition } from "./dom/event";
import SJToolBar from "./toolbar/toolbar";
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
        new SJToolBar(this.containerEl.querySelector('.sj-wb-toolbar'));
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
        this.canvas.width = clientWidth*4;
        this.canvas.height = clientHeight*4;
    }

    private createWiteBoard() {
        const {config:{width, height}, container: rootContainer} = this;
        const styleWidth = typeof width === 'number' ? `${width}px` : width;
        const styleHeight = typeof height === 'number' ? `${height}px` : height;
        const template = 
            `<div class="sj-wb-container" style="width: ${styleWidth}; height: ${styleHeight}">
                <div class="sj-wb-toolbar">
                    <div type="shape"  class="sj-wb-toolbar-item shape">
                        <div class="shape-icon"></div>
                    </div>
                    <div type="pencil" class="sj-wb-toolbar-item pencil">
                        <div class="pencil-icon"></div>
                    </div>
                    <div type="rubber" class="sj-wb-toolbar-item rubber">
                        <div class="rubber-icon"></div>
                    </div>
                    <div type="back" class="sj-wb-toolbar-item back">
                        <div class="back-icon"></div>
                    </div>
                    <div type="forward" class="sj-wb-toolbar-item forward">
                        <div class="forward-icon"></div>
                    </div>
                </div>
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