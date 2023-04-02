import {
  ChangeRule,
  CompData,
  DefaultResizeConfig,
  Position,
  ResizeConfig,
} from "./types";
import "./dom/dom";
import SJEmitter from "./emitter/emitter";
let _isResizing = false;
class RotateResize extends SJEmitter<'rotate-start' | 'rotate' | 'rotate-end' | 'resize-start'|'resize' | 'resize-end'> {
  private changeRule: ChangeRule;
  private compData: CompData;
  private containerRect: DOMRect;
  private container: HTMLElement;
  private scale: number;
  private responsiveResize: any;
  private originIndex!: number;
  private scaleXToY!: number;
  private scaleYToX!: number;
  private currentPoint!: { x: number; y: number };
  private oppositePoint!: { x: number; y: number };
  private currentRule: any;
  private index!: number;
  private startDeltaX!: number;
  private startDeltay!: number;
  private config: ResizeConfig;
  private _selector: boolean;
  private selectDom: HTMLDivElement;
  private selectStyleDom: HTMLStyleElement;
  private rotateCenter: {x: number; y: number};
  private startPos: {x: number; y: number};
  private o_rotateDeg: number;
  constructor(config: ResizeConfig, elementLike: string | HTMLElement ) {
    super();
    if (!config.compData) {
      throw new Error("the compData is invalid!");
    }
    this.config = { ...DefaultResizeConfig, ...config };
    this.compData = JSON.parse(JSON.stringify(this.config.compData));
    this.scale = this.config.scale;
    this._selector = this.config.selector;
    this.changeRule = {
      0: {
        w: 0,
        h: 0,
        rw: 1,
        rh: 1,
      },
      1: {
        h: 0,
        w: -0.5,
      },
      2: {
        w: -1,
        h: 0,
        rw: 1,
        rh: -1,
      },
      3: {
        w: -1,
        h: -0.5,
      },
      4: {
        w: -1,
        h: -1,
        rw: 1,
        rh: 1,
      },
      5: {
        w: -0.5,
        h: -1,
      },
      6: {
        w: 0,
        h: -1,
        rw: 1,
        rh: -1,
      },
      7: {
        w: 0,
        h: -0.5,
      },
    };
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    this.init(elementLike);
  }
  
  public set showSelector(selector: boolean) {
    this._selector = selector;
  }

  public get showSelector(): boolean {
    return this._selector;
  }

  private init(elementLike: string | HTMLElement) {
    // this.compData = compData;
    let element: HTMLElement;
    if (typeof elementLike === "string") {
      element = document.querySelector(elementLike);
    } else {
      element = elementLike;
    }
    let container = element;
    if (!container) {
      return;
    }
    let rect = container!.parentElement.getBoundingClientRect();
    this.containerRect = rect;
    this.container = container;
    this.renderResizeOperator();
  }

  private renderResizeOperator() {
    if (!this.showSelector) {
      if (this.selectDom) {
        this.selectDom.remove();
      }
      if (this.selectStyleDom) {
        this.selectStyleDom.remove();
      }
      return;
    }
    if (this.selectDom) {
      return;
    }
    const [dir0, dir1, dir2, dir3] = this.getCursorDirections();
    const template = `<div class='component-select'>
                        <div index="0" class='select-item top-left ${dir0}-resize'></div>
                        <div index="1" class='select-item top-center ${dir1}-resize middle'></div>
                        <div index="2" class='select-item top-right ${dir2}-resize'></div>
                        <div index="3" class='select-item center-right ${dir3}-resize middle'></div>
                        <div index="4" class='select-item bottom-right ${dir0}-resize'></div>
                        <div index="5" class='select-item bottom-center ${dir1}-resize middle'></div>
                        <div index="6" class='select-item bottom-left ${dir2}-resize'></div>
                        <div index="7" class='select-item center-left ${dir3}-resize middle'></div>
                        <div class='rotate-container'>
                          <div class="dash-line"></div>
                          <div class="rotate"></div>
                        </div>
                    </div>`;
    const div = document.createElement("div");
    div.innerHTML = template;
    const compSelect = div.querySelector<HTMLDivElement>(".component-select");
    this.selectDom = compSelect;
    const selectItems = compSelect.querySelectorAll(".select-item");
    selectItems.forEach((item) => {
      item.addEventListener("mousedown", (event) => {
        const index = item.getAttribute("index");
        this.resize(event, this.compData, +index, this.config.scale);
      });
    });
    const rotateDom = compSelect.querySelector<HTMLDivElement>('.rotate');
    rotateDom.addEventListener('mousedown', this.rotate);
    this.container.append(compSelect);
    this.attachSelectorStyle();
  }

