const grid = document.getElementById('grid');
const width = window.offsetWidth;
const height = document.documentElement.offsetHeight;
const tabs = document.querySelector('.tabs');


const cellNum = 20;

const cells = [];

let Shift = false;
let Ctrl = false;
let started = false;
let found = false;
let dragged = false;

let endCoord = null;
let startCoord = null;
let currentTab = 0;


grid.style.width = cellNum**2 > width ? width : cellNum**2 + 'px';

const coord = (obj) => obj.x * cellNum + obj.y;

function draw() {
  for (let i = 0; i < cellNum; i++) {
    for (let j = 0; j < cellNum; j++) {
      const div = document.createElement('div');
      const curCoord = coord({ x: i, y: j });
      div.setAttribute('coord', curCoord);
      div.classList.add('cell');
      cells[curCoord] = {
        x: i,
        y: j,
        g: 0, //Total cost of getting to this node 
        h: 0,// Heuristic func
        f: 0, // g + h
        parent: null,
        cStart: false,
        cChecked: false,
        cEnd: false,
        cObstacle: false,
        elem: div,
      };
      grid.appendChild(div);
    }
  }
}

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


start.onclick = async function() {
  if (started) return;
  started = true;
  grid.className = 'no-click';
  if (endCoord && startCoord) {
    const searchFunction = getCurrentSearchFunction(+currentTab);
    const history = searchFunction(cells, startCoord, endCoord, cellNum);
    const historyValues = [...history.keys()];
    let endComputed = coord(endCoord);
    showAlgo(historyValues, 0, function() {
      drawWay(history, endComputed);
    });
  }
}

reset.onclick = function() {
  cells.length = 0;
  grid.innerHTML = '';

  Shift = false;
  Ctrl = false;
  started = false;
  found = false;

  endCoord = null;
  startCoord = null;

  grid.className = undefined;
  
  draw();
  return false;
}

function drawBlocks(event) {
   if (!dragged) return;
  const elem = event.target; 
  if (elem.classList.contains('cell')) {
    const currentElement = cells[elem.getAttribute('coord')];
    if (Shift) {
      if (endCoord) {
        cells[coord(endCoord)].cEnd = false;
        cells[coord(endCoord)].elem.classList.remove('end');
      }
      currentElement.cEnd = true; 
      currentElement.cObstacle = false; 
      currentElement.cStart = false;
      currentElement.elem.classList.add('end');
      endCoord = { x: currentElement.x, y: currentElement.y };

    } else if (Ctrl) {
      // if (currentElement.cObstacle) {
      //   currentElement.cObstacle = false;
      //   currentElement.elem.classList.remove('block');
      //   return;  
      // }
      currentElement.cEnd = false; 
      currentElement.cObstacle = true; 
      currentElement.cStart = false;
      currentElement.elem.classList.add('block');
    } else {
      if (startCoord) {
        cells[coord(startCoord)].cStart = false;
        cells[coord(startCoord)].elem.classList.remove('start');
      }
      currentElement.cEnd = false; 
      currentElement.cObstacle = false; 
      currentElement.cStart = true;
      startCoord = { x: currentElement.x, y: currentElement.y, g: 0, h: 0, f: 0 };
    }
    elem.classList.add(Shift ? 'end' : Ctrl ? 'block' : 'start');
  } else if (elem.classList.contains('tab')) {
      const { index } = elem.dataset;
      tabs.children[currentTab].classList.remove('tab_active');
      tabs.children[index].classList.add('tab_active');
      currentTab = index;
  }
}

document.body.onmouseup = function(event) {
  dragged = false;
}

document.body.onclick = function(event) {
  dragged = true;
  drawBlocks(event);
  dragged = false;
}

document.body.onmousedown = function(event) {
  dragged = true;
}

document.body.onmousemove = function(event) {
  if (dragged) drawBlocks(event);
};

document.body.onkeydown = function(event) {
  if (event.keyCode === 16 /* Shift */)
    Shift = true;
  else if (event.keyCode === 17 /* Ctrl */)
    Ctrl = true;
};

document.body.onkeyup = function() {
  Shift = false;
  Ctrl = false;
};

function BFS(nodes, startNode, endNode, max) {
  const queue = [startNode];
  const visited = new Map();
  visited.set(coord(startNode), 'S');
  while (queue.length) {
    let node = queue.shift();
    if (node.x === endNode.x && node.y === endNode.y) {
      return visited;
    }
    const prevCoord = coord(node);
    const neighbours = createNeighbours(node, max);
    neighbours.forEach((item) => {
      if (isWall(coord(item))) return;
      const curCoord = coord(item);
      if (!visited.get(curCoord)) {
        queue.push(item);
        visited.set(curCoord, prevCoord);
      }
    });
  }
  return false;
}

draw();

const createNeighbours = (node, max) => {
  const neighbours = [];
  for (const dir of [
    [0, 1],
    [0, -1],
    [-1, 0],
    [1, 0],
  ]) {
    const neighbour = { x: node.x + dir[0], y: node.y + dir[1] };
    if (neighbour.x < max && neighbour.y < max && neighbour.y > -1 && neighbour.x > -1) {
      neighbours.push(neighbour);
    }
  }
  return neighbours;
};

const isWall = (index) => {
  return cells[index] && cells[index].cObstacle;
};

const pointDist = (p1, p2) => {
  return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
};

const Dijkstra = function (nodes, startNode, endNode, max) {
  const history = new Map();
  const d = [];
  const v = [];
  for (let i = 0; i < nodes.length; i++) d[i] = Infinity;
  const start = coord(startCoord); 
  d[start] = 0;
  history.set(start, 'S');
  while (true) {
    let sd = Infinity;
    let si =  -1;
    for (let i = 0; i < nodes.length; i++) {
      if (d[i] < sd && !v[i]) {
        sd = d[i];
        si = i;
      }
    }

    v[si] = true;
    const node = nodes[si]; 
    if (si === -1 || (node.x === endNode.x && node.y === endNode.y)) {
      return history;
    }
    const prevCoord = coord(node);
    const neighbours = createNeighbours(node, max);
    neighbours.forEach((item) => {
      if (isWall(coord(item))) return;
      const curCoord = coord(item);
      if (d[curCoord] > d[si]) {
        d[curCoord] = d[si] + 1;
      }
      if (!history.get(curCoord)) {
        history.set(curCoord, prevCoord);
      }
    });
  }
};

function Astar(nodes, startNode, endNode, max) {
  const history = new Map();
  const queue = [startNode];
  const closed = [];
  const start = coord(startCoord); 
  history.set(start, 'S');
  while (queue.length) {
    let si =  0;
    for (let i = 1; i < queue.length; i++) {
      if (queue[i].h < queue[si].h) {
        si = i;
      }
    }
    const node = queue[si]; 
    if (node.x === endNode.x && node.y === endNode.y) {
      return history;
    }
    queue.splice(si, 1);
    closed.push(node);
    const prevCoord = coord(node);
    const neighbours = createNeighbours(node, max);
    neighbours.forEach((item) => {
      if (closed.find((c) => coord(c) === coord(item)) || isWall(coord(item))) {
        return;
      }
      let gScore = node.g + 1;
      let gBest = false;
      if (!queue.find((q) => coord(q) === coord(item))) {
        gBest = true;
        item.h  = pointDist(node, endNode);
        queue.push(item);
      } else if (gScore < item.g) {
        gBest = true;
      }

      if (gBest) {
        history.set(coord(item), prevCoord);
        item.g  = gScore;
        item.f = item.g + item.h;
      }
    });
  }
}