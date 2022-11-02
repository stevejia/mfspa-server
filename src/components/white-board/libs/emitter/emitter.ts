const emitterMap: { [key: string]: Function[] } = {};
export default class SJEmitter {
  


  on(type: string, callback: Function) {
    const eventList = emitterMap[type];
    if (!eventList) {
      emitterMap[type] = [callback];
      return;
    }
    eventList.push(callback);
  }

  off(type: string, callback: Function) {
    let eventList = emitterMap[type];
    if (!eventList) {
      return;
    }
    eventList = eventList.filter((e) => e !== callback);
    emitterMap[type] = eventList;
  }

  emit(type: string, data: any) {
    const eventList = emitterMap[type];
    if (!eventList) {
      return;
    }
    eventList.forEach((callback) => callback && callback(data));
  }
}
