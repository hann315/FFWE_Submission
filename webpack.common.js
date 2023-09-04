/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      /* style and css loader */
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jp?g|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 5000,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2)$/,
        exclude: /node_modules/, // Adjust this path as needed
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  /* plugin */
  plugins: [
    /* HTML Webpack Plugin */
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      favicon: "./src/images/favicon.ico"
    }),
  ],
};
