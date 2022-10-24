import React from "react";
import { renderRoutes } from "../components/mfspa-router";
import { MfspaRouteObject } from "../components/mfspa-router/type";
import loginRoutes from "./router.meeting";

const routePrefix = `/meeting`;
const allRoutes: MfspaRouteObject[] = [
  {
    path: routePrefix,
    children: [...loginRoutes],
  },
];

const _genRoutes = (
  route: MfspaRouteObject,
  mfspaRoutes: MfspaRouteObject[]
) => {
  if (!route.children) {
    console.log(route, 1);
    mfspaRoutes.push(route);
    return;
  } else {
    route.children.forEach((child) => {
      child.fullPath =
        child.fullPath || combinePath(route.fullPath || route.path, child.path);
      _genRoutes(child, mfspaRoutes);
    });
  }
};

const combinePath = (parentPath: string, childPath: string): string => {
  if (parentPath.endsWith("/")) {
    parentPath = parentPath.slice(0, parentPath.length - 1);
  }

  if (!childPath.startsWith("/")) {
    childPath = "/" + childPath;
  }

  return parentPath + childPath;
};

const genRoutes = (routes?: MfspaRouteObject[]): MfspaRouteObject[] => {
  routes = routes || allRoutes;
  const mfspaRoutes: MfspaRouteObject[] = [];
  routes.forEach((route) => _genRoutes(route, mfspaRoutes));
  return mfspaRoutes;
};

const RenderRoutes = (): React.ReactElement => {
  const routes = allRoutes || ([] as any[]);
  const mfspaRoutes: any[] = genRoutes(routes);
  console.log(mfspaRoutes);
  return renderRoutes(mfspaRoutes);
};

export { RenderRoutes, genRoutes };
