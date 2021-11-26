const path = require('path');

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "src", "index.js"),
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
    ]
  },
  output: {
    path:path.resolve(__dirname, "public/js"),
  }
}