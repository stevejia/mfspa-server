import ReactDom from "react-dom";

import Mfspa from "./mfspa";
import "antd/dist/antd.css";
import "./index.less";
import App from "./app";
const mfspaIns = new Mfspa(null);
window.mfspa = mfspaIns;
ReactDom.render(<App />, document.querySelector("#root"));
module?.hot?.accept();
