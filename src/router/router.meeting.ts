import {lazy} from "react";
import {MfspaRouteObject} from "../components/mfspa-router/type";

const loginRoutes: MfspaRouteObject[] = [{
        path: "login",
        component: lazy(() => import ("../pages/login/login"))
    }, {
      path: "home",
      component: lazy(() => import("../pages/home/home"))
    }, {
      path: "room",
      component: lazy(() =>  import("../pages/room/room"))
    }];

export default loginRoutes;
