// Generated by CoffeeScript 1.8.0
(function() {
  var AuthJwt, eh, jwt;

  eh = require('../../core/handlers/error-handler.js');

  jwt = require('jsonwebtoken');

  AuthJwt = (function() {
    function AuthJwt() {}

    AuthJwt.verify = function(req, res, next) {
      var err, parsed, token, _ref, _ref1;
      if (((_ref = req.headers.authorization) != null ? _ref.substring(0, 7) : void 0) !== 'Bearer ') {
        res.fail('Invalid credentials', 401);
        return;
      }
      token = (_ref1 = req.headers.authorization) != null ? _ref1.substring(7) : void 0;
      try {
        parsed = jwt.verify(token, req.app.get('config').jwt.secret);
        req.app.set('user', parsed);
        next();
      } catch (_error) {
        err = _error;
        if (err.name === 'TokenExpiredError') {
          res.fail('Token expired', 401, null, err);
        } else {
          res.fail('Invalid credentials', 401, null, err);
        }
      }
    };

    AuthJwt.verifyAdmin = function(req, res, next) {
      var currentUser;
      currentUser = req.app.get('user');
      if (!(currentUser != null ? currentUser.isAdmin : void 0)) {
        res.fail('Not authorized', 401);
        return;
      }
      next();
    };

    return AuthJwt;

  })();

  module.exports = AuthJwt;

}).call(this);

//# sourceMappingURL=auth-jwt.js.map
