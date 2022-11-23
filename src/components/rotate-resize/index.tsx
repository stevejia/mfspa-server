import {ProxyStateComponent} from 'proxy-state-react';
import React from 'react';
import RotateResize from './rotate-resize';
import { CompData } from './types';

import './index.less';

interface TestState {
    compData: CompData;
}

export default class TestRotateResize extends ProxyStateComponent<any, TestState> {
    private ref: HTMLDivElement;
    private rotateIns: RotateResize;
    constructor(props) {
        const initalState: TestState = {
            compData: {left: 0, top: 0, width: 300, height: 300, rotate: 30}
        };
        super(initalState, props);
        console.log(this.state);
        
    }

    componentDidMount(): void {
        const rotateIns = new RotateResize();
        rotateIns.init(this.state.compData, this.ref);
        rotateIns.on('resize', (compData)=> {
            console.log(compData);
            this.state.compData = {...compData};
            console.log(this.state);
        })
        this.rotateIns = rotateIns;
    }

    onResize(index: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        console.log('333');
        e.preventDefault();
        e.stopPropagation();
        console.log(index, e.currentTarget);
        const target = e.currentTarget;
        // const mouseMove = (event: MouseEvent) => {
        //     console.log(event);
        //     this.rotateIns.resize(event, this.state.compData, index, 1);
        // }
        // const mouseUp = (event: MouseEvent) => {
        //     document.removeEventListener('mousemove', mouseMove);
        //     document.removeEventListener('mouseup', mouseUp);
        // }
        // target.addEventListener('mousemove', event => {
        //     console.log("target event", event);
        // })
        // document.addEventListener('mousemove', mouseMove);
        // document.addEventListener('mouseup', mouseUp);
        this.rotateIns.resize(e, {...this.state.compData}, index, 1);
    }

    render() {
        console.log('changed');
        
        const {compData: {rotate, ...restData}} = this.state;
        return <div className='container'>
            <div className='component' style={{...restData, ...{transform: `rotate(${rotate}deg)`}}} ref={ref=> this.ref = ref} id='test-component'>
                <div className='component-select'>
                    <div onMouseDown={(e) => this.onResize(0, e)} className='select-item top-left'></div>
                    <div onMouseDown={(e) => this.onResize(1, e)} className='select-item top-center'></div>
                    <div onMouseDown={(e) => this.onResize(2, e)} className='select-item top-right'></div>
                    <div onMouseDown={(e) => this.onResize(3, e)} className='select-item center-right'></div>
                    <div onMouseDown={(e) => this.onResize(4, e)} className='select-item bottom-right'></div>
                    <div onMouseDown={(e) => this.onResize(5, e)} className='select-item bottom-center'></div>
                    <div onMouseDown={(e) => this.onResize(6, e)} className='select-item bottom-left'></div>
                    <div onMouseDown={(e) => this.onResize(7, e)} className='select-item center-left'></div>
                </div>
            </div>
        </div>
    }
}