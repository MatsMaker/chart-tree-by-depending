import Paper from "./paper";
import DataCollection from "./data/Collection.js";

const paper = new Paper(DataCollection);

paper
  .getData()
  .then(() => {
    paper.render()
      .groupNodes()
      .depends()
      .axisRight();

  });
