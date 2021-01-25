import { mazeGenerator } from './algos';
import { createNeighbours, coord } from './helpers';
import Cell from './Cell';

export default class {
  constructor(max, coordFunc) {
    this.max = max;
    this.coordFunc = coordFunc;
  }

  generateCells() {
    const cells = [];
    for (let x = 0; x < this.max; x++) {
      for (let y = 0; y < this.max; y++) {
        const curCoord = this.coordFunc({ x, y });
        cells[curCoord] = new Cell(x, y, this.max);
      }
    }
    return cells;
  }

  generateMazeCells(cells) {
    return mazeGenerator(cells, this.max);
  }
}

