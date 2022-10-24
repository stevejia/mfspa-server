import React from "react";
import MfspaRoute from "./route";
import { MfspaRouteObject } from "./type";
interface MfspaRoutesPros {
  routes: MfspaRouteObject[];
}
interface MfspaRoutesState {
  routes: MfspaRouteObject[];
  matchedRoute: MfspaRouteObject;
}
class MfspaRoutes extends React.Component<MfspaRoutesPros, MfspaRoutesState> {
  state = {
    routes: [],
    matchedRoute: null,
  };
  routeChange = () => {
    console.log("testA route change");
    const { routes } = this.state;
    const matchedRoute: MfspaRouteObject = MfspaRoutes.matchRoute(routes);
    this.setState({ matchedRoute });
  };
  private static guids: string[] = [];
  static getDerivedStateFromProps(
    nextProps: MfspaRoutesPros,
    preState: MfspaRoutesState
  ) {
    //映射obj1, obj2, obj3到state 如果有props更新的话
    const { routes } = nextProps;

    routes?.forEach((route) => (route.key = MfspaRoutes.guid()));
    const matchedRoute = MfspaRoutes.matchRoute(routes);
    return { routes, matchedRoute };
  }

  private static guid() {
    let guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );

    if (MfspaRoutes.guids.some((id) => guid === id)) {
      guid = MfspaRoutes.guid();
    } else {
      MfspaRoutes.guids.push(guid);
      return guid;
    }
  }
  static matchRoute(routes: MfspaRouteObject[]) {
    const { pathname } = window.location;
    const matchedRoute = routes?.find((route) => route.fullPath === pathname);
    return matchedRoute;
  }
  componentDidMount() {
    const { routes } = this.props;
    this.setState({ routes });
    window.addHistoryListener("testA route change", this.routeChange);
    // 当用户点击前进后退按钮时触发函数
    window.addEventListener("popstate", this.routeChange, false);
  }
  componentWillUnmount() {
    window.removeHistoryListener("testA route change", this.routeChange);
    window.removeEventListener("popstate", this.routeChange, false);
    console.log(14);
  }
  render() {
    const { routes, matchedRoute } = this.state;
    return (
      <>
        {routes?.map((route, index) => {
          const matched = matchedRoute?.fullPath === route.fullPath;
          return (
            <MfspaRoute matched={matched} key={index} data={route}></MfspaRoute>
          );
        })}
      </>
    );
  }
}

export default MfspaRoutes;
