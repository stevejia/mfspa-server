import { Spin } from "antd";
import React, { Suspense } from "react";
import { MfspaRouteObject } from "./type";
interface MfspaRouteProps {
  data: MfspaRouteObject;
  matched: boolean;
}
class MfspaRoute extends React.Component<MfspaRouteProps, any> {
  navigate = (path: string) => {
    console.log(path);
    window.history.pushState({ path: path }, "", path);
  };
  render() {
    const { data, matched } = this.props;
    return matched ? (
        <Suspense fallback={<div className="loading-container">
            <Spin />
        </div>}>
        <data.component location={location} navigate={this.navigate} />
      </Suspense>
    ) : null;
  }
}

export default MfspaRoute;
