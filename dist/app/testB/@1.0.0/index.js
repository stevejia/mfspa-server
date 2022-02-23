(() => {
  "use strict";
  var t = {
      968: (t, e, n) => {
        Object.defineProperty(e, "__esModule", { value: !0 });
        var i = n(13),
          a = (function () {
            function t() {
              (this.id = null),
                (this.subs = []),
                (this.id = new Date()),
                (this.subs = []);
            }
            return (
              (t.prototype.defined = function (e, n) {
                t.watch || (t.watch = new i.default(e, n)),
                  t.watch.add(this),
                  (t.watch = null);
              }),
              (t.prototype.notify = function () {
                this.subs.forEach(function (t, e) {
                  if ("function" == typeof t.update)
                    try {
                      t.update.apply(t);
                    } catch (t) {
                      console.warn(t);
                    }
                });
              }),
              t
            );
          })();
        e.default = a;
      },
      917: (t, e, n) => {
        var i,
          a = n(968),
          o =
            ((i = new a.default()),
            function (t) {
              if ("historychange" === t)
                return function (t, e) {
                  i.defined(t, e), (a.default.watch = null);
                };
              if ("pushState" === t || "replaceState" === t) {
                var e = window.history[t];
                return function () {
                  e.apply(window.history, arguments), i.notify();
                };
              }
            });
        (window.addHistoryListener = o("historychange")),
          (window.history.pushState = o("pushState")),
          (window.history.replaceState = o("replaceState"));
      },
      13: (t, e) => {
        Object.defineProperty(e, "__esModule", { value: !0 });
        var n = (function () {
          function t(t, e) {
            (this.callBack = function () {}),
              (this.name = t),
              (this.id = new Date().getTime()),
              (this.callBack = e);
          }
          return (
            (t.prototype.add = function (t) {
              t.subs.push(this);
            }),
            (t.prototype.update = function () {
              (0, this.callBack)(this.name);
            }),
            t
          );
        })();
        e.default = n;
      },
    },
    e = {};
  !(function n(i) {
    var a = e[i];
    if (void 0 !== a) return a.exports;
    var o = (e[i] = { exports: {} });
    return t[i](o, o.exports, n), o.exports;
  })(917);
})();
(function () {
  // window.commonRouter = {
  //   route(path) {
  //     window.mfspa.router.route(path);
  //   },
  // };

  document.querySelector("#mfspa-root").innerHTML = `<div><div>testB</div>
    <button id="go-testA" type="button">go testA</button>
  </div>`;

  // document.querySelector("#go-testA").onclick = function (e) {
  //   window.commonRouter.route("/app/testA/module1/page2?id=333&name=test");
  // };

  // const testBConstant = "testB constant";

  // var testB = "33333333";

  const container = document.querySelector("#mfspa-root");

  const prefix = "/app/testB";

  const routes = [
    {
      path: "/module1/page2",
      callback: function () {
        container.innerHTML = `<div><div>testB page2</div>
                                  <button id="go-page3" type="button">go page3</button>
                                  <button id="go-testA" type="button">go testA</button>
                                </div>`;
        const page3Btn = container.querySelector("#go-page3");
        page3Btn.onclick = function (e) {
          routeTo("/module1/page3?id=page3");
        };
        const testABtn = container.querySelector("#go-testA");
        testABtn.onclick = function (e) {
          routeTo("/app/testA/module1/page2?id=page3");
        };
      },
    },
    {
      path: "/module1/page3",
      callback: function () {
        container.innerHTML = `<div><div>testB page3</div>
                                  <button id="go-page2" type="button">go page2</button>
                                  <button id="go-testA" type="button">go testA</button>
                                </div>`;
        const page2Btn = container.querySelector("#go-page2");
        page2Btn.onclick = function (e) {
          routeTo("/module1/page2?id=page3");
        };

        const testABtn = container.querySelector("#go-testA");
        testABtn.onclick = function (e) {
          routeTo("/app/testA/module1/page2?id=page3");
        };
      },
    },
  ];

  function routeTo(path) {
    const appIsCurrent = isCurrentApp(path);
    if (appIsCurrent) {
      path = path.indexOf(prefix) === -1 ? `${prefix}${path}` : path;
    }
    window.history.pushState({ path }, "", path);
  }

  function isCurrentApp(path) {
    const isNotCurrentApp =
      path.indexOf("app/") > -1 && path.indexOf(prefix) === -1;
    return !isNotCurrentApp;
  }

  function route(path) {
    const appIsCurrent = isCurrentApp(path);
    if (!appIsCurrent) {
      return;
    }
    const route = matchRoute(path);
    if (!!route) {
      route.callback();
    }
  }

  window.addHistoryListener("historyChange", function () {
    console.log("testB history change");
    const { origin, href } = window.location;
    const path = href.split(origin)[1];
    route(path);
  });

  // 当用户点击前进后退按钮时触发函数
  window.addEventListener(
    "popstate",
    function () {
      console.log("testB popstate");
      const { origin, href } = window.location;
      const path = href.split(origin)[1];
      window.history.replaceState({ path }, "", path);
    },
    false
  );

  function matchRoute(path) {
    const route = routes.find((route) => path.indexOf(route.path) > -1);
    return route;
  }

  const { origin, href } = window.location;
  const path = href.split(origin)[1];

  window.history.pushState({ path }, "", path);
})();
