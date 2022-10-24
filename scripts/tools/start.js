const webpackConfig = require("../webpack/webpack.config");
const express = require("express");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const mime = require("mime");
const compiler = webpack(webpackConfig);
const getEnv = require("../tools/getEnv");
const duration = 1000;
const env = getEnv();
const start = () => {
  const path = require("path");
  const cwd = process.cwd();
  const dist_dir = path.join(cwd, "dist");
  const app = express();
  //设置跨域访问
  app.all("*", (req, res, next) => {
    const { path: urlPath } = req;
    const isHmr = urlPath?.indexOf("__webpack_hmr") > -1;
    const mimeType = mime.getType(urlPath);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    if (isHmr) {
      res.header("Content-Type", "text/event-stream");
    } else {
      if (!!mimeType) {
        res.header("Content-Type", `${mimeType};"charset=utf-8"`);
      } else {
        res.header("Content-Type", "text/html");
      }
    }

    if (req.method == "POST") {
      res.header("Content-Type", "application/json");
      res.header("Accept", "application/json");
    }

    next();
  });

  app.use(
    devMiddleware(compiler, {
      // publicPath: webpackConfig.output.publicPath,
      stats: {
        colors: true,
      },
    })
  );
  app.use(hotMiddleware(compiler));
  app.get("*", (req, res, next) => {
    const filename = path.join(dist_dir, "index.html");

    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.send(result);
      res.end();
    });
  });
  let listenResult = "";
  app.listen(8077, () => {
    listenResult = "server started on http://localhost:8077";
  });

  compilerDone(() => {
    console.clear();
    console.log(listenResult);
  });
};

const compilerDone = (callback) => {
  compiler.hooks.done.tap("done", (stats) => {
    if (
      stats.compilation.errors &&
      stats.compilation.errors.length &&
      env !== "dev"
    ) {
      console.error(stats.compilation.errors);
      process.exit(1);
    }
    console.log("build sucess");
    setTimeout(() => {
      callback && callback();
    }, duration);
  });
};

module.exports = start;
