const $ = require("jquery");
import _ from "lodash";
import config from "../conf.js";
import ModelItem from "./ModelItem.js";

class CollectionData {

  fetch() {
    let self = this;
    return new Promise((resolve, reject) => {
      $.get({
        url: self.url,
        success: (data) => {
          self.collection = data.map((item) => new ModelItem(item));
          self.analize();
          resolve();
        },
        error: () => {
          reject();
        },
      });
    });
  }

  analize() {
    let self = this;
    let found = [-1];
    let weigh = 1;

    let workWithFoun = (foundFull) => {
      foundFull.forEach((itemId) => {
        if (isNaN(itemId.lvl)) {
          itemId.lvl = weigh;
        }
      });
      foundFull.forEach((fItem) => {
        found.push(fItem.Id);
      });
      weigh++;
      found = _.uniq(found);
    };

    let iteration = () => {
      let foundFull = self.collection.filter((item) =>
        (_.difference(item.Dependency, found).length === 0) ? true : false);
      if (foundFull.length < self.collection.length) {
        workWithFoun(foundFull);
        iteration();
      } else {
        workWithFoun(foundFull);
      }
    };
    iteration();
    self.collection.sort((itemA, itemB) => itemA.lvl - itemB.lvl);
  }

  constructor() {
    this.url = config.urlGetCollectiData;
    this.collection = [];
  }

}

export default CollectionData;
