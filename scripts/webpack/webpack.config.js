const devConfig = require("./config/webpack.dev.config");
const prodConfig = require("./config/webpack.prod.config");
const getEnv = require("../tools/getEnv");

const env = getEnv();

if (env === "dev") {
  module.exports = devConfig;
} else {
  module.exports = prodConfig;
}
