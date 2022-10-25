import './dom';
class SJEvent { 
    private eventList: {element: Node, type: string, listener: Function, options?: any, wrapperListener: Function}[] = []; 


    on < K extends keyof DocumentEventMap > (element: Node, type : K, listener : (this : Document, ev : DocumentEventMap[K]) => any, options? : boolean | AddEventListenerOptions): void;
    on(element: Node, type : string, listener : EventListenerOrEventListenerObject, options? : boolean | AddEventListenerOptions): void;
    on(element: Node, type : any, listener : any, options : any) {
        const exist = this.eventList.some(event => event.element === element && event.type === type && event.listener === listener && event.options === options);
        if(exist) {
            return;
        }
        const wrapperListener = (event) => {
            /**
             * mousedown mouseup事件默认左键触发
             */
            if(type === 'mousedown' || type === 'mouseup') {
                if(event.button !== 0) {
                    return;
                }
            }
            listener(event);
        }
        element.addEventListener(type, wrapperListener, options);
        this.eventList.push({element, type, listener, wrapperListener, options});
    }
    once < K extends keyof DocumentEventMap > (element: Node, type : K, listener : (this : Document, ev : DocumentEventMap[K]) => any, options? : boolean | AddEventListenerOptions): void;
    once(element: Node, type : string, listener : EventListenerOrEventListenerObject, options? : boolean | AddEventListenerOptions): void;

    once(element: Node, type : any, listener : any, options : any) {
        this.on(element, type, (...args) => {
            listener(...args);
            this.off(element, type, listener, options);
        });
    }
    off < K extends keyof DocumentEventMap > (element: Node, type : K, listener : (this : Document, ev : DocumentEventMap[K]) => any, options? : boolean | EventListenerOptions): void;
    off(element: Node, type : string, listener : EventListenerOrEventListenerObject, options? : boolean | EventListenerOptions): void;
    off(element: Node, type : any, listener, options) {
        let event = null;
        let index = -1;
        for(let item of this.eventList) {
            if(item.element === element && item.listener === listener && item.type === type && item.options === options) {
                event = item;
                const index = this.eventList.indexOf(item);
                break;
            }
        }
        this.eventList.slice(index, 1);
        if(event) {
            element.removeEventListener(type, event.wrapperListener, options);
        }
    }
}

export default SJEvent;
