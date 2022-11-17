import React from "react";
import { ProxyStateComponent } from "proxy-state-react";
interface PropsType {}
interface StateType {
  a?: number;
  b: number;
  c: { d: number };
  d?: number;
  e?: any;
}
class TestProxyStateComponent extends ProxyStateComponent<
  PropsType,
  StateType
> {
  constructor(props: PropsType) {
    const state = {
      a: 1,
      b: 2,
      c: { d: 3 },
    };
    super(state, props);
  }

  render(): JSX.Element {
    console.log(this.state);
    this.state.a;
    return (
      <div>
        <div>{JSON.stringify(this.state, null, 2)}</div>
        <div>
          <button onClick={() => (this.state.d = 5)}>加一个基本属性</button>
          <button onClick={() => (this.state.e = { f: 9 })}>
            加一个引用类型
          </button>
          <button onClick={() => (this.state.a = 11)}>改一个属性</button>
          <button onClick={() => (this.state.e.f = { g: 12 })}>
            改一个加的基本属性
          </button>
          <button onClick={() => delete this.state.a}>删除一个属性</button>
        </div>
      </div>
    );
  }
}

export default TestProxyStateComponent;
