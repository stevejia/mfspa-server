import { Button } from "antd";
import React, { ReactNode } from "react";

interface ArcConfig {
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  counterclockwise?: boolean;
  strokeStyle?: string | CanvasGradient | CanvasPattern;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  fillText?: string;
  fillTextStyle?: string | CanvasGradient | CanvasPattern;
  rotate?: number;
}

interface BallConfig {
  x: number;
  y: number;
  sx?: number;
  sy?: number;
  fillText?: string;
  pinned?: boolean;
  rotate?: number;
}

interface OpenAwardState {
  openAwarding: boolean;
  awardBallsConfig: BallConfig[];
}

export default class OpenAward extends React.Component<any, OpenAwardState> {
  state = {
    openAwarding: false,
    awardBallsConfig: [],
  };
  private canvasRef: HTMLCanvasElement = null;
  private context2d: CanvasRenderingContext2D = null;
  private rotateDeg: number = 0;
  private ballsConfig: BallConfig[] = [];
  private timeStamp = 0;
  private waiting = false;
  // private awardBallsConfig: BallConfig[] = [];
  componentDidMount(): void {
    this.context2d = this.canvasRef.getContext("2d");
    this.draw(true);
  }
  private timer = null;
  drawScrollArc(config: ArcConfig) {
    const { x, y, radius, fillStyle, strokeStyle, rotate } = config;
    const config1 = {
      x,
      y,
      radius,
      fillStyle,
      strokeStyle,
      startAngle: Math.PI / 12 + rotate,
      endAngle: Math.PI / 2 - Math.PI / 12 + rotate,
    };
    this.drawArc(config1);
    const config2 = {
      x,
      y,
      radius,
      fillStyle,
      strokeStyle,
      startAngle: Math.PI / 2 + Math.PI / 12 + rotate,
      endAngle: Math.PI - Math.PI / 12 + rotate,
      rotate,
    };
    this.drawArc(config2);

    const config3 = {
      x,
      y,
      radius,
      fillStyle,
      strokeStyle,
      startAngle: Math.PI + Math.PI / 12 + rotate,
      endAngle: Math.PI * 1.5 - Math.PI / 12 + rotate,
      rotate,
    };
    this.drawArc(config3);

    const config4 = {
      x,
      y,
      radius,
      fillStyle,
      strokeStyle,
      startAngle: Math.PI * 1.5 + Math.PI / 12 + rotate,
      endAngle: Math.PI * 2 - Math.PI / 12 + rotate,
      rotate,
    };
    this.drawArc(config4);
  }

