interface EventItem {
    element: Node,
    type: any,
    listener: Function;
    options: any;
    wrapperListener: Function;
}


const eventList: EventItem[] = [];



/**
 * 只能使用function，不然this指向不到当前元素
 */
HTMLElement.prototype.on = function(type : any, listener : any, options : any, callback?: Function) {
    const element = this as Node;
    const exist = eventList.some(event => event.element === element && event.type === type && event.listener === listener && event.options === options);
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
        callback && callback(event);
    }
    element.addEventListener(type, wrapperListener, options);
    eventList.push({element: this, type, listener, wrapperListener, options});
}

HTMLElement.prototype.once = function(type : any, listener : any, options : any) {
    const element = this as Node;
    (element as any).on( type, listener, options, ()=> {
        element.off(type, listener, options);
    });
        
}

HTMLElement.prototype.off = function(type : any, listener, options) {
    const element = this;
    let event = null;
    let index = -1;
    for(let item of eventList) {
        if(item.element === element && item.listener === listener && item.type === type && item.options === options) {
            event = item;
            index = eventList.indexOf(item);
            break;
        }
    }
    eventList.splice(index, 1);
    if(event) {
        element.removeEventListener(type, event.wrapperListener, options);
    }
}

function registerEvent(element: Node, type: any, listener: any, options: any) {
    const exist = eventList.some(event => event.element === element && event.type === type && event.listener === listener && event.options === options);
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
    eventList.push({element: this, type, listener, wrapperListener, options});
}