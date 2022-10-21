import SJEvent from "./event";

interface SJWhiteBoardConfig {
    // TODO::
    width: string | number | undefined;
    height: string | number | undefined;
}

const DEFAULT_CONFIG: Required<SJWhiteBoardConfig> = {
    width: 800,
    height: 400
}

class SJWhiteBoard extends SJEvent {
    private config: SJWhiteBoardConfig
    private container: HTMLElement | string;
    constructor(container:HTMLElement | string, config?: SJWhiteBoardConfig) {
        super();
        this.config = {...DEFAULT_CONFIG, ...config};
        this.container = container;
        

        this.createWiteBoard();

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
        let container: HTMLElement;

        if(typeof rootContainer === 'string') {
            container = document.querySelector(rootContainer);
        }else {
            container = rootContainer;
        }
        tempDivEl.childNodes.forEach((node, index)=> {
            
            container.append(node);
            const toolbar = document.querySelector('.sj-wb-toolbar');
            const canvas = document.querySelector('.sj-wb-canvas-container');
            const handler = (event)=> {console.log(event)};
            const removeHandler = (event) => {this.off(toolbar, 'mousedown', handler); console.log('remove event toolbar')};
            // this.on(toolbar, 'mousedown', handler);
            // this.on(toolbar, 'mousedown', handler);
            
            // this.on(canvas, 'mousedown', removeHandler);

            this.once()

            // toolbar.addEventListener('mousedown', handler);
            // toolbar.addEventListener('mousedown', handler);
            // canvas.addEventListener('mousedown', removeHandler);
        });
    }
}

export default SJWhiteBoard;