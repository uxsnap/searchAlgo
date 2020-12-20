import Draw from './Draw';
import Generate from './Generate';
import { initialOptions } from './helpers';

export default class {
  constructor(grid, options) {
    this.grid = grid;
    this.options = options;
    this.generateInstance = new Generate(
      options.cellNum, 
      options.coord
    );
    this.drawInstance = new Draw(this.generateInstance.generate());
  }

  generateGrid() {
    this.drawInstance.initialDraw(this.grid);
  }

  resetGrid() {
    this.grid.innerHTML = '';
    this.grid.className = undefined;
    this.drawInstance.setCells(this.generateInstance.generate());
    this.options =  { ...this.options, ...initialOptions() };
    this.generateGrid();
  }

  setOption(optionName, optionValue) {
    this.options[optionName] = optionValue;
  }

  updateGrid(event) {
    if (!this.options.dragged) return;
    const elem = event.target;
    const elemIndex = +elem.getAttribute('coord');
    if (this.options.Shift) {
      this.setOption(
        'endCoord',
        this.drawInstance.drawEnd(elemIndex, this.options.endCoord && this.options.coord(this.options.endCoord))
      );
    } else if (this.options.Ctrl) {
      this.drawInstance.drawWall(elemIndex);
    } else {
      this.setOption(
        'startCoord',
        this.drawInstance.drawStart(elemIndex, this.options.startCoord && this.options.coord(this.options.startCoord))
      );
    }
  }

  startAlgo() {
    if (this.getOption('started')) return;
    this.setOption('started', true);
    this.grid.className = 'no-click';
    const { endCoord, startCoord } = this.options;
    if (endCoord && startCoord) {
      const searchFunction = getCurrentSearchFunction(+currentTab);
      const history = searchFunction(cells, startCoord, endCoord, options.cellNum);
      const historyValues = [...history.keys()];
      let endComputed = coord(endCoord, options.cellNum);
      showAlgo(historyValues, 0, function() {
        drawWay(history, endComputed);
      });
    }
  }
}