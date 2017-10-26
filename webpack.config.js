module.exports = {
  devtool: "source-map",
  entry: "./app/main.ts",
  externals: {
    "jquery": "jQuery",
  },
  module: {
    rules: [{ 
      enforce: "pre",
      loader: "tslint-loader",
      options: {
        emitErrors: true,
      },
      test: /\.tsx?$/,
    }, {
      loader: "awesome-typescript-loader",
      test: /\.tsx?$/,
    }, {
      enforce: "pre",
      loader: "source-map-loader", 
      test: /\.js$/,
    }]
  },
  output: {
    filename: "app.js",
    path: __dirname + "/dist",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
};