  drawArc(config: ArcConfig) {
    const { context2d: ctx } = this;
    ctx.beginPath();
    const {
      x,
      y,
      radius,
      fillStyle,
      strokeStyle,
      startAngle,
      endAngle,
      fillText,
      fillTextStyle,
      rotate,
    } = config;
    ctx.arc(x, y, radius, startAngle, endAngle);
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    ctx.closePath();
    if (fillText) {
      const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } =
        ctx.measureText(fillText);
      let actualHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;
      const tx = x - Math.ceil(width / 2);
      const ty = y + Math.ceil(actualHeight / 2);
      ctx.beginPath();
      ctx.fillStyle = fillTextStyle || "black";
      ctx.fillText(fillText, tx, ty);
      ctx.font = "normal bold 15px Arial";
      // if (rotate) {
      //   ctx.rotate(rotate);
      // }
      ctx.closePath();
    }
  }

  generateXY({ x, y, radius, radius2 }) {
    const nx = this.getCoordinate(x, radius, radius2);
    const deltaY = Math.sqrt(radius * radius - (nx - x) * (nx - x));
    const ny = this.getCoordinate(y, deltaY, radius2);
    return { nx, ny };
  }

  drawBalls(x, y, radius, radius2) {
    const ballsConfig = this.getBallsConfig(x, y, radius, radius2);
    ballsConfig.forEach((conf) => {
      const arcConf: ArcConfig = {
        x: conf.x,
        y: conf.y,
        radius: 10,
        fillStyle: "red",
        fillText: conf.fillText,
        fillTextStyle: "white",
        startAngle: 0,
        endAngle: Math.PI * 2,
      };
      this.drawArc(arcConf);
    });
  }

  private getBallsConfig(
    x: number,
    y: number,
    radius: number,
    radius2: number
  ): BallConfig[] {
    let ballsConfig = (this.ballsConfig = []);
    if (!ballsConfig?.length) {
      for (let i = 0; i < 10; i++) {
        const { nx, ny } = this.generateXY({ x, y, radius, radius2 });
        const config: BallConfig = {
          x: nx,
          y: ny,
          fillText: `${i}`,
        };
        this.ballsConfig.push(config);
      }
    }
    return this.ballsConfig;
  }

  getCoordinate(coordinate: number, delta: number, radius2) {
    const minus = Math.random() > 0.5;
    let rand = Math.floor(Math.random() * delta);
    if (minus) {
      rand = -rand + radius2 + 5;
    } else {
      rand = rand - radius2 - 5;
    }
    return coordinate + rand;
  }

  private ended() {
    if (this.state.awardBallsConfig.length < 7) {
      return false;
    }
    const last = this.state.awardBallsConfig.slice(-1)[0];
    return last.pinned;
  }

  draw(init?: boolean) {
    if (this.ended()) {
      clearInterval(this.timer);
      this.setState({ openAwarding: false });
      return;
    }
    if (!this.waiting) {
      this.timeStamp += 32;
    }
    if (this.timeStamp > 2000) {
      this.waiting = true;
      this.timeStamp = 0;
      this.state.awardBallsConfig.push({
        x: 200,
        y: 250,
        sx: 200,
        sy: 250,
        fillText: `${Math.floor(Math.random() * 9)}`,
        rotate: (Math.PI * 2 * Math.random()) / 180,
      });
      this.setState({ awardBallsConfig: this.state.awardBallsConfig });
    }
    this.context2d.clearRect(0, 0, 500, 440);

    this.drawArc({
      x: 200,
      y: 150,
      radius: 100,
      strokeStyle: "black",
      startAngle: Math.PI * 0.55,
      endAngle: Math.PI * 2.45,
    });
    this.rotateDeg += Math.PI / 30;
    if (this.rotateDeg > Math.PI * 2) {
      this.rotateDeg -= Math.PI * 2;
    }
    this.drawScrollArc({
      x: 200,
      y: 150,
      radius: 90,
      startAngle: 0,
      endAngle: 0,
      strokeStyle: "yellow",
      rotate: this.rotateDeg,
    });
    this.drawPipeLine(200, 150, 100, 0.05 * Math.PI);
    if (init) {
      return;
    }

    this.drawBalls(200, 150, 100, 10);

    // this.context2d.beginPath();
    // const val = Math.cos(Math.PI * 0.05);
    // const val2 = Math.sin(Math.PI * 0.05);
    // this.context2d.moveTo(200 - 100 * val2, 150 + val * 100);
    // this.context2d.lineTo(200 + 100 * val2, 150 + val * 100);
    // this.context2d.strokeStyle = "blue";
    // this.context2d.stroke();
    // this.context2d.closePath();
  }

  drawPipeLine(x, y, radius, deltaDeg) {
    const waiting = this.waiting;

    const cosDelta = Math.cos(deltaDeg);
    const sinDelta = Math.sin(deltaDeg);
    const [slx, sly] = [x - radius * sinDelta, y + radius * cosDelta];
    const [srx, sry] = [x + radius * sinDelta, y + radius * cosDelta];
    const ctx = this.context2d;
    ctx.beginPath();
    ctx.moveTo(slx, sly);
    ctx.lineTo(slx, sly + 70);
    ctx.lineTo(slx + 225, sly + 70);
    ctx.lineTo(slx + 225, sly + 100);
    ctx.lineTo(slx - 125, sly + 100);

    ctx.moveTo(srx, sry);
    ctx.lineTo(srx, sry + 40);
    ctx.lineTo(srx + 225, sry + 40);
    ctx.lineTo(srx + 225, sry + 130);
    ctx.lineTo(slx - 125, sry + 130);
    ctx.lineTo(slx - 125, sry + 100);

    if (!waiting) {
      // ctx.moveTo(slx - 75, sry + 100);
      // ctx.lineTo(slx - 75, sry + 130);

      // ctx.moveTo(slx - 25, sry + 100);
      // ctx.lineTo(slx - 25, sry + 130);

      // ctx.moveTo(slx + 25, sry + 100);
      // ctx.lineTo(slx + 25, sry + 130);

      // ctx.moveTo(slx + 75, sry + 100);
      // ctx.lineTo(slx + 75, sry + 130);
      // ctx.moveTo(slx + 125, sry + 100);
      // ctx.lineTo(slx + 125, sry + 130);

      // ctx.moveTo(slx + 175, sry + 100);
      // ctx.lineTo(slx + 175, sry + 130);

      // ctx.moveTo(slx + 225, sry + 100);
      // ctx.lineTo(slx + 225, sry + 130);

      ctx.moveTo(slx, sly);
      ctx.lineTo(srx, sry);
    }

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    this.updateAwardBallsConfig();
    this.state.awardBallsConfig.forEach((conf, index) => {
      this.drawArc({
        x: conf.x,
        y: conf.y,
        radius: 10,
        startAngle: 0,
        endAngle: Math.PI * 2,
        fillStyle: index < 6 ? "red" : "blue",
        fillText: conf.fillText,
        fillTextStyle: "white",
        rotate: conf.rotate,
      });
    });
  }

  updateAwardBallsConfig() {
    if (this.state.awardBallsConfig.length === 0) {
      return;
    }
    const last = this.state.awardBallsConfig.slice(-1)[0];
    if (last.pinned) {
      return;
    }
    const delta = 5;
    let { x, y, sx, sy } = last;
    if (y < sy + 70 - 15) {
      y = y + delta;
    } else if (x < sx + 240 - 15 && y < sy + 130 - 15) {
      x = x + delta;
    } else if (y < sy + 130 - 15) {
      y = y + delta;
    } else if (
      x >=
      sx - 125 + 15 + 50 * (this.state.awardBallsConfig.length - 1)
    ) {
      x = x - delta;
      if (x < sx - 125 + 15 + 50 * (this.state.awardBallsConfig.length - 1)) {
        last.pinned = true;
        this.waiting = false;
      }
    }

    last.x = x;
    last.y = y;
    last.rotate += Math.PI / 20;
    this.setState({ awardBallsConfig: this.state.awardBallsConfig });
  }

  private openAward = () => {
    if (this.state.openAwarding) {
      return;
    }
    this.setState({ openAwarding: true, awardBallsConfig: [] });
    this.timer = setInterval(() => {
      this.draw();
    }, 32);
  };

  render(): ReactNode {
    return (
      <div
        className="open-award"
        style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <b
            style={{
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
            }}
          >
            非常6+1
            <Button
              style={{ marginLeft: 15 }}
              onClick={this.openAward}
              type="primary"
            >
              {this.state.openAwarding ? "开奖中..." : "开奖"}
            </Button>
            {this.state.awardBallsConfig.map((conf, index) => {
              return conf.pinned ? (
                <span
                  style={{
                    display: "flex",
                    width: 20,
                    height: 20,
                    background: index < 6 ? "red" : "blue",
                    borderRadius: "50%",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    marginLeft: 15,
                  }}
                >
                  {conf.fillText}
                </span>
              ) : null;
            })}
          </b>

          <canvas
            style={{ border: "1px solid grey" }}
            width={500}
            height={440}
            ref={(ref) => (this.canvasRef = ref)}
            className="open-award-canvas"
          ></canvas>
        </div>
      </div>
    );
  }
}
