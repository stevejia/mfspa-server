import React from "react";
import { proxyState } from "./proxyState";
class ProxyStateComponent<P={},S={}, SS = any> extends React.Component<P, S, SS> {
    public state: S;
    constructor(state, props) {
        super(props);
        this.state = this.proxy(state);
        this.state = proxyState(state, (newState)=> {
            this._setState(newState);
        });
    }

    private _setState(state) {
        console.log('state-changed', state);
        this.state = state;
        console.log(this.state);
        this.setState(state, () => {
            this.state = this.proxy(this.state);
        });
    }

    private proxy(obj: any) {
        const proxyedObj = new Proxy(obj, {
            get:(target, props, receiver) => {
                return Reflect.get(target, props, receiver);
            },
            set:(target, props, value, receiver) =>{
                if(this.isObject(value)) {
                    const proxyedValue = this.proxy(value);
                    Reflect.set(target, props, proxyedValue, receiver);
                } else {
                    Reflect.set(target, props, value, receiver);
                }
                this._setState(this.state);
                return true;
            },
            deleteProperty:(target, props) => {
                console.log('delete property');
                Reflect.deleteProperty(target, props);
                console.log(target, this.state);
                this._setState(this.state);
                return true;
            } 
        });
        return proxyedObj;
    }

    private isObject(objLike: any) {
        return typeof objLike === 'object';
    }
}
export default ProxyStateComponent;