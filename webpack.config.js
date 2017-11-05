const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
  filename: `../css/app.css`,
});

module.exports = {
  devtool: "inline-source-map",
  entry: "./app/index.tsx",
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
    //   enforce: "pre",
    //   loader: "source-map-loader", 
    //   test: /\.js$/,
    // }, {
      test: /\.scss$/,
      loader: extractSass.extract({
        use: [
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ],
      }),
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!postcss-loader',
      options: {
        minimize: true,
        plugins: function () {
          return [
            require('autoprefixer')
          ];
        }
      }
    }]
  },
  output: {
    filename: "app.js",
    path: __dirname + "/dist/js",
  },
  plugins: [
    extractSass,
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
};
