import { ChangeRule, CompData, ResizeRect } from "./types";
import './dom/dom';
import SJEmitter from "./emitter/emitter";
let _isResizing = false;
class RotateResize extends SJEmitter {
  changeRule: ChangeRule;
  compData: CompData;
  containerRect: DOMRect;
  scale: number;
  responsiveResize: any;
  originIndex!: number;
  scaleXToY!: number;
  scaleYToX!: number;
  currentPoint!: { x: number; y: number; };
  oppositePoint!: { x: number; y: number; };
  currentRule: any;
  originPos!: { pageX: number; pageY: number; };
  index!: number;
  rect!: ResizeRect;
  startDeltaX!: number;
  startDeltay!: number;
  constructor() {
    super();
    this.changeRule = {
      0: {
        w: 0,
        h: 0,
        rw: 1,
        rh: 1
      },
      1: {
        h: 0,
        w: -0.5
      },
      2: {
        w: -1,
        h: 0,
        rw: 1,
        rh: -1
      },
      3: {
        w: -1,
        h: -0.5
      },
      4: {
        w: -1,
        h: -1,
        rw: 1,
        rh: 1
      },
      5: {
        w: -0.5,
        h: -1
      },
      6: {
        w: 0,
        h: -1,
        rw: 1,
        rh: -1
      },
      7: {
        w: 0,
        h: -0.5
      }
    };
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  init(vm: any, elementLike: string | HTMLElement) {
    this._init(vm, elementLike);
  }
  _init(vm: any, elementLike: string | HTMLElement) {
    this.compData = vm;
    let element: HTMLElement;
    if(typeof elementLike === 'string') {
      element = document.querySelector(elementLike);
    }else {
      element = elementLike;
    }
    // let element = document.querySelector(`${elementCls}.single`);
    let container = element;
    // container.on('click', (event)=> {
    //   // event.preventDefault();
    //   // event.stopPropagation();
    //   console.log('container clicked');
    // }, true);
    // document.documentElement.on('click', ()=> {
    //   console.log('document clicked');
    // });
    // let container = document.querySelector(elementCls);
    if (!container) {
      return;
    }
    let rect = container!.getBoundingClientRect();
    this.containerRect = rect;
  }

  onKeyDown(event: { shiftKey: any; }) {
    if (_isResizing) {
      return;
    }
    let responsiveResize = event.shiftKey;
    let middles = document.querySelectorAll("div[middle]");
    middles.forEach((mEl: any) => {
      mEl.style.display = responsiveResize ? "none" : "block";
    });
  }

  onKeyUp() {
    if (_isResizing) {
      return;
    }
    let middles = document.querySelectorAll("div[middle]");
    middles.forEach((mEl: any) => {
      mEl.style.display = "block";
    });
  }

  /**
   *
   * @param {*} event
   * @param {*} index
   * @param {*} rect
   * 旋转后变换
   */

  resize(event: { shiftKey?: any; stopPropagation?: any; preventDefault?: any; pageX?: any; pageY?: any; }, compData: any, index: number, scale: any) {
    _isResizing = true;
    this.scale = scale;
    let responsiveResize = event.shiftKey;
    this.responsiveResize = responsiveResize;
    let middles = document.querySelectorAll("div[middle]");
    middles.forEach((mEl: any) => {
      mEl.style.display = responsiveResize ? "none" : "block";
    });
    if (this.responsiveResize) {
      this.originIndex = index;
      this.scaleXToY = this.compData.width / this.compData.height;
      this.scaleYToX = this.compData.height / this.compData.width;
      // if (index % 2 === 1) {
      //   index = (++index) % 8;
      // }
    }
    this.compData = compData;
    event.stopPropagation();
    event.preventDefault();
    let { left: ox, top: oy } = this.containerRect;
    let { left: x, top: y, width, height, rotate: deg } = this.compData;
    let rect = {
      ox,
      oy,
      x,
      y,
      width,
      height,
      deg
    };
    let { points } = this._calcCoordinate(rect);
    let { pageX, pageY } = event;

    //index是当前resize的位置索引（0-7）左上角开始，顺时针递增
    //根据index获取当前位置的坐标
    let currentPoint = points[index];
    this.currentPoint = currentPoint;
    //根据index获取对角线位置（缩放固定点）的坐标
    let oppositePoint = points[(index + 4) % 8];
    this.oppositePoint = oppositePoint;
    //根据当前的索引获取缩放时固定点(缩放点的对角点)相对于左上角的位置关系
    //例如 右下角为缩放固定点的时候，那么右下角的x-width=左上角的x y-height=左上角的y
    this.currentRule = this.changeRule[(index + 4) % 8];

    // let { pageX, pageY } = event;

    this.originPos = { pageX, pageY };

    this.index = index;
    this.rect = rect;

    let center = {
      x: x + ox + width / 2,
      y: y + oy + height / 2
    };
    let originCurrent = this._calcRotatedCordinate(currentPoint, center, -deg);
    let originOpposite = this._calcRotatedCordinate(
      oppositePoint,
      center,
      -deg
    );
    this.startDeltaX = originCurrent.x - originOpposite.x;
    this.startDeltay = originCurrent.y - originOpposite.y;
    document.addEventListener("mousemove", this.mouseMove, false);
    document.addEventListener("mouseup", this.mouseUp, false);
  }

  /**
   * 缩放过程中鼠标移动控制缩放的大小 位置
   */
  mouseMove = (event: { stopPropagation?: any; preventDefault?: any; pageX?: any; pageY?: any; }) => {
    event.stopPropagation();
    event.preventDefault();
    //获取鼠标当前的位置
    let { pageX, pageY } = event;
    let { x: outX, y: outY } = this.containerRect;

    pageX = (pageX - outX) / this.scale + outX;
    pageY = (pageY - outY) / this.scale + outY;
    // pageX = pageX / this.scale;
    // pageY = pageY / this.scale;
    // console.log(pageX, pageY);
    // console.log(pageX / this.scale, pageY / this.scale);

    // if (this.responsiveResize) {
    //   let deltaPageX = pageX - this.originPos.pageX;
    //   let deltaPageY = pageY - this.originPos.pageY;
    //   if ([1, 5].indexOf(this.originIndex) > -1) {
    //     let scaleXToY = this.scaleXToY;
    //     deltaPageX = -scaleXToY * deltaPageY;

    //   } else {
    //     let scaleYToX = this.scaleYToX;
    //     deltaPageY = scaleYToX * deltaPageX;
    //   }
    //   pageX = this.currentPoint.x + this.currentRule.rw * deltaPageX;
    //   pageY = this.currentPoint.y + this.currentRule.rh * deltaPageY;
    // }

    let { x, y } = this.oppositePoint;
    let newCenter = {
      x: (pageX + x) / 2,
      y: (pageY + y) / 2
    };
    let noRotateCordinate = this._calcRotatedCordinate(
      { x: pageX, y: pageY },
      newCenter,
      -this.compData.rotate
    );
    let noRotateCordinate2 = this._calcRotatedCordinate(
      { x, y },
      newCenter,
      -this.compData.rotate
    );
    let widthChange = [0, 2, 3, 4, 6, 7].indexOf(this.index) > -1;
    let heightChange = [0, 1, 2, 4, 5, 6].indexOf(this.index) > -1;
    let deltaX = noRotateCordinate.x - noRotateCordinate2.x;
    let deltaY = noRotateCordinate.y - noRotateCordinate2.y;

    let nw = widthChange ? Math.abs(deltaX) : this.compData.width;
    let nh = heightChange ? Math.abs(deltaY) : this.compData.height;
    if ([1, 3, 5, 7].indexOf(this.index) > -1) {
      let param = this.getSlope(this.currentPoint, this.oppositePoint);
      let pPoint = this.getProjectivePoint({ x: pageX, y: pageY }, param);
      newCenter = {
        x: (this.oppositePoint.x + pPoint.x) / 2,
        y: (this.oppositePoint.y + pPoint.y) / 2
      };
      noRotateCordinate2 = this._calcRotatedCordinate(
        this.oppositePoint,
        newCenter,
        -this.compData.rotate
      );
      //[1, 5]表示按高度缩放 宽度不变
      if ([1, 5].indexOf(this.index) > -1) {
        nh = Math.sqrt(
          Math.pow(pPoint.y - this.oppositePoint.y, 2) +
            Math.pow(pPoint.x - this.oppositePoint.x, 2)
        );
      } else if ([3, 7].indexOf(this.index) > -1) {
        //[3, 7]表示按宽度缩放 高度不变
        nw = Math.sqrt(
          Math.pow(pPoint.y - this.oppositePoint.y, 2) +
            Math.pow(pPoint.x - this.oppositePoint.x, 2)
        );
      }
    }
    //缩放边界判断&处理
    //如果高度超出边界 那么高度固定1px
    let overflowY = this.startDeltay * deltaY < 0;
    if (overflowY) {
      nh = 1;
    }
    //如果宽度超出边界 那么宽度固定1px
    let overflowX = this.startDeltaX * deltaX < 0;
    if (overflowX) {
      nw = 1;
    }

    if (this.responsiveResize) {
      // if (!this.responsiveWidth) {
      //   this.responsiveWidth = this.compData.width;
      // }

      if ([1, 5].indexOf(this.originIndex) > -1) {
        let scaleXToY = this.scaleXToY;
        nw = scaleXToY * nh;
      } else {
        let scaleYToX = this.scaleYToX;
        nh = scaleYToX * nw;
      }

      // let resizeScale = nw / this.responsiveWidth;
      // console.log(resizeScale);
      let oDx = this.currentPoint.x - this.oppositePoint.x;
      let oDy = this.currentPoint.y - this.oppositePoint.y;

      //未变换的矩形框对角线长度
      let a = Math.sqrt(Math.pow(oDx, 2) + Math.pow(oDy, 2));
      //变换后的矩形框对角线长度
      let b = Math.sqrt(Math.pow(nw, 2) + Math.pow(nh, 2));

      //根据三角形相似原理a/b = deltax/deltanx = deltaY/detaNY

      let newX = (b * this.currentPoint.x + (a - b) * this.oppositePoint.x) / a;
      let newY = (b * this.currentPoint.y + (a - b) * this.oppositePoint.y) / a;

      //   let newX = oDx * resizeScale + this.oppositePoint.x;
      // let newY = oDy * resizeScale + this.oppositePoint.y;
      // console.log(newX, newY);
      newCenter = {
        x: (this.oppositePoint.x + newX) / 2,
        y: (this.oppositePoint.y + newY) / 2
      };
      // this.testDiv(newCenter.x, newCenter.y);
      noRotateCordinate2 = this._calcRotatedCordinate(
        this.oppositePoint,
        newCenter,
        -this.compData.rotate
      );
      // this.testDiv(noRotateCordinate2.x, noRotateCordinate2.y);
    }

    //TODO::旋转后 超出边界 固定位置计算逻辑还未给出

    // if (overflowY || overflowX) {
    //     let r = Math.sqrt(nw * nw + nh * nh) / 2;
    //     noRotateCordinate2 = {
    //         x: this.oppositePoint.x + r * Math.cos(-this.rect.deg / 180 * Math.PI),
    //         y: this.oppositePoint.y + r * Math.sin(-this.rect.deg / 180 * Math.PI)
    //     }
    // }
    let left = noRotateCordinate2.x + nw * this.currentRule.w;
    let top = noRotateCordinate2.y + nh * this.currentRule.h;
    // let { x: outX, y: outY } = this.containerRect;
    left = left - outX;
    top = top - outY;
    console.log(left, top);
    if((this.compData.width !== 1 && this.compData.height !== 1) || (nw !== 1 && nh !== 1)) {
      this.compData.width = Math.floor(nw);
      this.compData.height = Math.floor(nh);
      this.compData.left = Math.floor(left);
      this.compData.top = Math.floor(top);
      this.emit('resize', this.compData);
    }
    // this.symbolVm.resizeHeight();

    //TODO:: callback here...
  }
  // testDiv(x, y) {
  //   let div = document.querySelector("#testDiv");
  //   if (!div) {
  //     div = document.createElement("div");
  //     document.body.append(div);
  //     div.setAttribute("id", "testDiv");
  //     div.style.position = "absolute";
  //     div.style.backgroundColor = "red";
  //     div.style.width = "10px";
  //     div.style.height = "10px";
  //     div.style.zIndex = "999999";
  //   }
  //   div.style.left = `${x}px`;
  //   div.style.top = `${y}px`;
  // }
  // _respoonsiveResize() { }

  mouseUp = (event: { stopPropagation: () => void; preventDefault: () => void; }) => {
    _isResizing = false;
    this.responsiveResize = false;
    // this.responsiveWidth = null;
    event.stopPropagation();
    event.preventDefault();
    document.removeEventListener("mousemove", this.mouseMove, false);
    document.removeEventListener("mouseup", this.mouseUp, false);
    //缩放结束后 记录一次历史
    // this.editorIns.$history.setHistory(1);
  }
  /**
   *
   * 根据线上两点坐标求直线的坐标方程 y=kx+b的k值和b值（k指斜率 b指x=0时的y坐标的值）
   * 特殊的当两点坐标的x轴坐标相同时 k不存在（null）b不存在（null）但是会有一个x轴的默认值x
   * 此方法返回三个参数（k b x)分别对应上一句中的k b x
   * @param {*} linePoint1 对角线点坐标
   * @param {*} linePoint2 当前点坐标
   */
  getSlope(linePoint1: { y: any; x: any; }, linePoint2: { x: any; y: any; }) {
    let { x: x1, y: y1 } = linePoint1;
    let { x: x2, y: y2 } = linePoint2;
    let k = null;
    let b = null;
    let x = null;
    //当斜率不存在时
    if (x2 - x1 !== 0) {
      k = k = (y2 - y1) / (x2 - x1);
      b = linePoint1.y - linePoint1.x * k;
    } else {
      x = linePoint1.x;
    }
    return { k, b, x };
  }

  /**
   * 直线外一点P(x0, y0)到直线y=kx+b的投影坐标计算
   * 计算公式(斜率k存在的情况)：x1 = (k(y0-b)+x0)/(k*k+1)
   *                          y1 = kx1+b
   * @param {*} pOut 线外一点
   * @param {*} lineParam 直线坐标方程的参数 k b x 对应getSlop方法返回的三个参数 k b x
   */
  getProjectivePoint(pOut: { x?: any; y: any; }, lineParam: { k: any; b: any; x: any; }) {
    let { k, b, x } = lineParam;
    let { x: x0, y: y0 } = pOut;
    //默认如果斜率不存在 k===null时的坐标
    let pPoint = { x, y: pOut.y };
    //斜率k存在 k!==null 时的坐标计算逻辑
    if (k !== null) {
      pPoint.x = (k * (y0 - b) + x0) / (1 + k * k);
      pPoint.y = k * pPoint.x + b;
    }
    return pPoint;
  }
  /**
   *
   * @param {*} rect
   * 以左上角为起点 方向顺时针 计算旋转deg角度后的各个点坐标
   */
  _calcCoordinate(rect: { ox: any; oy: any; x: any; y: any; width: any; height: any; deg: any; }) {
    let { x, y, ox, oy, width, height, deg } = rect;
    x += ox;
    y += oy;
    let center = {
      x: x + width / 2,
      y: y + height / 2
    };
    //左上角旋转deg后坐标
    let origin = { x, y };
    let cp0 = this._calcRotatedCordinate(origin, center, deg);

    //上中旋转deg后坐标
    origin = { x: x + width / 2, y };
    let cp1 = this._calcRotatedCordinate(origin, center, deg);
    //右上角旋转deg后坐标
    origin = { x: x + width, y };
    let cp2 = this._calcRotatedCordinate(origin, center, deg);

    //右中旋转deg后坐标
    origin = { x: x + width, y: y + height / 2 };
    let cp3 = this._calcRotatedCordinate(origin, center, deg);

    //右下角旋转deg后坐标
    origin = { x: x + width, y: y + height };
    let cp4 = this._calcRotatedCordinate(origin, center, deg);

    //下中旋转deg后坐标
    origin = { x: x + width / 2, y: y + height };
    let cp5 = this._calcRotatedCordinate(origin, center, deg);

    //左下角旋转deg后坐标
    origin = { x, y: y + height };
    let cp6 = this._calcRotatedCordinate(origin, center, deg);

    //左中旋转deg后坐标
    origin = { x, y: y + height / 2 };
    let cp7 = this._calcRotatedCordinate(origin, center, deg);
    return { points: [cp0, cp1, cp2, cp3, cp4, cp5, cp6, cp7] };
  }
  /**
   *
   * @param {*} current 假设坐标为(x1, y1)
   * @param {*} center  假设坐标为(x0, y0)
   * @param {*} deg 旋转角度
   * 极坐标变换公式
   * 已知圆上一点坐标current(x1, y1) 和圆心坐标center(x0, y0)
   * 以及旋转角度deg
   * 旋转deg角度后的坐标P(rx, ry)
   * rx = (x1-x0)*cos(deg)-(y1-y0)*sin(deg)+x0
   * ry = (y1 - y0) * cos(deg) + (x1 - x0) * sin(deg) + y0
   */
  _calcRotatedCordinate(current: { x: any; y: any; }, center: { x: any; y: any; }, deg: number) {
    let rAngle = (Math.PI / 180) * deg;
    let rx =
      (current.x - center.x) * Math.cos(rAngle) -
      (current.y - center.y) * Math.sin(rAngle) +
      center.x;
    let ry =
      (current.y - center.y) * Math.cos(rAngle) +
      (current.x - center.x) * Math.sin(rAngle) +
      center.y;
    return { x: rx, y: ry };
  }
}

export default RotateResize;