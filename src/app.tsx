import * as React from "react";
import { Provider } from "react-redux";
import { genRoutes, RenderRoutes } from "./router";
// import {  Routes, Switch } from "react-router";
import MfspaRoutes from "./components/mfspa-router/routes";
import { isNullOrEmpty } from "./utils";
class App extends React.Component<any, any> {
  state = {
    renderRoutes: true,
  };
  componentDidMount(): void {
    
  }
  render() {
    const { renderRoutes } = this.state;
    return (
        renderRoutes && <MfspaRoutes routes={genRoutes()}></MfspaRoutes>
    );
  }
}

export default App;
