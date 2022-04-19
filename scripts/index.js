const webpackConfig = require("./webpack/webpack.config");
const express = require("express");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const mime = require("mime");
const compiler = webpack(webpackConfig);

const getEnv = require("./tools/getEnv");
const start = require("./tools/start");
const build = require("./tools/build");
const env = getEnv();
console.log(env);
if (env !== "dev") {
  build();
} else {
  start();
}
