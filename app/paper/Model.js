import Backbone from "backbone";

const Model = Backbone.Model.extend({
  defaults: {
    padding: {
      top: 35,
      right: 35,
      bottom: 35,
      left: 45,
    },
    width: 700,
    height: 1000,
  },
});

export default Model;
