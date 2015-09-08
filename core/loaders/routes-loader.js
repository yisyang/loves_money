// Generated by CoffeeScript 1.8.0
(function() {
  var RoutesGroupFactory, RoutesLoader, path, walk,
    __hasProp = {}.hasOwnProperty;

  walk = require('fs-walk');

  path = require("path");

  RoutesGroupFactory = require('../factories/router-factory.js');

  RoutesLoader = {};

  RoutesLoader.routers = [];

  RoutesLoader.loadRoutes = function(routesDir) {
    walk.walkSync(routesDir, function(basedir, filename, stat) {
      var re;
      re = /(?:\.([^.]+))?$/;
      if ((filename.indexOf(".") !== 0) && (filename.indexOf("_") !== 0) && (re.exec(filename)[1] === "json")) {
        return RoutesLoader.routers.push(RoutesGroupFactory.createRouter(path.join(basedir, filename)));
      }
    });
    return RoutesLoader;
  };

  RoutesLoader.registerRoutes = function(app) {
    var key, router, _ref;
    _ref = this.routers;
    for (key in _ref) {
      if (!__hasProp.call(_ref, key)) continue;
      router = _ref[key];
      router.registerRoutes(app);
    }
  };

  module.exports = RoutesLoader;

}).call(this);

//# sourceMappingURL=routes-loader.js.map
