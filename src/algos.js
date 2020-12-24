import { createNeighbours, pointDist, isWall, coord } from './helpers';

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
      if (queue[i].h < queue[si].h) {
        si = i;
      }
    }
    const node = queue[si]; 
    if (node.x === endNode.x && node.y === endNode.y) {
      return history;
    }
    queue.splice(si, 1);
    closed.push(node);
    const prevCoord = coord(max, node);
    const neighbours = createNeighbours(node, max);
    neighbours.forEach((item) => {
      if (closed.find((c) => coord(max, c) === coord(max, item)) || isWall(nodes, coord(max, item))) {
        return;
      }
      let gScore = node.g + 1;
      let gBest = false;
      if (!queue.find((q) => coord(max, q) === coord(max, item))) {
        gBest = true;
        item.h  = pointDist(node, endNode);
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