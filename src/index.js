import ReactDom from "react-dom";
import "./libs/router/listener/historyChangeHandler";
import "antd/dist/antd.css";
import "./index.less";
import App from "./app";
ReactDom.render(<App />, document.querySelector("#root"));
module?.hot?.accept();
