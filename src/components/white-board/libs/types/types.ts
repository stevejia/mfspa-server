export interface SJBrushConfig {
    color: string;
    lineWidth: number;
}

export const DEFAULT_BRUSH_CONFIG: Required<SJBrushConfig> = {
    color: 'red',
    lineWidth: 1
}