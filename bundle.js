const initialOptions = () => ({
  Shift: false,
  Ctrl: false,
  started: false,
  found: false,
  dragged: false,
  endCoord: null,
  startCoord: null
});

class Draw {
  constructor(cells) {
    this.cells = cells;
  }

  initialDraw(grid) {
    this.setCells(this.cells.map((cell, i) => {
      const div = document.createElement('div');
      div.setAttribute('coord', i);
      div.classList.add('cell');
      grid.appendChild(div);
      return { ...cell,
        elem: div
      };
    }));
  }

  setCells(cells) {
    this.cells = cells;
  }

  getCells() {
    return { ...this.cells
    };
  }

  drawWay(grid, history, end) {
    if (end === 'S') return;
    return setTimeout(() => {
      const val = history.get(end);
      end = val;
      setTimeout(() => drawWay(history, val));
      grid.children[val] && grid.children[val].classList.add('way');
    }, 10);
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

  drawBlocksOnGrid(event) {
    const cells = this.getCells();
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
      endCoord = {
        x: currentElement.x,
        y: currentElement.y
      };
    } else if (Ctrl) {
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
      startCoord = {
        x: currentElement.x,
        y: currentElement.y,
        g: 0,
        h: 0,
        f: 0
      };
    }

    elem.classList.add(Shift ? 'end' : Ctrl ? 'block' : 'start');
    this.setCells(cells);
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
        // const div = document.createElement('div');
        const curCoord = this.coordFunc({
          x: i,
          y: j
        }); // div.setAttribute('coord', curCoord);
        // div.classList.add('cell');

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
          cObstacle: false // elem: div,

        }; // cells.push(div);
        // this.grid.appendChild(div);
      }
    }

    return cells;
  }

}

class Grid {
  constructor(grid, options) {
    this.grid = grid;
    this.options = options;
    this.generateInstance = new Generate(options.cellNum, options.coord);
    this.drawInstance = new Draw(this.generateInstance.generate());
  }

  generateGrid() {
    this.drawInstance.initialDraw(this.grid);
  }

  resetGrid() {
    this.grid.innerHTML = '';
    this.grid.className = undefined;
    this.drawInstance.setCells(this.generateInstance.generate());
    this.options = { ...this.options,
      ...initialOptions()
    };
    this.generateGrid();
  }

  setOption(optionName, optionValue) {
    this.options[optionName] = optionValue;
  }

  updateGrid(event) {
    if (!this.options.dragged) return;
    const elem = event.target;
    const elemIndex = +elem.getAttribute('coord');

    if (this.options.Shift) {
      this.setOption('endCoord', this.drawInstance.drawEnd(elemIndex, this.options.endCoord && this.options.coord(this.options.endCoord)));
    } else if (this.options.Ctrl) {
      this.drawInstance.drawWall(elemIndex);
    } else {
      this.setOption('startCoord', this.drawInstance.drawStart(elemIndex, this.options.startCoord && this.options.coord(this.options.startCoord)));
    }
  }

  startAlgo() {
    if (this.getOption('started')) return;
    this.setOption('started', true);
    this.grid.className = 'no-click';
    const {
      endCoord,
      startCoord
    } = this.options;

    if (endCoord && startCoord) {
      const searchFunction = getCurrentSearchFunction(+currentTab);
      const history = searchFunction(cells, startCoord, endCoord, options.cellNum);
      const historyValues = [...history.keys()];
      let endComputed = coord(endCoord, options.cellNum);
      showAlgo(historyValues, 0, function () {
        drawWay(history, endComputed);
      });
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

const coord$1 = (max, obj) => obj.x * max + obj.y; // Global options object 


let options$1 = {
  cellNum: 20,
  ...initialOptions(),
  currentTab: 0
};
const bindedCoord = coord$1.bind(null, options$1.cellNum);
options$1.coord = bindedCoord;
grid.style.width = options$1.cellNum * 20 + 'px';
/* ## Generating grid */

const gridInstance = new Grid(grid, options$1);
gridInstance.generateGrid();

gridRange.onchange = changeGridSize;

function changeGridSize(event) {
  options$1.cellNum = event.target.value;
  grid.style.width = options$1.cellNum * 20 + 'px';
  resetGrid();
}

start.onclick = async () => gridInstance.startAlgo();

reset.onclick = () => {
  gridInstance.resetGrid();
};

radios.forEach(radio => {
  radio.onclick = event => gridInstance.setOption('currentTab', event.target.value);
});

document.body.onmouseup = function (event) {
  gridInstance.setOption('dragged', false);
};

document.body.onclick = function (event) {
  gridInstance.setOption('dragged', true);
  gridInstance.updateGrid(event);
  gridInstance.setOption('dragged', false);
};

document.body.onmousedown = function (event) {
  gridInstance.setOption('dragged', true);
};

document.body.onmousemove = function (event) {
  gridInstance.getOption('dragged') && gridInstance.updateGrid(event);
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
