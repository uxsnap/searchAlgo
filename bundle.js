const initialOptions = () => ({
  Shift: false,
  Ctrl: false,
  started: false,
  found: false,
  dragged: false,
  endCoord: null,
  startCoord: null
});
const coord = (max, obj) => obj.x * max + obj.y;
const createNeighbours = (node, max) => {
  const neighbours = [];

  for (const dir of [[-1, 0, 'w'], [1, 0, 'e'], [0, -1, 's'], [0, 1, 'n']]) {
    const neighbour = {
      x: node.x + dir[0],
      y: node.y + dir[1],
      dir: dir[2]
    };

    if (neighbour.x < max && neighbour.y < max && neighbour.y > -1 && neighbour.x > -1) {
      neighbours.push(neighbour);
    }
  }

  return neighbours;
};
const pointDist = (p1, p2) => {
  const d1 = Math.abs(p1.x - p2.x);
  const d2 = Math.abs(p1.y - p2.y);
  return d1 + d2;
};
const isWall = (cells, index) => {
  return cells[index] && cells[index].cObstacle;
};
const getRandomElementIndexFromList = list => {
  return Math.floor(Math.random() * list.length);
};

const BFS = (nodes, startNode, endNode, max) => {
  const queue = [startNode];
  const visited = new Map();
  visited.set(coord(max, startNode), 'S');

  while (queue.length) {
    let node = queue.shift();

    if (node.x === endNode.x && node.y === endNode.y) {
      return visited;
    }

    const prevCoord = coord(max, node);
    const neighbours = createNeighbours(node, max);
    neighbours.forEach(item => {
      if (isWall(nodes, coord(max, item))) return;
      const curCoord = coord(max, item);

      if (!visited.get(curCoord)) {
        queue.push(item);
        visited.set(curCoord, prevCoord);
      }
    });
  }

  return false;
};
const Dijkstra = (nodes, startNode, endNode, max) => {
  const history = new Map();
  const d = [];
  const v = [];

  for (let i = 0; i < nodes.length; i++) d[i] = Infinity;

  const start = coord(max, startNode);
  d[start] = 0;
  history.set(start, 'S');

  while (true) {
    let sd = Infinity;
    let si = -1;

    for (let i = 0; i < nodes.length; i++) {
      if (d[i] < sd && !v[i]) {
        sd = d[i];
        si = i;
      }
    }

    v[si] = true;
    const node = nodes[si];

    if (si === -1 || node.x === endNode.x && node.y === endNode.y) {
      return history;
    }

    const prevCoord = coord(max, node);
    const neighbours = createNeighbours(node, max);
    neighbours.forEach(item => {
      if (isWall(nodes, coord(max, item))) return;
      const curCoord = coord(max, item);

      if (d[curCoord] > d[si]) {
        d[curCoord] = d[si] + 1;
      }

      if (!history.get(curCoord)) {
        history.set(curCoord, prevCoord);
      }
    });
  }
};
const Astar = (nodes, startNode, endNode, max) => {
  const history = new Map();
  const queue = [startNode];
  const closed = [];
  const start = coord(max, startNode);
  history.set(start, 'S');

  while (queue.length) {
    let si = 0;

    for (let i = 1; i < queue.length; i++) {
      if (queue[i].f < queue[si].f) {
        si = i;
      }
    }

    const node = queue[si];

    if (node.x === endNode.x && node.y === endNode.y) {
      return history;
    }

    queue.splice(si, 1);
    closed.push(node);
    const prevCoord = coord(max, node);
    const neighbours = createNeighbours(node, max);
    let gScore = node.g + 1;
    let gBest = false;
    neighbours.forEach(item => {
      if (closed.find(c => coord(max, c) === coord(max, item)) || isWall(nodes, coord(max, item))) {
        return;
      }

      if (!queue.find(q => coord(max, q) === coord(max, item))) {
        gBest = true;
        item.h = pointDist(item, endNode);
        queue.push(item);
      } else if (gScore < item.g) {
        gBest = true;
      }

      if (gBest) {
        history.set(coord(max, item), prevCoord);
        item.g = gScore;
        item.f = item.g + item.h;
      }
    });
  }
};
const mazeGenerator = (nodes, max) => {
  const maze = nodes.map(node => ({
    x: node.x,
    y: node.y,
    cObstacle: true,
    isInMaze: false
  }));
  const wallCheck = {
    'n': [0, 1, 0, -1],
    's': [0, -1, 0, 1],
    'e': [1, 0, -1, 0],
    'w': [-1, 0, 1, 0]
  };

  const cellsThatWallDivides = wall => {
    const offset = wallCheck[wall.dir];
    return [maze[coord(max, {
      x: wall.x + offset[0],
      y: wall.y + offset[1]
    })], maze[coord(max, {
      x: wall.x + offset[2],
      y: wall.y + offset[3]
    })]].filter(cell => cell && !cell.isInMaze);
  };

  const wallInd = Math.floor(Math.random() * maze.length);
  maze[wallInd].cObstacle = false;
  maze[wallInd].isInMaze = true;
  const startingCell = maze[wallInd];
  const walls = [];
  if (startingCell.x - 1 > -1) walls.push({ ...maze[coord(max, { ...startingCell,
      x: startingCell.x - 1
    })],
    dir: 'w'
  });
  if (startingCell.y - 1 > -1) walls.push({ ...maze[coord(max, { ...startingCell,
      y: startingCell.y - 1
    })],
    dir: 's'
  });
  if (startingCell.x + 1 < max) walls.push({ ...maze[coord(max, { ...startingCell,
      x: startingCell.x + 1
    })],
    dir: 'e'
  });
  if (startingCell.y + 1 < max) walls.push({ ...maze[coord(max, { ...startingCell,
      y: startingCell.y + 1
    })],
    dir: 'n'
  });

  while (walls.length) {
    const wallIndex = getRandomElementIndexFromList(walls);
    const wall = walls[wallIndex];
    const cells = cellsThatWallDivides(wall);

    if (cells.length) {
      const cell = cells[0];
      const mazeWallInd = coord(max, wall);
      const cellWallInd = coord(max, cell);
      maze[mazeWallInd].cObstacle = false;
      maze[cellWallInd].cObstacle = false;
      maze[mazeWallInd].isInMaze = true;
      maze[cellWallInd].isInMaze = true;
      if (cell.x - 1 > -1) walls.push({ ...maze[coord(max, { ...cell,
          x: cell.x - 1
        })],
        dir: 'w'
      });
      if (cell.y - 1 > -1) walls.push({ ...maze[coord(max, { ...cell,
          y: cell.y - 1
        })],
        dir: 's'
      });
      if (cell.x + 1 < max) walls.push({ ...maze[coord(max, { ...cell,
          x: cell.x + 1
        })],
        dir: 'e'
      });
      if (cell.y + 1 < max) walls.push({ ...maze[coord(max, { ...cell,
          y: cell.y + 1
        })],
        dir: 'n'
      });
    }

    walls.splice(wallIndex, 1);
  }

  return maze.map(item => ({ ...item,
    isInMaze: undefined
  }));
};

