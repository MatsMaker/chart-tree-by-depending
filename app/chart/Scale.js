const d3 = require("d3");

class Scale {

  initLinearScale(val) {
    return d3.scaleLinear()
      .domain([0, val])
      .range([0, val]);
  }

  constructor(width, height) {
    this.x = this.initLinearScale(width);
    this.y = this.initLinearScale(height);
  }
}

export default Scale;
