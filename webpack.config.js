module.exports = {
  devtool: "source-map",
  entry: "./src/main.ts",
  externals: {
    "jquery": "jQuery",
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  output: {
    filename: "app.js",
    path: __dirname + "/dist",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
};
