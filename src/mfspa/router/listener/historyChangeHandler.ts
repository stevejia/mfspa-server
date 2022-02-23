import Dep from "./dep";
var addHistoryMethod = (function () {
  var historyDep = new Dep();
  return function (name: string) {
    if (name === "historychange") {
      return function (name: string, fn: Function) {
        historyDep.defined(name, fn);
        Dep.watch = null; //置空供下一个订阅者使用
      };
    } else if (name === "pushState" || name === "replaceState") {
      var method = window.history[name];
      return function () {
        method.apply(window.history, arguments as any);
        historyDep.notify();
      };
    }
  };
})();

const initHistoryMethod = () => {
  (window as any).addHistoryListener = addHistoryMethod("historychange") as any;
  window.history.pushState = addHistoryMethod("pushState") as any;
  window.history.replaceState = addHistoryMethod("replaceState") as any;
};

initHistoryMethod();
