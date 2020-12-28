import { mazeGenerator } from './algos';

export default class {
  constructor(max, coordFunc) {
    // this.grid = grid;
    this.max = max;
    this.coordFunc = coordFunc;
  }

  generate() {
    const cells = [];
    for (let i = 0; i < this.max; i++) {
      for (let j = 0; j < this.max; j++) {
        const curCoord = this.coordFunc({ x: i, y: j });
        cells[curCoord] = {
          x: i,
          y: j,
          g: 0, //Total cost of getting to this node 
          h: 0,// Heuristic func
          f: 0, // g + h
          cStart: false,
          cChecked: false,
          cEnd: false,
          cObstacle: false,
          cChecked: false, // For maze
        };
      }
    }
    return cells;
  }

  generateMaze(cells) {
    return mazeGenerator(cells, this.max);
  }
}