class Draw {
  constructor(cells) {
    this.cells = cells;
    this.interval = null;
  }

  addToGrid(grid, cell, index) {
    const div = document.createElement('div');
    div.setAttribute('coord', index);
    div.classList.add('cell');
    const finalDiv = !grid.children[index] ? grid.appendChild(div) : grid.children[index];
    return { ...cell,
      elem: finalDiv
    };
  }

  initialDraw(grid, cells = []) {
    const requiredCells = cells.length ? cells : this.cells;
    this.setCells(requiredCells.map((cell, index) => this.addToGrid(grid, cell, index)));
  }

  drawMaze(grid, cells) {
    this.initialDraw(grid, cells);

    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].cObstacle) {
        this.drawWall(i);
      }
    }
  }

  clearChecked() {
    this.cells.forEach(cell => {
      cell.elem.classList.remove('checked', 'way', 'checked-anim', 'way-anim');
    });
  }

  destroy() {
    clearTimeout(this.interval);
    this.cells = null;
  }

  setCells(cells) {
    this.cells = cells;
  }

  getCells() {
    return this.cells;
  }

  showAlgo(values, ind, cb) {
    if (ind === values.length) {
      cb();
      return;
    }

    this.interval = setTimeout(() => {
      const cellInd = values[ind];
      cellInd && this.cells[cellInd] && this.cells[cellInd].elem.classList.add('checked-anim');
      this.interval = setTimeout(() => this.showAlgo(values, ind + 1, cb));
    });
  }

  showAlgoNow(values) {
    for (let i = 0; i < values.length; i++) {
      const cellInd = values[i];
      this.cells[cellInd].elem.classList.add('checked');
    }
  }

  drawWayNow(history, end) {
    let val = history.get(end);

    while (true) {
      if (end === 'S') break;
      end = val;
      this.cells[val] && this.cells[val].elem.classList.add('way');
      val = history.get(end);
    }
  }

  drawWay(grid, history, end, cb) {
    if (end === 'S') return cb(true);
    this.interval = setTimeout(() => {
      const val = history.get(end);
      end = val;
      this.interval = setTimeout(() => this.drawWay(grid, history, val, cb));
      grid.children[val] && grid.children[val].classList.add('way-anim');
    });
  }

  drawEnd(index, end) {
    const currentElement = this.cells[index];

    if (end) {
      this.cells[end].cEnd = false;
      this.cells[end].elem.classList.remove('end');
    }

    currentElement.cEnd = true;
    currentElement.cObstacle = false;
    currentElement.cStart = false;
    currentElement.elem.classList.add('end');
    return {
      x: currentElement.x,
      y: currentElement.y
    };
  }

  drawWall(index) {
    const currentElement = this.cells[index];
    currentElement.cEnd = false;
    currentElement.cObstacle = true;
    currentElement.cStart = false;
    currentElement.elem.classList.add('block');
  }

  drawStart(index, start) {
    const currentElement = this.cells[index];

    if (start) {
      this.cells[start].cStart = false;
      this.cells[start].elem.classList.remove('start');
    }

    if (currentElement.cObstacle) return;
    currentElement.cEnd = false;
    currentElement.cObstacle = false;
    currentElement.cStart = true;
    currentElement.elem.classList.add('start');
    return {
      x: currentElement.x,
      y: currentElement.y,
      g: 0,
      h: 0,
      f: 0
    };
  }

}

