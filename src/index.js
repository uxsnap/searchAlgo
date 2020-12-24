const grid = document.getElementById('grid');
const width = document.documentElement.offsetWidth;
const height = document.documentElement.offsetHeight;
const tabs = document.querySelector('.tabs');
const radios = document.getElementsByName('searchType');
const gridRange = document.getElementById('gridSize');

import { initialOptions, coord } from './helpers';
import { BFS, Dijkstra, Astar } from './algos';
import Grid from './Grid';
import Generate from './Generate';

// Preparations
gridRange.setAttribute('max', (width / 25).toFixed(0));

let currentAlgo = 0;
let cellNum = 20;
// Global options object 
let options = { ...initialOptions() };
const bindedCoord = coord.bind(null, cellNum);

grid.style.width = cellNum * 20 + 'px';

/* ## Generating grid */ 
const gridInstance = new Grid(
  grid,
  { ...options, coord: bindedCoord, cellNum } 
);

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

gridRange.onchange = changeGridSize;

function changeGridSize(event) {
  cellNum = +event.target.value;
  grid.style.width = cellNum * 20 + 'px';
  gridInstance.setOption('cellNum', cellNum);
  gridInstance.setOption('coord', coord.bind(null, cellNum));
  gridInstance.resetGrid();
}

function getCurrentSearchFunction(currentAlgo) {
  switch (currentAlgo) {
    case 0:
      return BFS;
    case 1:
      return Dijkstra;
    case 2:
      return Astar;
  }
}

start.onclick = () => {
  gridInstance.setOption('searchFunction', getCurrentSearchFunction(+currentAlgo));
  gridInstance.startAlgo();
}

reset.onclick = () => gridInstance.resetGrid();

radios.forEach((radio) => {
  radio.onclick = (event) => { currentAlgo = event.target.value; gridInstance.resetGrid(); }; 
});

grid.onmouseup = function(event) {
  gridInstance.updateGrid(event.target);
  gridInstance.setOption('dragged', false);
}


grid.onclick = function(event) {
  if (!gridInstance.getOption('dragged')) {
    return;
  }
  gridInstance.setOption('dragged', true);
  gridInstance.updateGrid(event.target);
  gridInstance.setOption('dragged', false);
}

grid.onmousedown = function(event) {
  gridInstance.setOption('dragged', true);
}

grid.onmousemove = function(event) {
  gridInstance.getOption('dragged') &&
    gridInstance.updateGrid(event.target);
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
