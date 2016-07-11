const d3 = require("d3");

class Scale {

  initLinearScale(range, domain) {
    return d3.scaleLinear()
      .domain([0, domain + 1])
      .range([0, range]);
  }

  constructor(width, height, domain) {
    this.x = this.initLinearScale(width, domain.x);
    this.y = this.initLinearScale(height, domain.y);
  }
}

export default Scale;
