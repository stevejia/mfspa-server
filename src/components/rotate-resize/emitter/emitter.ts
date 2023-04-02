const emitterMap: { [key: string]: Function[] } = {};
export default class SJEmitter <T extends string> {
  public on(key: T, data?: any): void;
  
  on(type: string, callback: Function) {
    const eventList = emitterMap[type];
    if (!eventList) {
      emitterMap[type] = [callback];
      return;
    }
    eventList.push(callback);
  }
  public off(key: T, data?: any): void;
  off(type: string, callback: Function) {
    let eventList = emitterMap[type];
    if (!eventList) {
      return;
    }
    eventList = eventList.filter((e) => e !== callback);
    emitterMap[type] = eventList;
  }
  public emit(key: T, data?: any): void;
  emit(type: string, data?: any) {
    const eventList = emitterMap[type];
    if (!eventList) {
      return;
    }
    eventList.forEach((callback) => callback && callback(data));
  }
}
