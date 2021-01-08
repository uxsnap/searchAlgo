const grid = document.getElementById('grid');
const width = document.documentElement.offsetWidth;
const height = document.documentElement.offsetHeight;
const tabs = document.querySelector('.tabs');
const radios = document.getElementsByName('searchType');
const gridRange = document.getElementById('gridSize');
const helperButtons = document.querySelector('.helper-buttons');

import { initialOptions, coord } from './helpers';
import { BFS, Dijkstra, Astar } from './algos';
import Grid from './Grid';
import Generate from './Generate';

// Preparations
gridRange.setAttribute('max', (width / 25).toFixed(0));

let currentAlgo = 0;
let cellNum = 21;
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

gridRange.onchange = changeGridSize;

function changeGridSize(event) {
  cellNum = +event.target.value;
  grid.style.width = cellNum * 20 + 'px';
  gridInstance.setOption('cellNum', cellNum);
  gridInstance.setOption('coord', coord.bind(null, cellNum));
  gridInstance.resetGrid();
  cellNum > 33 ? grid.classList.add('grid_small') : grid.classList.remove('grid_small');
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

maze.onclick = () => gridInstance.generateMazeOnGrid();

reset.onclick = () => gridInstance.resetGrid();

radios.forEach((radio) => {
  radio.onclick = (event) => { currentAlgo = event.target.value; gridInstance.resetGrid(); }; 
});

grid.onmouseup = function(event) {
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
  if (event.keyCode === 16 /* Shift */) {
    gridInstance.setOption('Shift', true);
    helperButtons.lastElementChild.firstElementChild.classList.add('active');
  }
  else if (event.keyCode === 17 /* Ctrl */) {
    gridInstance.setOption('Ctrl', true);
    helperButtons.firstElementChild.firstElementChild.classList.add('active');
  }
};

document.body.onkeyup = function() {
  for (let i = 0; i < helperButtons.children.length; i++) {
    helperButtons.children[i].firstElementChild.classList.remove('active');
  }
  gridInstance.setOption('Ctrl', false);
  gridInstance.setOption('Shift', false);
};
