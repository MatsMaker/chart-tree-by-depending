let d3 = require("d3");
import _ from "lodash";
import Model from "./Model.js";
import Scale from "./Scale.js";

const Paper = class {
  render(select) {
    let self = this;
    const selector = select || this.selectorDefault;

    // start set limits
    let listLvl = self.data.collection.map((item) => item.lvl);
    self.data.minLvl = _.head(listLvl);
    self.data.maxLvl = _.last(listLvl);

    self.data.maxClX = 0;
    listLvl.forEach((lvl, index, arrLvl) => {
      let groupLvl = arrLvl.filter((nLvl) => lvl === nLvl);
      if (groupLvl.length > self.data.maxClX) {
        self.data.maxClX = groupLvl.length;
      }
    });
    // end set limits

    this.scale = new Scale(
      this.model.get("width"),
      this.model.get("height"), {
        x: self.data.maxClX,
        y: self.data.maxLvl,
      }
    );

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

    let posBoxX = (node, val = 0) => {
      return this.scale.x(node.group) + val;
    };
    let posBoxY = (node, val = 0) => {
      return this.scale.y(node.lvl) + val;
    };

    // Start render background
    let bgArrayData = _.range(0, 9)
      .map((i) => {
        return {
          id: i,
          lvl: i,
          contentLvls: 1,
        };
      });

    self.items.background =
      self.svg.append("g")
      .attr("class", "group-background");

    self.items.background.selectAll("rect")
      .data(bgArrayData)
      .enter()
      .append("rect")
      .attr("class", "lvl-background")
      .attr("id", (node) => "group-background-" + node.id)
      .attr("y", (node) => posBoxY(node))
      .attr("x", 0)
      .attr("width", self.model.get("width"))
      .attr("height", (node) => {
        let heightLvl = self.model.get("height") / (self.data.maxLvl + 1);
        return heightLvl * node.contentLvls;
      });

    // End render backhraund

    self.items.groupNodes =
      self.svg.append("g")
      .attr("class", "nodes");

    self.items.groupNodes.selectAll("rect")
      .data(self.data.collection)
      .enter()
      .append("g")
      .attr("id", (node) => "group-node-" + node.Id)
      .attr("class", "group-node");

    self.items.groupNodes.selectAll(".group-node")
      .append("rect")
      .attr("class", "node")
      .attr("id", (node) => "node-" + node.Id)
      .attr("x", (node) => posBoxX(node, self.model.get("padding").left))
      .attr("y", (node) => posBoxY(node))
      .attr("width", (node) => node.width)
      .attr("height", (node) => node.height);

    // label
    self.items.groupNodes.selectAll(".group-node")
      .append("text")
      .attr("class", "node-label")
      .attr("x", (node) => posBoxX(node, self.model.get("padding").left + 4))
      .attr("y", (node) => posBoxY(node, 15))
      .html((node) => node.Id);

    return this;
  }

  depends() {
    let self = this;

    let depends = d3.line();

    self.items.depends =
      self.svg.append("g")
      .attr("class", "group-depends");

    // self.items.depends.selectAll(".node-depend")
    //   .append("polyline")
    //   .attr("depend")
    //   .call(depends);

    return self;
  }


  constructor(DataCollection) {
    this.items = {};
    this.selectorDefault = "#paper";
    this.model = new Model();
    this.data = new DataCollection();
  }

  getData() {
    return new Promise((resolve, reject) => {
      this.data.fetch()
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
