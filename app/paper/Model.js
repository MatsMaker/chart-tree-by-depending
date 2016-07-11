import Backbone from "backbone";

const Model = Backbone.Model.extend({
  defaults: {
    padding: {
      top: 35,
      right: 35,
      bottom: 35,
      left: 35,
    },
    width: 500,
    height: 800,
  },
});

export default Model;
