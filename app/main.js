import Paper from "./paper";
import DataCollection from "./data/Collection.js";
import Scale from "./chart/Scale.js";

const paper = new Paper(DataCollection, Scale);

paper
  .getData()
  .then(() => {
    paper.render()
      .axisRight()
      .groupNodes();

  });
