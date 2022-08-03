import * as React from "react";
import { Menu, Button } from "antd";
// import {
//   AppstoreOutlined,
//   MenuUnfoldOutlined,
//   MenuFoldOutlined,
//   PieChartOutlined,
//   DesktopOutlined,
//   ContainerOutlined,
//   MailOutlined,
//   LeftOutlined,
//   RightOutlined,
// } from "@ant-design/icons";

import "./index.less";

const { SubMenu } = Menu;

interface MfspaMenuProps {
  collapsed: boolean;
}

class MfspaMenu extends React.Component<MfspaMenuProps, any> {
  state = {
    mockMenus: [],
    selectedKeys: [],
    openKeys: [],
  };
  componentDidMount() {
    const pathname = window.location.pathname;
    (window as any).addHistoryListener("historyChange", () => {
      console.log("menu: history change");

      const { mockMenus } = this.state;
      const { selectedKeys, openKeys } = this.getSelectedAndOpenMenuKey(
        mockMenus,
        pathname
      );
      this.setState({ selectedKeys, openKeys });
    });
    (window as any).mfspa.on("getMockMenu", (event) => {
      console.log(event);
      const {
        data: { mockMenus = [] },
      } = event;
      const { selectedKeys, openKeys } = this.getSelectedAndOpenMenuKey(
        mockMenus,
        pathname
      );
      this.setState({ mockMenus, selectedKeys, openKeys });
    });
  }

  private getSelectedAndOpenMenuKey(menus, pathname) {
    let selectedKeys = [];
    let openKeys = [];
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      const { key, subMenus } = menu;
      let isMatched = this.isMenuMatched(menu, pathname);
      if (isMatched) {
        selectedKeys = [key];
        break;
      }
      for (let j = 0; j < subMenus?.length; j++) {
        const subMenu = subMenus[j];
        const { key: skey } = subMenu;
        isMatched = this.isMenuMatched(menu, pathname, subMenu);
        if (isMatched) {
          selectedKeys = [skey];
          openKeys = [key];
        }
      }
    }
    return { selectedKeys, openKeys };
  }

  private isMenuMatched(menu, pathname, subMenu = null) {
    const { urls } = menu;
    if (!subMenu) {
      if (urls?.indexOf(pathname) > -1) {
        return true;
      }
      return false;
    }
    const { urls: surls } = subMenu;
    if (surls?.indexOf(pathname) > -1) {
      return true;
    }
    return false;
  }

  renderMenus() {
    const { mockMenus, selectedKeys, openKeys } = this.state;
    if (mockMenus.length <= 0) {
      return;
    }
    const [firstMenu] = mockMenus;
    let defaultSelectedKeys = [firstMenu.key];
    let defaultOpenKeys = [];
    if (firstMenu.subMenus && firstMenu.subMenus.length > 0) {
      defaultOpenKeys = firstMenu.key;
      const [firstSubMenu] = firstMenu.subMenus;
      defaultSelectedKeys = [firstSubMenu.key];
    }

    if (selectedKeys?.length > 0) {
      defaultSelectedKeys = selectedKeys;
    }

    if (openKeys?.length > 0) {
      defaultOpenKeys = openKeys;
    }

    const mockMenusDom = (
      <Menu
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        // selectedKeys={selectedKeys}
        // openKeys={openKeys}
        mode="inline"
        theme="dark"
      >
        {mockMenus.map((menu) => {
          const { subMenus } = menu;
          if (!subMenus || subMenus.length === 0) {
            return (
              <Menu.Item
                key={menu.key}
                onClick={() =>
                  window.history.pushState({ path: menu.url }, "", menu.url)
                }
              >
                {menu.name}
              </Menu.Item>
            );
          }
          return (
            <SubMenu key={menu.key} title={menu.name}>
              {subMenus.map((subMenu) => (
                <Menu.Item
                  key={subMenu.key}
                  onClick={() =>
                    window.history.pushState(
                      { path: subMenu.url },
                      "",
                      subMenu.url
                    )
                  }
                >
                  {subMenu.name}
                </Menu.Item>
              ))}
            </SubMenu>
          );
        })}
      </Menu>
    );
    return mockMenusDom;
  }

  render() {
    return (
      <div className="mfspa-menu">
        {/* <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
        >
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Option 1
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
          <Menu.Item key="3" icon={<ContainerOutlined />}>
            Option 3
          </Menu.Item>
          <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            icon={<AppstoreOutlined />}
            title="Navigation Two"
          >
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </SubMenu>
        </Menu> */}
        {this.renderMenus()}
      </div>
    );
  }
}

export default MfspaMenu;
