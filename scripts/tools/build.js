const webpackConfig = require("../webpack/webpack.config");
const webpack = require("webpack");
const compiler = webpack(webpackConfig);
const build = () => {
  compiler.run((err, result) => {
    console.log(err);
    console.log("打包完成");
    process.exit();
  });
};

module.exports = build;