  private attachSelectorStyle() {
    const styleStr = `.component-select {
        width: 100%;
        height: 100%;
        border: 1px dashed;
        position: relative;
      }
      .select-item {
        width: 10px;
        height: 10px;
        background-color: red;
        position: absolute;
        transform: translate(-50%, -50%);
        cursor: ;
      }
      .select-item.top-left {
        left: 0;
        top: 0;
      }
      .select-item.top-center{
        left: 50%;
        top: 0;
      }
      .select-item.top-right {
        left: 100%;
        top: 0;
        cursor: ne-resize;
      }
      .select-item.center-right {
        left: 100%;
        top: 50%;
      }
      .select-item.bottom-right {
        left: 100%;
        top: 100%;
      }
      .select-item.bottom-center {
        left: 50%;
        top: 100%;
      }
      .select-item.bottom-left {
        left: 0;
        top: 100%;
      }
      .select-item.center-left {
        left: 0;
        top: 50%;
      }

      .select-item.nw-resize {
        cursor: nw-resize!important;
      }

      .select-item.n-resize {
        cursor: n-resize!important;
      }

      .select-item.ne-resize {
        cursor: ne-resize!important;
      }
      .select-item.e-resize {
        cursor: e-resize!important;
      }

      .component-select .rotate-container {
        position: absolute;
        left: 50%;
        top: -40px;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        flex-direction: column-reverse;
      }
      .rotate-container .dash-line {
        height: 20px;
        border-left: 1px dashed #000;
      }
      .component-select .rotate {
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnICBpZD0iTGF5ZXJfMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMzI7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0yOCwxNmMtMS4yMTksMC0xLjc5NywwLjg1OS0yLDEuNzY2QzI1LjI2OSwyMS4wMywyMi4xNjcsMjYsMTYsMjZjLTUuNTIzLDAtMTAtNC40NzgtMTAtMTBTMTAuNDc3LDYsMTYsNiAgYzIuMjQsMCw0LjI5NSwwLjc1Myw1Ljk2LDJIMjBjLTEuMTA0LDAtMiwwLjg5Ni0yLDJzMC44OTYsMiwyLDJoNmMxLjEwNCwwLDItMC44OTYsMi0yVjRjMC0xLjEwNC0wLjg5Ni0yLTItMnMtMiwwLjg5Ni0yLDJ2MC41MTggIEMyMS43MzMsMi45MzIsMTguOTc3LDIsMTYsMkM4LjI2OCwyLDIsOC4yNjgsMiwxNnM2LjI2OCwxNCwxNCwxNGM5Ljk3OSwwLDE0LTkuNSwxNC0xMS44NzVDMzAsMTYuNjcyLDI4LjkzOCwxNiwyOCwxNnoiLz48L3N2Zz4=);
        width: 15px;
        height: 15px;
        cursor: pointer;
      }
    }`;
    if (!this.selectStyleDom) {
      this.selectStyleDom = document.createElement("style");
      this.selectStyleDom.innerHTML = styleStr;
      document.head.append(this.selectStyleDom);
    }
  }

  private getCursorDirections() {
    let directions = ["nw", "n", "ne", "e"];
    let { rotate } = this.compData;
    rotate = rotate >= 170 ? rotate - 180 : rotate;
    rotate += 10;
    const index = Math.floor(rotate / 45);
    const restDirs = directions.splice(0, index);
    directions = [...directions, ...restDirs];
    return directions;
  }

  onKeyDown = (event: { shiftKey: any }) => {
    if (_isResizing) {
      return;
    }
    let responsiveResize = event.shiftKey;
    let middles = this.getMiddles();
    middles!.forEach((mEl: any) => {
      mEl.style.display = responsiveResize ? "none" : "block";
    });
  };

  onKeyUp = () => {
    if (_isResizing) {
      return;
    }
    let middles = this.getMiddles();
    middles!.forEach((mEl: any) => {
      mEl.style.display = "block";
    });
  };

  private getMiddles() {
    let middles: NodeListOf<HTMLDivElement>;
    if (this.selectDom) {
      middles = this.selectDom.querySelectorAll<HTMLDivElement>(".middle");
    }
    return middles;
  }

