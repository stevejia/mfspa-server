const HtmlWebpackPlugin = require("html-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const EncodingPlugin = require("webpack-encoding-plugin");

const path = require("path");
const cwd = process.cwd();
module.exports = {
  entry: [path.join(cwd, "src/index.js")],
  mode: "production",
  output: {
    filename: "index.js",
    path: path.join(cwd, "/dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.js|jsx|ts|tsx$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [miniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".html"],
  },
  plugins: [
    new miniCssExtractPlugin({
      filename: "css/index.css",
    }),

    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(cwd, "public/index.html"),
      inject: true,
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
      },
    }),
    new EncodingPlugin({
      encoding: "UTF-8",
    }),
  ],
};
