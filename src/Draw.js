export default class {
  constructor(cells) {
    this.cells = cells;
  }

  initialDraw(grid) {
    this.setCells(
      this.cells.map((cell, i) => {
        const div = document.createElement('div');
        div.setAttribute('coord', i)
        div.classList.add('cell');
        grid.appendChild(div);
        return {
          ...cell,
          elem: div
        }
      })
    );
  }

  setCells(cells) {
    this.cells = cells;
  }

  getCells() {
    return { ...this.cells };
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
    currentElement.cEnd = false; 
    currentElement.cObstacle = false; 
    currentElement.cStart = true;
    currentElement.elem.classList.add('start');
    return { x: currentElement.x, y: currentElement.y, g: 0, h: 0, f: 0 };
  }

  drawBlocksOnGrid(
    event 
  ) {
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
      endCoord = { x: currentElement.x, y: currentElement.y };

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
      startCoord = { x: currentElement.x, y: currentElement.y, g: 0, h: 0, f: 0 };
    }
    elem.classList.add(Shift ? 'end' : Ctrl ? 'block' : 'start');

    this.setCells(cells);
  }
}