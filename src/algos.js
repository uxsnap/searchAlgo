import { getNeighbours, 
  createNeighbours,
  pointDist,
  isWall,
  coord,
  getRandomElementIndexFromList,
  createSimilarNeighbours
} from './helpers';

export const BFS = (nodes, startNode, endNode, max) => {
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
    neighbours.forEach((item) => {
      if (isWall(nodes, coord(max, item))) return;
      const curCoord = coord(max, item);
      if (!visited.get(curCoord)) {
        queue.push(item);
        visited.set(curCoord, prevCoord);
      }
    });
  }
  return false;
}

export const Dijkstra = (nodes, startNode, endNode, max) => {
  const history = new Map();
  const d = [];
  const v = [];
  for (let i = 0; i < nodes.length; i++) d[i] = Infinity;
  const start = coord(max, startNode); 
  d[start] = 0;
  history.set(start, 'S');
  while (true) {
    let sd = Infinity;
    let si =  -1;
    for (let i = 0; i < nodes.length; i++) {
      if (d[i] < sd && !v[i]) {
        sd = d[i];
        si = i;
      }
    }

    v[si] = true;
    const node = nodes[si]; 
    if (si === -1 || (node.x === endNode.x && node.y === endNode.y)) {
      return history;
    }
    const prevCoord = coord(max, node);
    const neighbours = createNeighbours(node, max);
    neighbours.forEach((item) => {
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

export const Astar = (nodes, startNode, endNode, max) => {
  const history = new Map();
  const queue = [startNode];
  const closed = [];
  const start = coord(max, startNode); 
  history.set(start, 'S');
  while (queue.length) {
    let si =  0;
    for (let i = 1; i < queue.length; i++) {
      if (queue[i].f < queue[si].f) {
        si = i;
      }
    }
    const node = queue[si]; 
    if (node.x === endNode.x && node.y === endNode.y) {
      const curNode = node;
      const ret = [];
      return history;
    }
    queue.splice(si, 1);
    closed.push(node);
    const prevCoord = coord(max, node);
    const neighbours = createNeighbours(node, max);
    let gScore = node.g + 1;
    let gBest = false;
    neighbours.forEach((item) => {
      if (closed.find((c) => coord(max, c) === coord(max, item)) || isWall(nodes, coord(max, item))) {
        return;
      }
      if (!queue.find((q) => coord(max, q) === coord(max, item))) {
        gBest = true;
        item.h  = pointDist(item, endNode);
        queue.push(item);
      } else if (gScore < item.g) {
        gBest = true;
      }

      if (gBest) {
        history.set(coord(max, item), prevCoord);
        item.g  = gScore;
        item.f = item.g + item.h;
      }
    });
  }
}

export const mazeGenerator = (nodes, max) => {
  const maze = nodes.map((node) => ({ x: node.x, y: node.y, cObstacle: true, isInMaze: false }));

  const wallCheck = {
    'n': [0, 1, 0, -1],
    's': [0, -1, 0, 1],
    'e': [1, 0, -1, 0],
    'w': [-1, 0, 1, 0],
  };

  const cellsThatWallDivides = (wall) => {
    const offset = wallCheck[wall.dir];
    return [
      maze[coord(max, { x: wall.x + offset[0], y: wall.y + offset[1]})],
      maze[coord(max, { x: wall.x + offset[2], y: wall.y + offset[3]})]
    ].filter((cell) => cell && !cell.isInMaze);    
  };

  const checkWallDivsion = (wall) => {
    const cell = cellThatWallDivides(wall);
    return !cell ? true : cell.isInMaze;
  };


  const wallInd = Math.floor(Math.random() * maze.length);
  maze[wallInd].cObstacle = false;
  maze[wallInd].isInMaze = true;

  const startingCell = maze[wallInd];

  const walls = [];
  if (startingCell.x - 1 > -1) walls.push({ ...maze[coord(max, { ...startingCell, x: startingCell.x - 1})], dir: 'w',});
  if (startingCell.y - 1 > -1) walls.push({ ...maze[coord(max, { ...startingCell, y: startingCell.y - 1})], dir: 's',});
  if (startingCell.x + 1 < max) walls.push({ ...maze[coord(max, { ...startingCell, x: startingCell.x + 1})], dir: 'e',});
  if (startingCell.y + 1 < max) walls.push({ ...maze[coord(max, { ...startingCell, y: startingCell.y + 1})], dir: 'n',});
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
      if (cell.x - 1 > -1) walls.push({...maze[coord(max, { ...cell, x: cell.x - 1})], dir: 'w'});
      if (cell.y - 1 > -1) walls.push({...maze[coord(max, { ...cell, y: cell.y - 1})], dir: 's'});
      if (cell.x + 1 < max) walls.push({...maze[coord(max, { ...cell, x: cell.x + 1})], dir: 'e'});
      if (cell.y + 1 < max) walls.push({...maze[coord(max, { ...cell, y: cell.y + 1})], dir: 'n'});
    }
    walls.splice(wallIndex, 1);
  }
  return maze.map((item) => ({ ...item, isInMaze: undefined }));
};
