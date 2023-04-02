export interface CompData {
    left: number;
    top:number;
    width: number;
    height: number;
    rotate: number;
}

export interface ChangeRule {
    [key: string]: {w?: number; h?: number; rw?: number; rh?: number;}
}

export interface ResizeRect {
    ox?: number;
    oy?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    deg?: number;
} 


export interface ResizeConfig {
    compData: CompData;
    selector?: boolean;
    scale?: number;
}


export const DefaultResizeConfig: Required<ResizeConfig> = {
    compData: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        rotate: 0,
    },
    selector: false,
    scale: 1
}

export interface Position {
    x: number;
    y: number;
}