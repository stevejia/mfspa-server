const canvasEl = document.querySelector('#white-board');
const context2d = canvasEl.getContext('2d');
const {left: x1, top: y1, width, height} = canvasEl.getBoundingClientRect();
let originPosition = [];

const mouseMove = (event) => {
    const {clientX, clientY} = event;
    const [x, y] = getPosition(x1, y1, clientX, clientY)
    context2d.lineTo(x, y);
    context2d.stroke();
}

const getPosition = (x1, y1, x2, y2) => {
    return [x2 - x1, y2 - y1];
}

const mouseUp = (event) => {
    canvasEl.removeEventListener('mousemove', mouseMove, false);
    const imageData = context2d.getImageData(0, 0, width, height);
    boardHistory.unshift(imageData);
    console.log(boardHistory);
}

canvasEl.addEventListener('mousedown', (event)=> {
    const [x, y] = getPosition(x1, y1, event.clientX, event.clientY);
    context2d.beginPath();
    context2d.moveTo(x, y);
    context2d.lineWidth = 3;
    context2d.strokeStyle="red";

    canvasEl.addEventListener('mousemove', mouseMove, false);
});
canvasEl.addEventListener('mouseup', mouseUp, false);

const boardHistory = [];

const forwardBtn = document.querySelector('#forward');
const backwardBtn = document.querySelector('#backward');

backwardBtn.addEventListener('click', () => {
    if(historyIndex < boardHistory.length) {
        historyIndex ++;
    }
    const imageData = boardHistory[historyIndex];
    if(imageData) {
        context2d.putImageData(imageData, 0, 0);
    } else {
        canvasEl.height = canvasEl.height;
    }
    console.log(historyIndex);
});

forwardBtn.addEventListener('click', ()=> {
    if(historyIndex > 0) {
        historyIndex --;
    }

    const imageData = boardHistory[historyIndex];
    if(imageData) {
        context2d.putImageData(imageData, 0, 0);
    } else {
        canvasEl.height = canvasEl.height;
    }
    console.log(historyIndex);
})

let historyIndex = 0;