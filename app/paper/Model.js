import Backbone from "backbone";

const Model = Backbone.Model.extend({
  defaults: {
    width: 500,
    height: 800,
  },
});

export default Model;