class Generate {
  constructor(max, coordFunc) {
    // this.grid = grid;
    this.max = max;
    this.coordFunc = coordFunc;
  }

  generate() {
    const cells = [];

    for (let i = 0; i < this.max; i++) {
      for (let j = 0; j < this.max; j++) {
        const curCoord = this.coordFunc({
          x: i,
          y: j
        });
        cells[curCoord] = {
          x: i,
          y: j,
          g: 0,
          //Total cost of getting to this node 
          h: 0,
          // Heuristic func
          f: 0,
          // g + h
          cStart: false,
          cChecked: false,
          cEnd: false,
          cObstacle: false,
          cChecked: false // For maze

        };
      }
    }

    return cells;
  }

  generateMaze(cells) {
    return mazeGenerator(cells, this.max);
  }

}

class Grid {
  constructor(grid, options) {
    this.grid = grid;
    this.options = options;
    this.generateInstance = null;
    this.drawInstance = null;
    this.generate();
  }

  generate() {
    this.generateInstance = new Generate(this.options.cellNum, this.options.coord);
    this.drawInstance = new Draw(this.generateInstance.generate());
    this.drawInstance.initialDraw(this.grid);
  }

  resetGrid() {
    this.grid.innerHTML = '';
    this.grid.className = undefined;
    this.drawInstance.destroy();
    this.options = { ...this.options,
      ...initialOptions()
    };
    this.generate();
  }

  getOption(optionName) {
    return this.options[optionName];
  }

