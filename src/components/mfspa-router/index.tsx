import React from "react";
import MfspaRoute from "./route";
import MfspaRoutes from "./routes";
import { MfspaRouteObject } from "./type";

const renderRoutes = (routes: MfspaRouteObject[]) => {
  return (
    <MfspaRoutes routes={routes}>
      
    </MfspaRoutes>
  );
};

export { renderRoutes };
