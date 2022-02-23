import * as React from "react";
import mfspaConfig from "../../../mfspa.config";

class MfspaRouter extends React.Component<any, any> {
  private appInstances: Array<string> = [];
  state = {
    loginStatus: false,
  };
  componentDidMount(): void {
    this.mounted();
  }

  mounted() {
    (window as any).addHistoryListener("change", () => {
      console.log("changed");
      //check login status;
      this.checkApp();
    });
    // 当用户点击前进后退按钮时触发函数
    window.addEventListener(
      "popstate",
      () => {
        this.checkApp();
      },
      false
    );
    const path = this.getPath();
    window.history.replaceState({ path: path }, "", path);
    this.checkApp();
  }

  private getPath() {
    const { origin, href } = window.location;
    return href.split(origin)[1];
  }

  route(path: string) {
    window.history.pushState({ path: path }, "", path);
    this.checkApp(path);
  }

  private getAppName(path: string): string {
    const pattern = mfspaConfig.pattern || "app/";
    const appName = path?.split(pattern)?.[1]?.split("/")?.[0] || null;
    return appName;
  }

  private checkApp(path: string = null): void {
    const { pathname } = window.location;
    path = path || pathname;
    const appName = this.getAppName(path);
    if (!appName) {
      // document.querySelector("#mfspa-root").innerHTML = "404 Not Found";
      return;
    }
    if (this.appInstances.indexOf(appName) > -1) {
      return;
    }
    this.loadApp(appName);
    this.appInstances.push(appName);
  }

  private async loadApp(appName: string) {
    const appInfo = await this.getAppInfo(appName);

    let src = `${mfspaConfig.cdn}app/${appName}/${appInfo.version}/${appInfo.entry}`;

    if (appName === "testA") {
      src = "http://localhost:8055/webpack/dist/index.js";
    }

    const script = document.createElement("script");
    script.src = src;
    document.querySelector("body").appendChild(script);
    document.body.removeChild(script);
  }

  private async getAppInfo(appName: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      resolve({
        name: appName,
        version: "@1.0.0",
        entry: "index.js",
      });
    });
  }

  unmounted() {}

  render() {
    const { children } = this.props;
    const { loginStatus } = this.state;
    return <div>router{children}</div>;
  }
}

export default MfspaRouter;
