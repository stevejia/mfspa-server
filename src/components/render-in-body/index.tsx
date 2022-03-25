import React, { Component } from "react";
import ReactDom from "react-dom";
export default class RenderInBody extends Component<any, any> {
  private compDom = null;
  componentDidMount() {
    //新建一个div标签并塞进body
    this.compDom = document.createElement("div");
    document.body.appendChild(this.compDom);
    this._renderLayer();
  }
  componentDidUpdate() {
    this._renderLayer();
  }
  componentWillUnmount() {
    //在组件卸载的时候，保证弹层也被卸载掉
    ReactDom.unmountComponentAtNode(this.compDom);
    document.body.removeChild(this.compDom);
  }
  _renderLayer() {
    //将弹层渲染到body下的div标签
    ReactDom.render(this.props.children, this.compDom);
  }
  render() {
    return null;
  }
}
