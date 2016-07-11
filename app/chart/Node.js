const d3 = require("d3");

class Node {

  constructor(item) {
    const width = 100 || item.get("width");
    const height = 70 || item.get("height");
    const x = 0 || item.get("x");
    const y = 0 || item.get("y");
    this.patch = d3.path.rect(x, y, width, height);
  }

}

export default Node;
