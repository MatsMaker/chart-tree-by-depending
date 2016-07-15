let d3 = require("d3");

class Grid {

  posColumOfNode(currentColum) {
    return this.scale.x(currentColum);
  }

  posLvlOfNode(numberLvl) {
    return this.scale.y(numberLvl);
  }

  constructor(data) {
    const self = this;
    this.numberColumns = data.numberColumns;
    this.numberLvls = data.numberLvls;

    this.width = data.width;
    this.height = data.height;

    this.spase = data.spase || {
      top: 35,
      right: 35,
      bottom: 35,
      left: 35,
      nodeLeft: 25,
      nodeBottom: 45,
    };

    this.workSpace = {
      width: self.width - (self.spase.right + self.spase.left),
      height: this.height - (self.spase.top + self.spase.bottom),
    };

    this.scale = {
      x: d3.scaleLinear()
        .domain([0, this.numberColumns])
        .range([this.spase.left, self.width - self.spase.left + this.spase.nodeLeft]),
      y: d3.scaleLinear()
        .domain([1, this.numberLvls])
        .range([this.spase.top, this.workSpace.height - self.spase.bottom]),
    };

    this.biasNode = (this.spase.nodeLeft * this.numberColumns - 1) / this.numberColumns;

    this.widthColumnOfNode =
      this.scale.x(2) - this.scale.x(1) - this.biasNode;

    this.heightOfNode =
      this.scale.y(2) - this.scale.y(1) - this.spase.nodeBottom;
  }
}

export default Grid;
