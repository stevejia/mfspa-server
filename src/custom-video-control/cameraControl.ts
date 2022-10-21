import { QNVideoConfig } from "./types";
import {createElement} from "./utils";

class QNCameraControl {

    dirUp : HTMLDivElement;
    dirDown : HTMLDivElement;
    dirLeft : HTMLDivElement;
    dirRight : HTMLDivElement;
    dirAll: HTMLDivElement;
    virtualDir: HTMLDivElement;
    zoomIn : HTMLDivElement;
    zoomOut : HTMLDivElement;
    zoomReset: HTMLDivElement;
    content : HTMLDivElement;

    cameraDirection:HTMLDivElement;

    container : HTMLDivElement;

    constructor(config : QNVideoConfig) {
        this.createCameraControl(config);
    }

    private createCameraControl(config : QNVideoConfig) {
        const cameraInnerRect = createElement('div', 'qn-camera-control-rect');
        const dirAll = createElement('div', 'qn-camera-control-inner', [cameraInnerRect])


        const dirUp = createElement('div', 'qn-camera-control-dir qn-camera-control-dir-up');
        const dirDown = createElement('div', 'qn-camera-control-dir qn-camera-control-dir-down');
        const dirLeft = createElement('div', 'qn-camera-control-dir qn-camera-control-dir-left');
        const dirRight = createElement('div', 'qn-camera-control-dir qn-camera-control-dir-right');
        const virtualDir = createElement('div', 'qn-camera-control-virtual-dir');

        const cameraDirection = createElement('div', 'qn-camera-control-direction', [
            dirUp,
            dirRight,
            dirDown,
            dirLeft,
            dirAll,
            virtualDir
        ])


        const zoomIn = createElement('div', 'qn-camera-control-zoom-in');

        const zoomOut = createElement('div', 'qn-camera-control-zoom-out');

        const zoomReset = createElement('div', 'qn-camera-control-zoom-reset');

        const zoomWrapper = createElement('div', 'qn-camera-control-zoom-wrapper', [zoomIn, zoomReset, zoomOut])

        const content = createElement('div', 'qn-camera-control-content hidden', [cameraDirection, zoomWrapper])


        const container = createElement('div', 'qn-camera-control-wrapper', [content]);

        Object.assign(this, {
            dirUp,
            dirDown,
            dirLeft,
            dirRight,
            dirAll,
            zoomIn,
            zoomOut,
            zoomReset,
            cameraDirection,
            content,
            virtualDir,
            container
        });
    }
}

export default QNCameraControl;
