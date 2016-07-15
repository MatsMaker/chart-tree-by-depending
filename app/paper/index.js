let d3 = require("d3");
import _ from "lodash";
import Model from "./Model.js";
import Grid from "./Grid.js";

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

    this.grid = new Grid({
      numberColumns: self.data.maxClX,
      numberLvls: self.data.maxLvl,
      width: self.model.get("width"),
      height: self.model.get("height"),
    });

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
        d3.axisRight(this.grid.scale.y)
      );

    return this;
  }

  contentOfNode() {
    const self = this;
    const spase = {
      top: 5,
      left: 5,
      fontSize: 15,
    };
    // label
    self.items.groupNodes.selectAll(".group-node")
      .append("text")
      .attr("class", "node-label")
      .attr("x", (node) => self.grid.posColumOfNode(node.group) + spase.left)
      .attr("y", (node) => self.grid.posLvlOfNode(node.lvl) + spase.top + spase.fontSize)
      .html((node) => node.Id);

    return this;
  }

  groupNodes() {
    const self = this;

    self.items.groupNodes =
      self.svg.append("rect")
      .attr("class", "background")
      .attr("width", this.model.get("width"))
      .attr("height", this.model.get("height"));

    // Start nodes
    self.items.groupNodes =
      self.svg.append("g")
      .attr("class", "nodes");

    self.items.groupNodes
      .selectAll("rect")
      .data(self.data.collection)
      .enter()
      .append("g")
      .attr("id", (node) => "group-node-" + node.Id)
      .attr("class", "group-node");

    // node
    self.items.groupNodes
      .selectAll(".group-node")
      .append("rect")
      .attr("class", "node")
      .attr("id", (node) => "node-" + node.Id)
      .attr("x", (node) => self.grid.posColumOfNode(node.group))
      .attr("y", (node) => self.grid.posLvlOfNode(node.lvl))
      .attr("width", self.grid.widthColumnOfNode)
      .attr("height", self.grid.heightOfNode);
    // End nodes

    return this;
  }

  depends() {
    const self = this;
    self.calcDepends();
    const collectionDepends = self.data.depends;

    let depends = d3.line()
      .curve(d3.curveCatmullRom.alpha(0.5));

    self.items.depends =
      self.svg.append("g")
      .attr("class", "group-depends");

    let points = (line) => {
      const grid = self.grid;

      const pStart = [
        grid.posColumOfNode(line.from.group),
        grid.posLvlOfNode(line.from.lvl) + grid.heightOfNode,
      ];

      const pEnd = [
        grid.posColumOfNode(line.to.group),
        grid.posLvlOfNode(line.to.lvl),
      ];

      return [pStart, pEnd];
    };

    self.items.depends.selectAll(".polyline")
      .data(collectionDepends)
      .enter()
      .append("polyline")
      // .apend("path")
      .attr("class", "depend")
      .attr("from-to", (line) => line.from.id + "-" + line.to.id)
      .attr("points", (line) => {
        return points(line).join(" ");
      })
      .call(depends);

    return self;
  }

  constructor(DataCollection) {
    this.items = {};
    this.selectorDefault = "#paper";
    this.model = new Model();
    this.data = new DataCollection();
  }

  calcDepends() {
    const self = this;
    let collectionDepends = [];
    self.data.collection.forEach((item) => {
      item.Dependency.forEach((depend, index, arrDepend) => {
        if (depend !== -1) {
          let fromNode = self.data.collection.find((node) => node.Id === depend);
          collectionDepends.push({
            from: {
              id: depend,
              lvl: fromNode.lvl,
              group: fromNode.group,
              part: index,
              numberDepends: arrDepend.length,
            },
            to: {
              id: item.Id,
              lvl: item.lvl,
              group: item.group,
              part: index,
              numberDepends: arrDepend.length,
            },
          });
        }
      });
    });
    self.data.depends = collectionDepends;
    // end collection depends;
    return this;
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
