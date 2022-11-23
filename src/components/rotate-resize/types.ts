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