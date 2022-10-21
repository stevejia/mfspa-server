export interface QNVideoConfig {
    width?: string;
    height?: string;
    className?: string;
    objectFit?: 'fill' | 'contain' | 'cover' | 'scale-down' | 'none';
    volume?: number;
    controls?: boolean;
    playsline?: boolean;
    audioOnly?: boolean;
    muted?: boolean;
    cameraControl?: boolean;
}
export enum CAMERA_CONTROL_TYPE {
    UP = 1,
    RIGHT,
    BOTTOM,
    LEFT,
    ZOOM_IN,
    ZOOM_OUT
}