  setOption(optionName, optionValue) {
    this.options[optionName] = optionValue;
  }

  updateGrid(elem) {
    const {
      found,
      dragged
    } = this.options;
    if (!dragged) return;
    if (found && elem.classList.contains('block')) return;
    const elemIndex = +elem.getAttribute('coord');

    if (this.options.Shift) {
      this.setOption('endCoord', this.drawInstance.drawEnd(elemIndex, this.options.endCoord && this.options.coord(this.options.endCoord)));
      found && this.redrawAlgo();
    } else if (this.options.Ctrl) {
      this.drawInstance.drawWall(elemIndex);
    } else {
      this.setOption('startCoord', this.drawInstance.drawStart(elemIndex, this.options.startCoord && this.options.coord(this.options.startCoord)));
      found && this.redrawAlgo();
    }
  }

  startAlgo() {
    if (this.getOption('started')) return;
    const {
      searchFunction,
      endCoord,
      startCoord,
      cellNum,
      coord
    } = this.options;

    if (endCoord && startCoord) {
      this.setOption('started', true);
      this.grid.className = 'no-click';
      const history = searchFunction(this.drawInstance.getCells(), startCoord, endCoord, cellNum);
      const historyValues = [...history.keys()];
      let endComputed = coord(endCoord);
      this.drawInstance.showAlgo(historyValues, 0, async () => {
        this.drawInstance.drawWay(this.grid, history, endComputed, found => {
          this.setOption('found', found);
          found && this.grid.classList.remove('no-click');
        });
      });
    }
  }

  generateMazeOnGrid() {
    const cells = this.generateInstance.generateMaze(this.drawInstance.getCells());
    this.resetGrid();
    this.drawInstance.drawMaze(this.grid, cells);
  }

  redrawAlgo() {
    const {
      searchFunction,
      endCoord,
      startCoord,
      cellNum,
      coord,
      found
    } = this.options;

    if (endCoord && startCoord && found) {
      const history = searchFunction(this.drawInstance.getCells(), startCoord, endCoord, cellNum);
      const historyValues = [...history.keys()];
      let endComputed = coord(endCoord);
      this.drawInstance.clearChecked();
      this.drawInstance.showAlgoNow(historyValues);
      this.drawInstance.drawWayNow(history, endComputed);
    }
  }

}

const grid = document.getElementById('grid');
const width = document.documentElement.offsetWidth;
const height = document.documentElement.offsetHeight;
const tabs = document.querySelector('.tabs');
const radios = document.getElementsByName('searchType');
const gridRange = document.getElementById('gridSize');

gridRange.setAttribute('max', (width / 25).toFixed(0));
let currentAlgo = 0;
let cellNum = 20; // Global options object 

let options = { ...initialOptions()
};
const bindedCoord = coord.bind(null, cellNum);
grid.style.width = cellNum * 20 + 'px';
/* ## Generating grid */

const gridInstance = new Grid(grid, { ...options,
  coord: bindedCoord,
  cellNum
});
/* ## Generating grid */

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
};

maze.onclick = () => gridInstance.generateMazeOnGrid();

reset.onclick = () => gridInstance.resetGrid();

radios.forEach(radio => {
  radio.onclick = event => {
    currentAlgo = event.target.value;
    gridInstance.resetGrid();
  };
});

grid.onmouseup = function (event) {
  gridInstance.updateGrid(event.target);
  gridInstance.setOption('dragged', false);
};

grid.onmousedown = function (event) {
  gridInstance.setOption('dragged', true);
};

grid.onmousemove = function (event) {
  gridInstance.getOption('dragged') && gridInstance.updateGrid(event.target);
};

document.body.onkeydown = function (event) {
  if (event.keyCode === 16
  /* Shift */
  ) gridInstance.setOption('Shift', true);else if (event.keyCode === 17
  /* Ctrl */
  ) gridInstance.setOption('Ctrl', true);
};

document.body.onkeyup = function () {
  gridInstance.setOption('Ctrl', false);
  gridInstance.setOption('Shift', false);
};
