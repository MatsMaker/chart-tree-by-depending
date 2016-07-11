let d3 = require("d3");
import Model from "./Model.js";

const Paper = class {

  render(select) {
    const selector = select || this.selectorDefault;
    this.svg = d3.select(selector)
      .attr("class", "paper")
      .attr("width", this.model.get("width"))
      .attr("height", this.model.get("height"));
    return this;
  }

  axisRight() {
    this.svg
      .append("g")
      .attr("class", "axis-right")
      .call(
        d3.axisRight(this.scale.y)
      );

    return this;
  }

  groupNodes() {
    const self = this;
    // let rect = d3.svg.rect(0, 0, 100, 150);

    this.items.groupNodes =
      this.svg.append("g")
      .attr("class", "nodes");

    this.items.groupNodes.selectAll("rect")
      .data(self.dataCollection.collection)
      .enter()
      .append("rect")
      .attr("class", "node")
      .attr("id", (node) => node.Id)
      .attr("x", (node) => node.x)
      .attr("y", (node) => node.y)
      .attr("width", (node) => node.width)
      .attr("height", (node) => node.height);

    return this;
  }

  constructor(DataCollection, Scale) {
    this.items = {};
    this.selectorDefault = "#paper";
    this.model = new Model();
    this.scale = new Scale(
      this.model.get("width"),
      this.model.get("height")
    );
    this.dataCollection = new DataCollection();
  }

  getData() {
    return new Promise((resolve, reject) => {
      this.dataCollection.fetch()
        .then(() => {
          console.info("Data has got");
          resolve();
        })
        .catch((reason) => {
          console.erro(reason);
          reject();
        });
    });
  }

};

export default Paper;
