import { createNeighbours, coord } from './helpers';

export default class {
  constructor(x, y, max) {
    this.x = x;
    this.y = y;
    this.coordIndex = coord(max, { x, y }),
    this.g = 0, //Total cost of getting to this node 
    this.h = 0,// Heuristic func
    this.f = 0, // g + h
    this.cStart = false,
    this.cChecked = false,
    this.cEnd = false,
    this.cObstacle = false,
    this.cChecked = false, // For maze
    this.neighbours = createNeighbours({ x, y }, max)
  }
}