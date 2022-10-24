export interface MfspaRouteObject {
  path: string;
  fullPath?: string;
  name?: string;
  component?: any;
  key?: string;
  children?: MfspaRouteObject[];
}
