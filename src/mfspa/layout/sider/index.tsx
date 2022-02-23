import * as React from "react";

import { Avatar, Layout } from "antd";
const { Content, Footer, Header, Sider } = Layout;
import "./index.less";
import MfspaMenu from "./menu";
class MfspaSider extends React.Component<any, any, any> {
  state = {
    collapsed: false,
  };
  toggleCollapsed = () => {
    const { collapsed } = this.state;
    this.setState({ collapsed: !collapsed });
  };
  render() {
    const { collapsed } = this.state;
    return (
      <Sider
        className="mfspa-sider"
        // trigger={this.toggleCollapsed}
        collapsible
        collapsed={collapsed}
        onCollapse={this.toggleCollapsed}
      >
        <div className="mfspa-avatar">
          <Avatar
            size={collapsed ? 48 : 64}
            src="https://himg.bdimg.com/sys/portrait/item/pp.1.2e4eaaf4.RwxI7zRQOdF0Yu_k8OZzew?_t=1645601184723"
          ></Avatar>
        </div>
        <MfspaMenu collapsed={collapsed}></MfspaMenu>
      </Sider>
    );
  }
}

export default MfspaSider;
