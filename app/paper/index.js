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

    // find collection depends
    let collectionDepends = [];
    self.data.collection.forEach((item) => {
      item.Dependency.forEach((depend, index, arrDepend) => {
        if (depend !== -1) {
          let fromNode = self.data.collection.find((node) => node.Id === depend);
          collectionDepends.push({
            from: {
              id: depend,
              lvl: fromNode.lvl,
              part: index,
              numberDepends: arrDepend.length,
              group: fromNode.group,
              width: fromNode.width,
              height: fromNode.height,
            },
            to: {
              part: index,
              id: item.Id,
              lvl: item.lvl,
              numberDepends: arrDepend.length,
              group: item.group,
              width: item.width,
              height: item.height,
            },
          });
        }
      });
    });
    self.data.depends = collectionDepends;
    // end collection depends;

    let depends = d3.line()
      .curve(d3.curveCatmullRom.alpha(0.5));

    self.items.depends =
      self.svg.append("g")
      .attr("class", "group-depends");

    let points = (line) => {
      const margin = 5;

      const xStart = (self.scale.x(line.from.group) + self.model.get("padding").left + (line.from.width / (line.to.numberDepends + 1) * (line.to.numberDepends - line.from.part)));
      const xEnd = (self.scale.x(line.to.group) + self.model.get("padding").left + (line.to.width / (line.to.numberDepends + 1) * (line.to.numberDepends - line.from.part)));

      const pStart = [
        xStart,
        (self.scale.y(line.from.lvl) + line.from.height),
      ];
      const p1 = [
        xStart,
        (self.scale.y(line.from.lvl) + line.from.height + margin),
      ];

      const p2 = [
        xEnd,
        (self.scale.y(line.to.lvl) - margin),
      ];

      const pEnd = [
        xEnd,
        self.scale.y(line.to.lvl),
      ];

      if (line.from.lvl + 1 === line.to.lvl) {
        return [pStart, p1, p2, pEnd];
      } else {
        const lineRightOrLeft = (((line.to.numberDepends - line.to.part) >= (line.to.numberDepends / 2)) ? 1 : -1);
        const move = line.to.width / 2 * lineRightOrLeft;
        return [
          pStart, p1, [p1[0] + move, p1[1] + margin],
          [p2[0] + move, p2[1] - margin],
          p2, pEnd,
        ];
      }
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
