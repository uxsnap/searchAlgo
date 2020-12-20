const grid = document.getElementById('grid');
const width = document.documentElement.offsetWidth;
const height = document.documentElement.offsetHeight;
const tabs = document.querySelector('.tabs');
const radios = document.getElementsByName('searchType');
const gridRange = document.getElementById('gridSize');

import { initialOptions } from './helpers';
import Grid from './Grid';
import Generate from './Generate';

// Preparations
gridRange.setAttribute('max', (width / 25).toFixed(0));
const coord = (max, obj) => obj.x * max + obj.y;

// Global options object 
let options = {
  cellNum: 20,
  ...initialOptions(),
  currentTab: 0,
};
const bindedCoord = coord.bind(null, options.cellNum);
options.coord = bindedCoord;

grid.style.width = options.cellNum * 20 + 'px';

/* ## Generating grid */ 
const gridInstance = new Grid(
  grid,
  options
);

gridInstance.generateGrid();
/* ## Generating grid */

function drawWay(history, end) {
  if (end === 'S') return;
  return setTimeout(() => {
    const val = history.get(end);
    end = val;
    setTimeout(() => drawWay(history, val));
    cells[val] && cells[val].elem.classList.add('way');
  }, 10);
}

function showAlgo(values, ind, cb) {
  if (ind === values.length) {
    cb();
    return;
  }
  setTimeout(() => {
    const cellInd = values[ind];
    cellInd && cells[cellInd] && cells[cellInd].elem.classList.add('checked');
    setTimeout(() => showAlgo(values, ind + 1, cb), 10);
  }, 10);
}

gridRange.onchange = changeGridSize;

function changeGridSize(event) {
  options.cellNum = event.target.value;
  grid.style.width = options.cellNum * 20 + 'px';
  resetGrid();
}

function getCurrentSearchFunction(currentTab) {
  switch (currentTab) {
    case 0:
      return BFS;
    case 1:
      return Dijkstra;
    case 2:
      return Astar;
  }
}


start.onclick = async () => gridInstance.startAlgo();

reset.onclick = () => {
  gridInstance.resetGrid();
}

radios.forEach((radio) => {
  radio.onclick = (event) => gridInstance.setOption('currentTab', event.target.value); 
});

document.body.onmouseup = function(event) {
  gridInstance.setOption('dragged', false);
}

document.body.onclick = function(event) {
  gridInstance.setOption('dragged', true);
  gridInstance.updateGrid(event);
  gridInstance.setOption('dragged', false);
}

document.body.onmousedown = function(event) {
  gridInstance.setOption('dragged', true);
}

document.body.onmousemove = function(event) {
  gridInstance.getOption('dragged') &&
    gridInstance.updateGrid(event);
};

document.body.onkeydown = function(event) {
  if (event.keyCode === 16 /* Shift */)
    gridInstance.setOption('Shift', true);
  else if (event.keyCode === 17 /* Ctrl */)
    gridInstance.setOption('Ctrl', true);
};

document.body.onkeyup = function() {
  gridInstance.setOption('Ctrl', false);
  gridInstance.setOption('Shift', false);
};
