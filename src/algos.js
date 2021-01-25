import {
  createNeighbours,
  pointDist,
  isWall,
  coord,
  getRandomElementIndexFromList,
} from './helpers';

export const BFS = (nodes, startNode, endNode) => {
  const queue = [startNode];
  const visited = new Map();
  visited.set(startNode.coordIndex, 'S');
  while (queue.length) {
    let node = queue.shift();
    if (node.coordIndex === endNode.coordIndex) {
      return visited;
    }
    const prevCoord = node.coordIndex;
    const neighbours = node.neighbours;
    neighbours.forEach((item) => {
      const curCoord = item.coordIndex;
      if (isWall(nodes, curCoord)) return;
      if (!visited.get(curCoord)) {
        queue.push(nodes[curCoord]);
        visited.set(curCoord, prevCoord);
      }
    });
  }
  return false;
}

export const Dijkstra = (nodes, startNode, endNode) => {
  const history = new Map();
  const d = [];
  const v = [];
  for (let i = 0; i < nodes.length; i++) d[i] = Infinity;
  const start = startNode.coordIndex; 
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
    if (si === -1 || (node.coordIndex === endNode.coordIndex)) {
      return history;
    }
    const prevCoord = node.coordIndex;
    const neighbours = node.neighbours;
    neighbours.forEach((item) => {
      const curCoord = item.coordIndex;
      if (isWall(nodes, curCoord)) return;
      if (d[curCoord] > d[si]) {
        d[curCoord] = d[si] + 1;
      }
      if (!history.get(curCoord)) {
        history.set(curCoord, prevCoord);
      }
    });
  }
};

export const Astar = (nodes, startNode, endNode) => {
  const history = new Map();
  const queue = [startNode];
  const closed = [];
  const start = startNode.coordIndex; 
  history.set(start, 'S');
  while (queue.length) {
    let si =  0;
    for (let i = 1; i < queue.length; i++) {
      if (queue[i].f < queue[si].f) {
        si = i;
      }
    }
    const node = queue[si]; 
    if (node.coordIndex === endNode.coordIndex) {
      const curNode = node;
      const ret = [];
      return history;
    }
    queue.splice(si, 1);
    closed.push(node);
    const prevCoord = node.coordIndex;
    const neighbours = node.neighbours;
    let gScore = node.g + 1;
    let gBest = false;
    neighbours.forEach((neighbourItem) => {
      const item = nodes[neighbourItem.coordIndex];
      const curCoord = item.coordIndex;
      if (closed.find((c) => c.coordIndex === curCoord) || isWall(nodes, curCoord))
        return;
      if (!queue.find((q) => q.coordIndex === curCoord)) {
        gBest = true;
        item.h  = pointDist(item, endNode);
        queue.push(nodes[curCoord]);
      } else if (gScore < item.g) {
        gBest = true;
      }

      if (gBest) {
        history.set(curCoord, prevCoord);
        item.g  = gScore;
        item.f = item.g + item.h;
      }
    });
  }
}

export const mazeGenerator = (nodes, max) => {
  const maze = nodes.map((node) => ({ 
    ...node,
    cObstacle: true, 
    isInMaze: false 
  }));

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

  const getWallNewCell = (cell, coordName, sign, dir) => {
    return { ...maze[coord(max, { ...cell, [coordName]: cell[coordName] + sign})], dir };
  };

  let wallInd = Math.floor(Math.random() * maze.length);
  maze[wallInd].cObstacle = false;
  maze[wallInd].isInMaze = true;

  wallInd = wallInd % 2 === 0 ? wallInd + 1 : wallInd;
  const startingCell = maze[wallInd];
  const walls = [];
  let coordName;
  if (startingCell.x) {
    coordName = 'x';
    if (startingCell.x - 1 > -1) walls.push(getWallNewCell(startingCell, coordName, -1, 'w'))
    if (startingCell.x + 1 < max) walls.push(getWallNewCell(startingCell, coordName, 1, 'e'))
  }
  if (startingCell.y) {
    coordName = 'y';
    if (startingCell.y - 1 > -1) walls.push(getWallNewCell(startingCell, coordName, -1, 's'))
    if (startingCell.y + 1 < max) walls.push(getWallNewCell(startingCell, coordName, 1, 'n'))
  }
  while (walls.length) {
    const wallIndex = getRandomElementIndexFromList(walls);
    const wall = walls[wallIndex];
    const cells = cellsThatWallDivides(wall);
    if (cells.length) {
      const cell = cells[0];
      const mazeWallInd = coord(max, wall);
      const cellWallInd = coord(max, cell); 

      maze[mazeWallInd].cObstacle = false;
      maze[mazeWallInd].isInMaze = true;
      
      maze[cellWallInd].cObstacle = false;
      maze[cellWallInd].isInMaze = true;
      
      if (cell.x - 1 > -1) walls.push(getWallNewCell(cell, 'x', -1, 'w'))
      if (cell.y - 1 > -1) walls.push(getWallNewCell(cell, 'y', -1, 's'))
      if (cell.x + 1 < max) walls.push(getWallNewCell(cell, 'x', 1, 'e'))
      if (cell.y + 1 < max) walls.push(getWallNewCell(cell, 'y', 1, 'n'))
    }
    walls.splice(wallIndex, 1);
  }

  // REDO Algo when maze is not attractive
  if (maze.filter((item) => item.cObstacle).length < maze.length / 2) {
    return mazeGenerator(nodes, max);
  } 

  for (let i = 0; i < maze.length; i++) {
    delete maze[i].isInMaze;
  }
  return maze;
};
