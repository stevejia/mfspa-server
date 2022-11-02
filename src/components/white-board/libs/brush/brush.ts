import { getPosition } from "../dom/event";
import SJEmitter from "../emitter/emitter";
import { DEFAULT_BRUSH_CONFIG, SJBrushConfig, SJPosition } from "../types/types";

export default class SJBrush extends SJEmitter {
    private canvas: HTMLCanvasElement;
    private _color: string;
    private config: SJBrushConfig;
    private ctx: CanvasRenderingContext2D;
    private points: SJPosition[] = [];
    private beginPoint: SJPosition;
    private available: boolean;
    constructor(canvas: HTMLCanvasElement, config: SJBrushConfig) {
        super();
        this.available = false;
        this.config = {...DEFAULT_BRUSH_CONFIG, ...config};
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.scale(4, 4);
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
        this.on('toolbar-change', (data)=> {
            console.log("toolbar change");
            const {type} = data;
            this.available = type === 'pencil';
        })
    }

    brushStart = (event: MouseEvent) => {
        if(!this.available) {
            return;
        }
        console.log('brushStart');
        const {x, y} = getPosition(event);
        this.points.push({x, y});
        this.beginPoint = {x, y};
        const {ctx, config: {color, lineWidth}} = this;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        this.canvas.on('mousemove', this.brushing, false);
        this.canvas.once('mouseup', this.brushEnd, false);
        this.canvas.once('mouseleave', this.brushEnd, false);
    }
    brushing = (event: MouseEvent) => {
        console.log('brushing');
        const {x,y} = getPosition(event);
        this.points.push({x,y});
        if(this.points.length >= 3) {
            const lastTwoPoints = this.points.slice(-2);
            const lastOnePoint = lastTwoPoints[1];
            const lastTwoPoint = lastTwoPoints[0];
            const controlPoint = {
                x: (lastOnePoint.x + lastTwoPoint.x)/2,
                y: (lastOnePoint.y + lastTwoPoint.y)/2
            }
            this.drawBeZier(this.beginPoint, controlPoint, lastOnePoint);
            this.beginPoint = lastOnePoint;
            // this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
        
        // this.ctx.lineTo(x,y);
    }

    brushEnd = (event: MouseEvent) => {
        console.log('brushEnd');
        this.ctx.stroke();
        this.canvas.off('mousemove', this.brushing, false);
    }

    private drawBeZier(beginPoint: SJPosition, controlPoint: SJPosition, endPoint: SJPosition) {
        this.ctx.moveTo(beginPoint.x, beginPoint.y);

        this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    }
}