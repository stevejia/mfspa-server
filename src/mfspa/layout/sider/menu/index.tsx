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
import request from "../../../../request/request";
import config from "../../../../../mfspa.config";
const { SubMenu } = Menu;

interface MfspaMenuProps {
  collapsed: boolean;
}

class MfspaMenu extends React.Component<MfspaMenuProps, any> {
  state = {
    mockMenus: [],
    selectedKeys: [],
    openKeys: [],
    menus: [],
  };

  async componentDidMount() {
    const menus = await this.getMenus();
    const pathname = window.location.pathname;
    (window as any).addHistoryListener("historyChange", () => {
      console.log("menu: history change");
      const { mockMenus } = this.state;
      this.initSelctedMenus(pathname, mockMenus, menus);
    });
    (window as any).mfspa.on("getMockMenu", (event) => {
      console.log(event);
      const {
        data: { mockMenus = [] },
      } = event;
      this.initSelctedMenus(pathname, mockMenus, menus);
    });
  }

  private getMenus(): Promise<any> {
    return new Promise(async (resolve, reject): Promise<any> => {
      const {
        data: { menuList },
      } = await request.get(`${config.nodeHost}api/v1/menuinfo/getmenus`);
      // 本地菜单调试处理代码
      // menuList.forEach((menu) => {
      //   menu.url = menu.url?.replace(
      //     "http://www.mfspa.cc",
      //     "http://localhost:8077"
      //   );
      //   menu.relatedUrls = menu.relatedUrls?.map((url) => {
      //     return url.replace("http://www.mfspa.cc", "http://localhost:8077");
      //   });

      //   menu.subMenus.forEach((subMenu) => {
      //     subMenu.url = subMenu.url?.replace(
      //       "http://www.mfspa.cc",
      //       "http://localhost:8077"
      //     );
      //     subMenu.relatedUrls = subMenu.relatedUrls?.map((url) => {
      //       return url.replace("http://www.mfspa.cc", "http://localhost:8077");
      //     });
      //   });
      // });
      console.log(menuList);
      this.setState({ menus: menuList }, () => {
        resolve(menuList);
      });
    });
  }

  private initSelctedMenus(
    pathname: string,
    mockMenus: Array<any>,
    menus: Array<any>
  ) {
    const { selectedKeys, openKeys } = this.getSelectedAndOpenMenuKey(
      mockMenus,
      pathname,
      menus
    );
    this.setState({ mockMenus, selectedKeys, openKeys });
  }

  private getSelectedAndOpenMenuKey(mockMenus, pathname, menus) {
    //如果有mockMenus
    if (!!mockMenus?.length) {
      menus = mockMenus;
    }
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
    const { url, relatedUrls = [] } = menu;
    const urls = [url, ...relatedUrls];
    if (!subMenu) {
      if (this.mathPathname(urls, pathname)) {
        return true;
      }
      return false;
    }
    const { url: surl, relatedUrls: sRelatedUrls = [] } = subMenu;
    const surls = [surl, ...sRelatedUrls];
    if (this.mathPathname(surls, pathname)) {
      return true;
    }
    return false;
  }

  private mathPathname(urls: string[], pathname: string) {
    return urls.some((url) => {
      return url?.indexOf(pathname) > -1;
    });
  }

  renderMenus() {
    const { mockMenus, selectedKeys = [], openKeys = [], menus } = this.state;

    let mfspaMenus = menus;

    if (!!mockMenus.length) {
      mfspaMenus = mockMenus;
    }

    if (mfspaMenus.length <= 0) {
      return null;
    }
    const [firstMenu] = mfspaMenus;
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

    const mfspaMenusDom = (
      <Menu
        // defaultSelectedKeys={defaultSelectedKeys}
        // defaultOpenKeys={defaultOpenKeys}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        mode="inline"
        theme="dark"
      >
        {mfspaMenus.map((menu) => {
          const { subMenus } = menu;
          if (!subMenus || subMenus.length === 0) {
            return (
              <Menu.Item
                key={menu.key}
                onClick={(info) => {
                  window.history.pushState({ path: menu.url }, "", menu.url);
                  const { keyPath } = info;
                  const [selectedKeys, openKeys] = keyPath;
                  this.setState({
                    selectedKeys: [selectedKeys],
                    openKeys: [openKeys],
                  });
                }}
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
                  onClick={(info) => {
                    window.history.pushState(
                      { path: subMenu.url },
                      "",
                      subMenu.url
                    );
                    const { keyPath } = info;
                    const [selectedKeys, openKeys] = keyPath;
                    this.setState({
                      selectedKeys: [selectedKeys],
                      openKeys: [openKeys],
                    });
                  }}
                  // onClick={(info) => {
                  //   console.log(info);
                  // }}
                >
                  {subMenu.name}
                </Menu.Item>
              ))}
            </SubMenu>
          );
        })}
      </Menu>
    );
    return mfspaMenusDom;
  }

  render() {
    console.log(
      "openKeys & selectedKeys",
      this.state.openKeys,
      this.state.selectedKeys
    );
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
