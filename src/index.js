import ReactDom from "react-dom";

import Mfspa from "./mfspa";
import "antd/dist/antd.css";
import "./index.less";

// import MfspaLayout from "./mfspa/layout";

import { Button } from "antd";
import App from "./app";

// document.body.innerHTML = "3333333444a";

console.log("33333322211122223331");
const mfspaIns = new Mfspa(null);
window.mfspa = mfspaIns;
const testCCCCC = "testCCCCccc";
var testCCCCCCc = "99999";

// if (debugJson) {
//   const debugDiv = document.createElement("div");
//   debugDiv.innerHTML = `<div style="position: absolute; top: 0; left: calc( 50% - 50px); width: 100px, height: 50px; background: red;">调试模式</div>`;
//   document.body.appendChild(debugDiv);
// }

// console.log("33333333333");

ReactDom.render(<App />, document.querySelector("#root"));
module?.hot?.accept();
