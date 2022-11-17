const proxyState = <K>(state: K, setState: any) => {
    proxyChain(state, state, setState);
    const proxyedState = proxy(state, state, setState);
    return proxyedState;
  };

  const proxyChain = (obj: any, origin: any, setState) => {
    obj = proxy(obj, origin, setState);
    Object.keys(obj).forEach((key) => {
      if (isObject(obj[key])) {
        proxyChain(obj[key], origin, setState);
        obj[key] = proxy(obj[key], origin, setState);
      }
    });
  };

  const proxy = (obj: any, origin: any, setState) => {
    const proxyedObj = new Proxy(obj, {
      get: (target, props, receiver) => {
        return Reflect.get(target, props, receiver);
      },
      set: (target, props, value, receiver) => {
        const originTargetJson = JSON.stringify(origin);
        if (isObject(value)) {
          const proxyedValue = proxy(value, origin, setState);
          Reflect.set(target, props, proxyedValue, receiver);
        } else {
          Reflect.set(target, props, value, receiver);
        }
        const nowTargetJson = JSON.stringify(origin);

        console.log(nowTargetJson === originTargetJson);

        if (nowTargetJson === originTargetJson) {
          return true;
        }
        console.log(target, origin);
        setState(JSON.parse(JSON.stringify(origin)));
        return true;
      },
      deleteProperty: (target, props) => {
        const originTargetJson = JSON.stringify(origin);
        console.log("delete property");
        Reflect.deleteProperty(target, props);
        const nowTargetJson = JSON.stringify(origin);
        if (nowTargetJson === originTargetJson) {
          return true;
        }
        setState(JSON.parse(JSON.stringify(origin)));
        // console.log(target, this.state);
        // this._setState(this.state);
        return true;
      },
    });
    return proxyedObj;
  };

  const isObject = (objLike) =>{
    return typeof objLike === 'object';
  }

  export {proxyState};