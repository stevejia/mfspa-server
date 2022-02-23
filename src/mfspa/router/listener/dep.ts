import Watch from "./watch";

class Dep {
  id = null as any;
  subs = [] as Array<any>;

  static watch: Watch | null;

  constructor() {
    this.id = new Date(); //这里简单的运用时间戳作订阅池的ID
    this.subs = []; //该事件下被订阅对象的集合
  }
  defined(name: string, fn: Function) {
    if (!Dep.watch) {
      Dep.watch = new Watch(name, fn);
    }
    // 添加订阅者
    Dep.watch.add(this);
    Dep.watch = null;
  }
  notify() {
    //通知订阅者有变化
    this.subs.forEach((e, i) => {
      if (typeof e.update === "function") {
        try {
          e.update.apply(e); //触发订阅者更新函数
        } catch (err) {
          console.warn(err);
        }
      }
    });
  }
}

export default Dep;
