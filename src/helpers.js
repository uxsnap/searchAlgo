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
    [-1, 0, 'w'],
    [1, 0, 'e'],
    [0, -1, 's'],
    [0, 1, 'n'],
  ]) {
    const neighbour = { 
      x: node.x + dir[0], 
      y: node.y + dir[1], 
      dir: dir[2],
    };
    if (neighbour.x < max && neighbour.y < max && neighbour.y > -1 && neighbour.x > -1) {
      const { x, y } = neighbour;
      neighbours.push({ ...neighbour, coordIndex: coord(max, { x, y }) });
    }
  }
  return neighbours;
};

export const getNeighbours = (nodes, node, max) => {
  const neighbours = createNeighbours(node, max);
  return neighbours.map((item) => {
    const curNode = nodes[coord(max, item)];
    return {
      ...item, ...curNode
    }
  });
};


export const pointDist = (p1, p2) => {
  const d1 = Math.abs(p1.x - p2.x);
  const d2 = Math.abs(p1.y - p2.y);
  return d1 + d2;
};

export const isWall = (cells, index) => {
  return cells[index] && cells[index].cObstacle;
};

export const getRandomElementIndexFromList = (list) => {
  return Math.floor(Math.random() * list.length);
};