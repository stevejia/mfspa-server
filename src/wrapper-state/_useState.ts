import { useState } from "react";
import { proxyState } from "./proxyState";
const _useState = <K>(initialState) => {
  const [newState, setState] = useState<K>(initialState);
  console.log(newState);
  const _newState = proxyState(newState, setState);
  console.log(_newState);
  return _newState;
//   return proxyState(newState, setState);
};
export default _useState;
