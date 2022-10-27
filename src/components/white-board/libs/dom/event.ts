import "./dom";

let left: number, top: number, width: number, height: number;

export const setCanvasPosition = (canvasEl: HTMLCanvasElement) => {
  const {
    left: x1,
    top: y1,
    width: w1,
    height: h1,
  } = canvasEl.getBoundingClientRect();
  left = x1;
  top = y1;
  width = w1;
  height = h1;
};

export const getPosition = (event: MouseEvent) => {
    const {clientX, clientY} = event;
    console.log(left, top,  clientX - left, clientY - top);
    return {x: clientX - left, y: clientY - top};
};
