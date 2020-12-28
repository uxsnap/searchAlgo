export default class {
  constructor(cells) {
    this.cells = cells;
    this.interval = null;
  }

  addToGrid(grid, cell, index) {
    const div = document.createElement('div');
    div.setAttribute('coord', index)
    div.classList.add('cell');
    const finalDiv = !grid.children[index] ? grid.appendChild(div) : grid.children[index];
    return {
      ...cell,
      elem: finalDiv
    }
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
    this.cells.forEach((cell) => {
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
    return { x: currentElement.x, y: currentElement.y };
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
    return { x: currentElement.x, y: currentElement.y, g: 0, h: 0, f: 0 };
  }

}