import React from "react";
import { renderRoutes } from "react-router-config";
import { LoadingOutlined } from "@ant-design/icons";
class Index extends React.Component<any, any> {
  render() {
    const { route } = this.props;
    return (
      <div className="mfspa-app-content">
        {route && renderRoutes(route.routes)}
      </div>
    );
  }
}

export default Index;
