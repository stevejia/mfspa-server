import React, { useEffect } from "react";
import { useState } from 'proxy-state-react';
interface StateType {
    count: number;
    count1: {a: number} | number;
    count3?: number;
    count4?: Array<number>;
    count5?: {[key: string]: number};
}
const Test2 = (props) => {
    const initState: any = {count: 1, count1: {a: 2}};
    const state: StateType = useState<StateType>(initState);
    useEffect(()=> {
        state.count1 = 33234;
    },[])
    return <div>
        <div>{JSON.stringify(state)}</div>
        <button onClick={()=> state.count++}>state.count++</button>
        <button onClick={()=> state.count3 = 3}>增加一个属性</button>
        <button onClick={()=> state.count4 = []}>增加一个数组</button>
        <button onClick={()=> state.count5 = {}}>增加一个对象</button>
        <button onClick={()=> state.count4.push(5)}>数组增加一个元素</button>
        <button onClick={()=> state.count5.g = 6}>对象增加一个元素</button>
        <button onClick={()=> delete state.count3 }>删除一个属性</button>
    </div>;
}
export default Test2;