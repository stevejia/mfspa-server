import React from "react";
import SJWhiteBoard from "./libs";
import "./libs/index.css";

export default class WhiteBoard extends React.Component<any, any> {
    private containerRef: HTMLDivElement;
    private whiteBoard: SJWhiteBoard;
    componentDidMount() {
        if(this.containerRef) {
            this.whiteBoard = new SJWhiteBoard(this.containerRef);
            // this.containerRef.innerHTML = "33333";
        }
        

        const div = document.createElement('div');
        console.log(div);
    }
    render(): React.ReactNode {
        return <div ref={ref => this.containerRef = ref}>
        </div>
    }
}