import Dep from "./dep";

class Watch {
  name: string;
  id: number;
  callBack: Function = () => {};
  constructor(name: string, fn: Function) {
    this.name = name; //订阅消息的名称
    this.id = new Date().getTime(); //这里简单的运用时间戳作订阅者的ID
    this.callBack = fn; //订阅消息发送改变时->订阅者执行的回调函数
  }
  add(dep: Dep) {
    //将订阅者放入dep订阅池
    dep.subs.push(this);
  }
  update() {
    //将订阅者更新方法
    var cb = this.callBack; //赋值为了避免改变函数内调用的this
    cb(this.name);
  }
}

export default Watch;
