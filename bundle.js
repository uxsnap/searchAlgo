(function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var initialOptions = function initialOptions() {
    return {
      Shift: false,
      Ctrl: false,
      started: false,
      found: false,
      dragged: false,
      endCoord: null,
      startCoord: null
    };
  };
  var coord = function coord(max, obj) {
    return obj.x * max + obj.y;
  };
  var createNeighbours = function createNeighbours(node, max) {
    var neighbours = [];

    for (var _i = 0, _arr = [[-1, 0, 'w'], [1, 0, 'e'], [0, -1, 's'], [0, 1, 'n']]; _i < _arr.length; _i++) {
      var dir = _arr[_i];
      var neighbour = {
        x: node.x + dir[0],
        y: node.y + dir[1],
        dir: dir[2]
      };

      if (neighbour.x < max && neighbour.y < max && neighbour.y > -1 && neighbour.x > -1) {
        var x = neighbour.x,
            y = neighbour.y;
        neighbours.push(_objectSpread2(_objectSpread2({}, neighbour), {}, {
          coordIndex: coord(max, {
            x: x,
            y: y
          })
        }));
      }
    }

    return neighbours;
  };
  var pointDist = function pointDist(p1, p2) {
    var d1 = Math.abs(p1.x - p2.x);
    var d2 = Math.abs(p1.y - p2.y);
    return d1 + d2;
  };
  var isWall = function isWall(cells, index) {
    return cells[index] && cells[index].cObstacle;
  };
  var getRandomElementIndexFromList = function getRandomElementIndexFromList(list) {
    return Math.floor(Math.random() * list.length);
  };

  var BFS = function BFS(nodes, startNode, endNode) {
    var queue = [startNode];
    var visited = new Map();
    visited.set(startNode.coordIndex, 'S');

    var _loop = function _loop() {
      var node = queue.shift();

      if (node.coordIndex === endNode.coordIndex) {
        return {
          v: visited
        };
      }

      var prevCoord = node.coordIndex;
      var neighbours = node.neighbours;
      neighbours.forEach(function (item) {
        var curCoord = item.coordIndex;
        if (isWall(nodes, curCoord)) return;

        if (!visited.get(curCoord)) {
          queue.push(nodes[curCoord]);
          visited.set(curCoord, prevCoord);
        }
      });
    };

    while (queue.length) {
      var _ret = _loop();

      if (_typeof(_ret) === "object") return _ret.v;
    }

    return false;
  };
  var Dijkstra = function Dijkstra(nodes, startNode, endNode) {
    var history = new Map();
    var d = [];
    var v = [];

    for (var i = 0; i < nodes.length; i++) {
      d[i] = Infinity;
    }

    var start = startNode.coordIndex;
    d[start] = 0;
    history.set(start, 'S');

    var _loop2 = function _loop2() {
      var sd = Infinity;
      var si = -1;

      for (var _i = 0; _i < nodes.length; _i++) {
        if (d[_i] < sd && !v[_i]) {
          sd = d[_i];
          si = _i;
        }
      }

      v[si] = true;
      var node = nodes[si];

      if (si === -1 || node.coordIndex === endNode.coordIndex) {
        return {
          v: history
        };
      }

      var prevCoord = node.coordIndex;
      var neighbours = node.neighbours;
      neighbours.forEach(function (item) {
        var curCoord = item.coordIndex;
        if (isWall(nodes, curCoord)) return;

        if (d[curCoord] > d[si]) {
          d[curCoord] = d[si] + 1;
        }

        if (!history.get(curCoord)) {
          history.set(curCoord, prevCoord);
        }
      });
    };

    while (true) {
      var _ret2 = _loop2();

      if (_typeof(_ret2) === "object") return _ret2.v;
    }
  };
  var Astar = function Astar(nodes, startNode, endNode) {
    var history = new Map();
    var queue = [startNode];
    var closed = [];
    var start = startNode.coordIndex;
    history.set(start, 'S');

    var _loop3 = function _loop3() {
      var si = 0;

      for (var i = 1; i < queue.length; i++) {
        if (queue[i].f < queue[si].f) {
          si = i;
        }
      }

      var node = queue[si];

      if (node.coordIndex === endNode.coordIndex) {
        return {
          v: history
        };
      }

      queue.splice(si, 1);
      closed.push(node);
      var prevCoord = node.coordIndex;
      var neighbours = node.neighbours;
      var gScore = node.g + 1;
      var gBest = false;
      neighbours.forEach(function (neighbourItem) {
        var item = nodes[neighbourItem.coordIndex];
        var curCoord = item.coordIndex;
        if (closed.find(function (c) {
          return c.coordIndex === curCoord;
        }) || isWall(nodes, curCoord)) return;

        if (!queue.find(function (q) {
          return q.coordIndex === curCoord;
        })) {
          gBest = true;
          item.h = pointDist(item, endNode);
          queue.push(nodes[curCoord]);
        } else if (gScore < item.g) {
          gBest = true;
        }

        if (gBest) {
          history.set(curCoord, prevCoord);
          item.g = gScore;
          item.f = item.g + item.h;
        }
      });
    };

    while (queue.length) {
      var _ret3 = _loop3();

      if (_typeof(_ret3) === "object") return _ret3.v;
    }
  };
  var mazeGenerator = function mazeGenerator(nodes, max) {
    var maze = nodes.map(function (node) {
      return _objectSpread2(_objectSpread2({}, node), {}, {
        cObstacle: true,
        isInMaze: false
      });
    });
    var wallCheck = {
      'n': [0, 1, 0, -1],
      's': [0, -1, 0, 1],
      'e': [1, 0, -1, 0],
      'w': [-1, 0, 1, 0]
    };

    var cellsThatWallDivides = function cellsThatWallDivides(wall) {
      var offset = wallCheck[wall.dir];
      return [maze[coord(max, {
        x: wall.x + offset[0],
        y: wall.y + offset[1]
      })], maze[coord(max, {
        x: wall.x + offset[2],
        y: wall.y + offset[3]
      })]].filter(function (cell) {
        return cell && !cell.isInMaze;
      });
    };

    var getWallNewCell = function getWallNewCell(cell, coordName, sign, dir) {
      return _objectSpread2(_objectSpread2({}, maze[coord(max, _objectSpread2(_objectSpread2({}, cell), {}, _defineProperty({}, coordName, cell[coordName] + sign)))]), {}, {
        dir: dir
      });
    };

    var wallInd = Math.floor(Math.random() * maze.length);
    maze[wallInd].cObstacle = false;
    maze[wallInd].isInMaze = true;
    wallInd = wallInd % 2 === 0 ? wallInd + 1 : wallInd;
    var startingCell = maze[wallInd];
    var walls = [];
    var coordName;

    if (startingCell.x) {
      coordName = 'x';
      if (startingCell.x - 1 > -1) walls.push(getWallNewCell(startingCell, coordName, -1, 'w'));
      if (startingCell.x + 1 < max) walls.push(getWallNewCell(startingCell, coordName, 1, 'e'));
    }

    if (startingCell.y) {
      coordName = 'y';
      if (startingCell.y - 1 > -1) walls.push(getWallNewCell(startingCell, coordName, -1, 's'));
      if (startingCell.y + 1 < max) walls.push(getWallNewCell(startingCell, coordName, 1, 'n'));
    }

    while (walls.length) {
      var wallIndex = getRandomElementIndexFromList(walls);
      var wall = walls[wallIndex];
      var cells = cellsThatWallDivides(wall);

      if (cells.length) {
        var cell = cells[0];
        var mazeWallInd = coord(max, wall);
        var cellWallInd = coord(max, cell);
        maze[mazeWallInd].cObstacle = false;
        maze[mazeWallInd].isInMaze = true;
        maze[cellWallInd].cObstacle = false;
        maze[cellWallInd].isInMaze = true;
        if (cell.x - 1 > -1) walls.push(getWallNewCell(cell, 'x', -1, 'w'));
        if (cell.y - 1 > -1) walls.push(getWallNewCell(cell, 'y', -1, 's'));
        if (cell.x + 1 < max) walls.push(getWallNewCell(cell, 'x', 1, 'e'));
        if (cell.y + 1 < max) walls.push(getWallNewCell(cell, 'y', 1, 'n'));
      }

      walls.splice(wallIndex, 1);
    } // REDO Algo when maze is not attractive


    if (maze.filter(function (item) {
      return item.cObstacle;
    }).length < maze.length / 2) {
      return mazeGenerator(nodes, max);
    }

    for (var i = 0; i < maze.length; i++) {
      delete maze[i].isInMaze;
    }

    return maze;
  };

  var _default = /*#__PURE__*/function () {
    function _default(cells) {
      _classCallCheck(this, _default);

      this.cells = cells;
      this.animating = null;
    }

    _createClass(_default, [{
      key: "addToGrid",
      value: function addToGrid(grid, cell, index) {
        var div = document.createElement('div');
        div.setAttribute('coord', index);
        div.classList.add('cell');
        var finalDiv = !grid.children[index] ? grid.appendChild(div) : grid.children[index];
        return _objectSpread2(_objectSpread2({}, cell), {}, {
          elem: finalDiv
        });
      }
    }, {
      key: "initialDraw",
      value: function initialDraw(grid) {
        var _this = this;

        var cells = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var requiredCells = cells.length ? cells : this.cells;
        this.setCells(requiredCells.map(function (cell, index) {
          return _this.addToGrid(grid, cell, index);
        }));
      }
    }, {
      key: "drawMaze",
      value: function drawMaze(grid, cells) {
        this.initialDraw(grid, cells);

        for (var i = 0; i < this.cells.length; i++) {
          if (this.cells[i].cObstacle) {
            this.drawWall(i);
          }
        }
      }
    }, {
      key: "clearChecked",
      value: function clearChecked() {
        this.cells.forEach(function (cell) {
          cell.elem.classList.remove('checked', 'way', 'checked-anim', 'way-anim');
        });
      }
    }, {
      key: "destroy",
      value: function destroy() {
        cancelAnimationFrame(this.animating);
        this.cells = null;
      }
    }, {
      key: "setCells",
      value: function setCells(cells) {
        this.cells = cells;
      }
    }, {
      key: "getCells",
      value: function getCells() {
        return this.cells;
      }
    }, {
      key: "showAlgo",
      value: function showAlgo(values, ind, cb) {
        var _this2 = this;

        var step = function step(values, ind, cb) {
          if (ind === values.length) {
            cb();
            cancelAnimationFrame(_this2.animating);
            return;
          }

          var cellInd = values[ind];
          cellInd && _this2.cells[cellInd] && _this2.cells[cellInd].elem.classList.add('checked-anim');
          _this2.animating = requestAnimationFrame(function () {
            return step(values, ind + 1, cb);
          });
        };

        requestAnimationFrame(function () {
          return step(values, ind, cb);
        });
      }
    }, {
      key: "showAlgoNow",
      value: function showAlgoNow(values) {
        for (var i = 0; i < values.length; i++) {
          var cellInd = values[i];
          this.cells[cellInd].elem.classList.add('checked');
        }
      }
    }, {
      key: "drawWayNow",
      value: function drawWayNow(history, end) {
        var val = history.get(end);

        while (true) {
          if (end === 'S') break;
          end = val;
          this.cells[val] && this.cells[val].elem.classList.add('way');
          val = history.get(end);
        }
      }
    }, {
      key: "drawWay",
      value: function drawWay(grid, history, end, cb) {
        var _this3 = this;

        var step = function step(grid, history, end, cb) {
          if (end === 'S') {
            cancelAnimationFrame(_this3.animating);
            return cb(true);
          }

          var val = history.get(end);
          end = val;
          _this3.animating = requestAnimationFrame(function () {
            return step(grid, history, val, cb);
          });
          grid.children[val] && grid.children[val].classList.add('way-anim');
        };

        requestAnimationFrame(function () {
          return step(grid, history, end, cb);
        });
      }
    }, {
      key: "drawEnd",
      value: function drawEnd(index, end) {
        var currentElement = this.cells[index];

        if (end) {
          this.cells[end].cEnd = false;
          this.cells[end].elem.classList.remove('end');
        }

        if (currentElement.cObstacle) return;
        currentElement.cEnd = true;
        currentElement.cObstacle = false;
        currentElement.cStart = false;
        currentElement.elem.classList.add('end');
        return {
          coordIndex: index,
          x: currentElement.x,
          y: currentElement.y
        };
      }
    }, {
      key: "drawWall",
      value: function drawWall(index) {
        var currentElement = this.cells[index];
        currentElement.cEnd = false;
        currentElement.cObstacle = true;
        currentElement.cStart = false;
        currentElement.elem.classList.add('block');
      }
    }, {
      key: "drawStart",
      value: function drawStart(index, start) {
        var currentElement = this.cells[index];

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
          coordIndex: index,
          x: currentElement.x,
          y: currentElement.y,
          g: 0,
          h: 0,
          f: 0
        };
      }
    }]);

    return _default;
  }();

  var _default$1 = function _default(x, y, max) {
    _classCallCheck(this, _default);

    this.x = x;
    this.y = y;
    this.coordIndex = coord(max, {
      x: x,
      y: y
    }), this.g = 0, //Total cost of getting to this node 
    this.h = 0, // Heuristic func
    this.f = 0, // g + h
    this.cStart = false, this.cChecked = false, this.cEnd = false, this.cObstacle = false, this.cChecked = false, // For maze
    this.neighbours = createNeighbours({
      x: x,
      y: y
    }, max);
  };

  var _default$2 = /*#__PURE__*/function () {
    function _default(max, coordFunc) {
      _classCallCheck(this, _default);

      this.max = max;
      this.coordFunc = coordFunc;
    }

    _createClass(_default, [{
      key: "generateCells",
      value: function generateCells() {
        var cells = [];

        for (var x = 0; x < this.max; x++) {
          for (var y = 0; y < this.max; y++) {
            var curCoord = this.coordFunc({
              x: x,
              y: y
            });
            cells[curCoord] = new _default$1(x, y, this.max);
          }
        }

        return cells;
      }
    }, {
      key: "generateMazeCells",
      value: function generateMazeCells(cells) {
        return mazeGenerator(cells, this.max);
      }
    }]);

    return _default;
  }();

  var _default$3 = /*#__PURE__*/function () {
    function _default$1(grid, options) {
      _classCallCheck(this, _default$1);

      this.grid = grid;
      this.options = options;
      this.cellFactory = null;
      this.drawInstance = null;
      this.generate();
    }

    _createClass(_default$1, [{
      key: "generate",
      value: function generate() {
        this.cellFactory = new _default$2(this.options.cellNum, this.options.coord);
        this.drawInstance = new _default(this.cellFactory.generateCells());
        this.drawInstance.initialDraw(this.grid);
      }
    }, {
      key: "resetGrid",
      value: function resetGrid() {
        this.grid.innerHTML = '';
        this.grid.classList.remove('no-click');
        this.drawInstance.destroy();
        this.options = _objectSpread2(_objectSpread2({}, this.options), initialOptions());
        this.generate();
      }
    }, {
      key: "getOption",
      value: function getOption(optionName) {
        return this.options[optionName];
      }
    }, {
      key: "setOption",
      value: function setOption(optionName, optionValue) {
        this.options[optionName] = optionValue;
      }
    }, {
      key: "updateGrid",
      value: function updateGrid(elem) {
        var _this$options = this.options,
            found = _this$options.found,
            dragged = _this$options.dragged;
        if (!dragged) return;
        if (found && elem.classList.contains('block')) return;
        var elemIndex = +elem.getAttribute('coord');

        if (this.options.Shift) {
          this.setOption('endCoord', this.drawInstance.drawEnd(elemIndex, this.options.endCoord && this.options.endCoord.coordIndex));
          found && this.redrawAlgo();
        } else if (this.options.Ctrl) {
          this.drawInstance.drawWall(elemIndex);
        } else {
          this.setOption('startCoord', this.drawInstance.drawStart(elemIndex, this.options.startCoord && this.options.startCoord.coordIndex));
          found && this.redrawAlgo();
        }
      }
    }, {
      key: "startAlgo",
      value: function startAlgo() {
        var _this = this;

        if (this.getOption('started')) return;
        var _this$options2 = this.options,
            searchFunction = _this$options2.searchFunction,
            endCoord = _this$options2.endCoord,
            startCoord = _this$options2.startCoord,
            coord = _this$options2.coord;

        if (endCoord && startCoord) {
          this.setOption('started', true);
          this.grid.classList.add('no-click');
          var cells = this.drawInstance.getCells();
          var history = searchFunction(cells, cells[startCoord.coordIndex], cells[endCoord.coordIndex]);

          var historyValues = _toConsumableArray(history.keys());

          var endComputed = endCoord.coordIndex;
          this.drawInstance.showAlgo(historyValues, 0, function () {
            _this.drawInstance.drawWay(_this.grid, history, endComputed, function (found) {
              _this.setOption('found', found);

              found && _this.grid.classList.remove('no-click');
            });
          });
        }
      }
    }, {
      key: "generateMazeOnGrid",
      value: function generateMazeOnGrid() {
        var cells = this.cellFactory.generateMazeCells(this.drawInstance.getCells());
        this.resetGrid();
        this.drawInstance.drawMaze(this.grid, cells);
      }
    }, {
      key: "redrawAlgo",
      value: function redrawAlgo() {
        var _this$options3 = this.options,
            searchFunction = _this$options3.searchFunction,
            endCoord = _this$options3.endCoord,
            startCoord = _this$options3.startCoord,
            coord = _this$options3.coord,
            found = _this$options3.found;

        if (endCoord && startCoord && found) {
          var cells = this.drawInstance.getCells();
          var history = searchFunction(cells, cells[startCoord.coordIndex], cells[endCoord.coordIndex]);

          var historyValues = _toConsumableArray(history.keys());

          var endComputed = endCoord.coordIndex;
          this.drawInstance.clearChecked();
          this.drawInstance.showAlgoNow(historyValues);
          this.drawInstance.drawWayNow(history, endComputed);
        }
      }
    }]);

    return _default$1;
  }();

  var grid = document.getElementById('grid');
  var width = document.documentElement.offsetWidth;
  var height = document.documentElement.offsetHeight;
  var tabs = document.querySelector('.tabs');
  var radios = document.getElementsByName('searchType');
  var gridRange = document.getElementById('gridSize');
  var helperButtons = document.querySelector('.helper-buttons');

  gridRange.setAttribute('max', (width / 25).toFixed(0));
  var currentAlgo = 0;
  var cellNum = 21; // Global options object 

  var options = _objectSpread2({}, initialOptions());

  var bindedCoord = coord.bind(null, cellNum);
  grid.style.width = cellNum * 20 + 'px';
  /* ## Generating grid */

  var gridInstance = new _default$3(grid, _objectSpread2(_objectSpread2({}, options), {}, {
    coord: bindedCoord,
    cellNum: cellNum
  }));
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

  start.onclick = function () {
    gridInstance.setOption('searchFunction', getCurrentSearchFunction(+currentAlgo));
    gridInstance.startAlgo();
  };

  maze.onclick = function () {
    return gridInstance.generateMazeOnGrid();
  };

  reset.onclick = function () {
    return gridInstance.resetGrid();
  };

  radios.forEach(function (radio) {
    radio.onclick = function (event) {
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
    ) {
        gridInstance.setOption('Shift', true);
        helperButtons.lastElementChild.firstElementChild.classList.add('active');
      } else if (event.keyCode === 17
    /* Ctrl */
    ) {
        gridInstance.setOption('Ctrl', true);
        helperButtons.firstElementChild.firstElementChild.classList.add('active');
      }
  };

  document.body.onkeyup = function () {
    for (var i = 0; i < helperButtons.children.length; i++) {
      helperButtons.children[i].firstElementChild.classList.remove('active');
    }

    gridInstance.setOption('Ctrl', false);
    gridInstance.setOption('Shift', false);
  };

}());