  /**
   * 旋转后变换
   * @param {*} event
   * @param {*} index
   * @param {*} rect
   */
  resize(
    event: {
      shiftKey?: any;
      stopPropagation?: any;
      preventDefault?: any;
      pageX?: any;
      pageY?: any;
    },
    compData: any,
    index: number,
    scale: any
  ) {
    _isResizing = true;
    this.scale = scale;
    let responsiveResize = event.shiftKey;
    this.responsiveResize = responsiveResize;
    let middles = this.getMiddles();
    middles!.forEach((mEl: any) => {
      mEl.style.display = responsiveResize ? "none" : "block";
    });
    if (this.responsiveResize) {
      this.originIndex = index;
      this.scaleXToY = this.compData.width / this.compData.height;
      this.scaleYToX = this.compData.height / this.compData.width;
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
      deg,
    };
    let { points } = this._calcCoordinate(rect);
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
    this.index = index;
    let center = {
      x: x + ox + width / 2,
      y: y + oy + height / 2,
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
    this.emit("resize-start");
  }

  /**
   * 缩放过程中鼠标移动控制缩放的大小 位置
   */
  mouseMove = (event: {
    stopPropagation?: any;
    preventDefault?: any;
    pageX?: any;
    pageY?: any;
  }) => {
    event.stopPropagation();
    event.preventDefault();
    //获取鼠标当前的位置
    let { pageX, pageY } = event;
    let { x: outX, y: outY } = this.containerRect;
    pageX = (pageX - outX) / this.scale + outX;
    pageY = (pageY - outY) / this.scale + outY;

    let { x, y } = this.oppositePoint;
    let newCenter = {
      x: (pageX + x) / 2,
      y: (pageY + y) / 2,
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
        y: (this.oppositePoint.y + pPoint.y) / 2,
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
      if ([1, 5].indexOf(this.originIndex) > -1) {
        let scaleXToY = this.scaleXToY;
        nw = scaleXToY * nh;
      } else {
        let scaleYToX = this.scaleYToX;
        nh = scaleYToX * nw;
      }

      // let resizeScale = nw / this.responsiveWidth;
      let oDx = this.currentPoint.x - this.oppositePoint.x;
      let oDy = this.currentPoint.y - this.oppositePoint.y;

      //未变换的矩形框对角线长度
      let a = Math.sqrt(Math.pow(oDx, 2) + Math.pow(oDy, 2));
      //变换后的矩形框对角线长度
      let b = Math.sqrt(Math.pow(nw, 2) + Math.pow(nh, 2));

      //根据三角形相似原理a/b = deltax/deltanx = deltaY/detaNY

      let newX = (b * this.currentPoint.x + (a - b) * this.oppositePoint.x) / a;
      let newY = (b * this.currentPoint.y + (a - b) * this.oppositePoint.y) / a;

      newCenter = {
        x: (this.oppositePoint.x + newX) / 2,
        y: (this.oppositePoint.y + newY) / 2,
      };
      noRotateCordinate2 = this._calcRotatedCordinate(
        this.oppositePoint,
        newCenter,
        -this.compData.rotate
      );
    }
    let left = noRotateCordinate2.x + nw * this.currentRule.w;
    let top = noRotateCordinate2.y + nh * this.currentRule.h;
    left = left - outX;
    top = top - outY;
    if (
      (this.compData.width !== 1 && this.compData.height !== 1) ||
      (nw !== 1 && nh !== 1)
    ) {
      this.compData.width = Math.floor(nw);
      this.compData.height = Math.floor(nh);
      this.compData.left = Math.floor(left);
      this.compData.top = Math.floor(top);
      this.emit("resize", this.compData);
    }
  };
  private mouseUp = (event: {
    stopPropagation: () => void;
    preventDefault: () => void;
  }) => {
    _isResizing = false;
    this.responsiveResize = false;
    event.stopPropagation();
    event.preventDefault();
    document.removeEventListener("mousemove", this.mouseMove, false);
    document.removeEventListener("mouseup", this.mouseUp, false);
    this.emit("resize-end");
  };
  /**
   * 根据线上两点坐标求直线的坐标方程 y=kx+b的k值和b值（k指斜率 b指x=0时的y坐标的值）
   * 特殊的当两点坐标的x轴坐标相同时 k不存在（null）b不存在（null）但是会有一个x轴的默认值x
   * 此方法返回三个参数（k b x)分别对应上一句中的k b x
   * @param {*} linePoint1 对角线点坐标
   * @param {*} linePoint2 当前点坐标
   */
  private getSlope(
    linePoint1: { y: any; x: any },
    linePoint2: { x: any; y: any }
  ) {
    let { x: x1, y: y1 } = linePoint1;
    let { x: x2, y: y2 } = linePoint2;
    let k = null;
    let b = null;
    let x = null;
    //当斜率不存在时
    if (x2 - x1 !== 0) {
      //直线斜率存在
      k = k = (y2 - y1) / (x2 - x1);
      b = linePoint1.y - linePoint1.x * k;
    } else {
      //斜率不存在
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
  private getProjectivePoint(
    pOut: { x?: any; y: any },
    lineParam: { k: any; b: any; x: any }
  ) {
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
  private _calcCoordinate(rect: {
    ox: any;
    oy: any;
    x: any;
    y: any;
    width: any;
    height: any;
    deg: any;
  }) {
    let { x, y, ox, oy, width, height, deg } = rect;
    x += ox;
    y += oy;
    let center = {
      x: x + width / 2,
      y: y + height / 2,
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
   * 极坐标变换公式
   * 已知圆上一点坐标current(x1, y1) 和圆心坐标center(x0, y0)
   * 以及旋转角度deg
   * 旋转deg角度后的坐标P(rx, ry)
   * rx = (x1-x0)*cos(deg)-(y1-y0)*sin(deg)+x0
   * ry = (y1 - y0) * cos(deg) + (x1 - x0) * sin(deg) + y0
   * @param {*} current 假设坐标为(x1, y1)
   * @param {*} center  假设坐标为(x0, y0)
   * @param {*} deg 旋转角度
   */
  private _calcRotatedCordinate(
    current: { x: any; y: any },
    center: { x: any; y: any },
    deg: number
  ) {
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

  rotate = (event: MouseEvent) => {
    const {clientX, clientY} = event;
    let { width, height, left, top } = this.container.getBoundingClientRect();
      let { rotate } = this.compData;
      this.rotateCenter = {
        x: left + width / 2,
        y: top + height / 2
      };
      this.startPos = {
        x: clientX - this.rotateCenter.x,
        y: clientY - this.rotateCenter.y
      };
      this.o_rotateDeg = rotate;
      document.addEventListener('mousemove', this.rotating);
      document.addEventListener('mouseup', this.rotateEnd);
      this.emit('rotate-start');
  }

  private rotating = (event: MouseEvent) => {
    var { pageX, pageY } = event;
        var current = {
          x: pageX - this.rotateCenter.x,
          y: pageY - this.rotateCenter.y
        };
        var DEG_SCALE = 3;
        var o_rotateDeg = this.o_rotateDeg;
        var back_roateDeg = this.compData.rotate;
        var rotateDeg = this.calcDeg(
          current,
          this.startPos,
          o_rotateDeg,
          back_roateDeg,
          DEG_SCALE
        );
        this.compData.rotate = rotateDeg;
        this.startPos = current;
        this.emit('rotate', rotateDeg);
  } 

  private rotateEnd = (event) => {
    document.removeEventListener('mousemove', this.rotating);
    document.removeEventListener('mouseup', this.rotateEnd);
    const directions = this.getCursorDirections();
    const items = this.selectDom!.querySelectorAll('.select-item');
    items!.forEach((item, index)=> {
      item.classList.remove('nw-resize');
      item.classList.remove('n-resize');
      item.classList.remove('ne-resize');
      item.classList.remove('e-resize');
      item.classList.add(`${directions[index%4]}-resize`);
    });
    this.emit('rotate-end');
  }

  private calcDeg(current: Position, origin: Position, o_rotateDeg:number, o_backupDeg: number, deg_scale: number) {
    let o = Math.sqrt(origin.x * origin.x + origin.y * origin.y);
    let c = Math.sqrt(current.x * current.x + current.y * current.y);
    let z = Math.sqrt(
      Math.pow(current.x - origin.x, 2) + Math.pow(current.y - origin.y, 2)
    );
    let cosZ = (Math.pow(o, 2) + Math.pow(c, 2) - Math.pow(z, 2)) / (2 * o * c);
    let zPI = Math.acos(cosZ);
    let zDeg = 180 / (Math.PI / zPI);
    //叉乘判断鼠标顺序 为负值 标识逆时针 为正值 表示顺时针
    let crossMultiply = origin.x * current.y - origin.y * current.x;
    let newDeg = Number(o_rotateDeg + zDeg);
    if (crossMultiply < 0) {
      newDeg = Number(o_rotateDeg - zDeg);
    }
    if (newDeg >= 360) {
      newDeg = 0;
    } else if (newDeg < 0) {
      newDeg = 360 + newDeg;
    }
    this.o_rotateDeg = o_rotateDeg = newDeg;
    if (o_backupDeg % 90 === 0) {
      if (
        o_rotateDeg >
          (o_backupDeg === 0 ? (crossMultiply < 0 ? 360 : 0) : o_backupDeg) -
            deg_scale &&
        o_rotateDeg <
          (o_backupDeg === 0 ? (crossMultiply < 0 ? 360 : 0) : o_backupDeg) +
            deg_scale
      ) {
        return o_backupDeg;
      }
    } else {
      if (newDeg % 90 >= 90 - deg_scale && newDeg % 90 < 90) {
        newDeg = 90 * (Math.floor(newDeg / 90) + 1);
      } else if (newDeg % 90 <= deg_scale && newDeg % 90 > 0) {
        newDeg = 90 * Math.floor(newDeg / 90);
      }
    }
    newDeg = Math.round(newDeg >= 360 ? 0 : newDeg);

    return newDeg;
  }
}

export default RotateResize;
