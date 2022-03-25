import * as React from "react";
import mfspaConfig from "../../../mfspa.config";
import DebugMode from "../../components/debug-mode";
import RenderInBody from "../../components/render-in-body";
import request from "../../request/request";
class MfspaRouter extends React.Component<any, any> {
  private appInstances: Array<string> = [];
  state = {
    loginStatus: false,
    currentAppName: "",
    debugApps: [],
  };
  private _debugApps = [];
  componentDidMount(): void {
    this.mounted();
  }

  async mounted() {
    const { debugApps } = await request.get(
      "http://localhost:8044/api/v1/debugconfig/get"
    );
    this._debugApps = debugApps;
    this.setState({ debugApps });
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
    this.setState({ currentAppName: appName });
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
    if (this.currentAppInDebug()) {
      const appDebugInfo = this.getAppDebugInfo(appName);
      if (appDebugInfo) {
        const { url } = appDebugInfo;
        src = url;
      }
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

  private currentAppInDebug = () => {
    const { _debugApps } = this;
    const { currentAppName } = this.state;
    return _debugApps?.some((da) => da.appName === currentAppName);
  };

  private getAppDebugInfo = (appName: string) => {
    const { _debugApps } = this;
    const appDebugInfo = _debugApps.find((app) => app.appName === appName);
    return appDebugInfo;
  };

  private quitDebug = () => {
    this.reload();
  };

  reload() {
    window.location.reload();
  }

  render() {
    const { children } = this.props;

    const { loginStatus, currentAppName, debugApps } = this.state;
    const curAppInDebug = this.currentAppInDebug();
    return (
      <>
        {debugApps?.length > 0 && curAppInDebug && (
          <RenderInBody>
            <DebugMode
              quitDebug={this.quitDebug}
              currentAppName={currentAppName}
            ></DebugMode>
          </RenderInBody>
        )}
        <div>{children}</div>
      </>
    );
  }
}

export default MfspaRouter;
