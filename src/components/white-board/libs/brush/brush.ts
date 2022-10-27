import { getPosition } from "../dom/event";
import { DEFAULT_BRUSH_CONFIG, SJBrushConfig } from "../types/types";

export default class SJBrush {
    private canvas: HTMLCanvasElement;
    private _color: string;
    private config: SJBrushConfig;
    private ctx: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement, config: SJBrushConfig) {
        this.config = {...DEFAULT_BRUSH_CONFIG, ...config};
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.registerBrushEvent();
    }

    public set color(color: string) {
        this._color = color
    }

    public get color(): string {
        return this._color;
    }

    registerBrushEvent() {
        this.canvas.on('mousedown', this.brushStart, false);
    }

    brushStart = (event: MouseEvent) => {
        console.log('brushStart');
        const {x, y} = getPosition(event);
        const {ctx, config: {color, lineWidth}} = this;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        this.canvas.on('mousemove', this.brushing, false);
        this.canvas.once('mouseup', this.brushEnd, false);
    }
    brushing = (event: MouseEvent) => {
        console.log('brushing');
        const{x,y} = getPosition(event);
        this.ctx.lineTo(x,y);
        this.ctx.stroke();
    }

    brushEnd = (event: MouseEvent) => {
        console.log('brushEnd');
        
        this.ctx.stroke();
        this.canvas.off('mousemove', this.brushing, false);
    }
}