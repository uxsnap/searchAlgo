export const initialOptions = () => ({
  Shift: false,
  Ctrl: false,
  started: false,
  found: false,
  dragged: false,
  endCoord: null,
  startCoord: null,
});

export const coord = (max, obj) => obj.x * max + obj.y;

export const createNeighbours = (node, max) => {
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

export const pointDist = (p1, p2) => {
  return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
};

export const isWall = (cells, index) => {
  return cells[index] && cells[index].cObstacle;
};
