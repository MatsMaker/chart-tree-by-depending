var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: path.join(__dirname, "app/main.js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  watch: true,
  module: {
    loaders: [{
      loader: "babel-loader",
      test: path.join(__dirname, "app"),
      query: {
        presets: "es2015",
      },
    }],
  },
  stats: {
    colors: true,
  },
  devtool: "source-map",
  devServer: {
    hot: true,
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      d3: "d3",
    }),
  ],
};
