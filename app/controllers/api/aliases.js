// Generated by CoffeeScript 1.8.0
(function() {
  var Promise, controller, formatAlias, hmacSha1;

  hmacSha1 = require('crypto-js/hmac-sha1');

  Promise = require('bluebird');

  controller = {};

  controller.getIndex = function(req, res) {
    res._cc.fail('Invalid route, please use the UI at loves.money or view github source for valid requests.');
  };

  controller.getAlias = function(req, res) {
    req.app.getModel('DomainAlias').findOne({
      srcName: req.params.alias
    }, function(err, alias) {
      if (err) {
        res._cc.fail('Unable to get alias', 500, null, err);
      }
      if (alias) {
        res._cc.success(formatAlias(req, alias));
      } else {
        res._cc.fail('Alias not found');
      }
    });
  };

  controller.postAlias = function(req, res) {
    var DomainAlias, currentUser, newAlias, _ref;
    currentUser = req.app.get('user');
    newAlias = {
      customerId: currentUser.id,
      srcName: req.body.alias,
      destDomain: req.body.domain,
      destEmail: req.body.email
    };
    if (!newAlias.srcName || ((_ref = newAlias.srcName) === 'abuse' || _ref === 'admin' || _ref === 'administrator' || _ref === 'billing' || _ref === 'hostmaster' || _ref === 'info' || _ref === 'postmaster' || _ref === 'ssl-admin' || _ref === 'support' || _ref === 'webmaster')) {
      res._cc.fail('Requested alias is reserved');
      return;
    }
    DomainAlias = req.app.getModel('DomainAlias');
    DomainAlias.create(newAlias).then(function(alias) {
      req.app.getModel('VirtualAlias').create({
        domainId: req.app.get('config').mailserver_domain_id,
        source: newAlias.srcName + '@loves.money',
        destination: newAlias.destEmail
      }).then(function() {
        return res._cc.success(formatAlias(req, alias));
      })["catch"](function(err) {
        DomainAlias.destroy({
          id: alias.id
        }, function() {});
        res._cc.fail('Error creating mail alias', 500, null, err);
      });
    })["catch"](function() {
      DomainAlias.findOne().where({
        srcName: newAlias.srcName
      }).then(function(alias) {
        if (alias) {
          res._cc.fail('The alias is already registered');
          throw false;
        }
        return DomainAlias.findOne().where({
          destDomain: newAlias.destDomain
        }).then(function(alias) {
          return alias;
        });
      }).then(function(alias) {
        if (alias) {
          res._cc.fail('The domain is already registered');
          throw false;
        }
        return DomainAlias.findOne().where({
          destEmail: newAlias.destEmail
        }).then(function(alias) {
          return alias;
        });
      }).then(function(alias) {
        if (alias) {
          res._cc.fail('The email is already registered');
          throw false;
        }
      })["catch"](function(err) {
        if (err) {
          res._cc.fail('Error creating alias', 500, null, err);
        }
      });
    });
  };

  controller.deleteAlias = function(req, res) {
    var DomainAlias, _ref;
    if (!req.params.alias || ((_ref = req.params.alias) === 'abuse' || _ref === 'admin' || _ref === 'administrator' || _ref === 'billing' || _ref === 'hostmaster' || _ref === 'info' || _ref === 'postmaster' || _ref === 'ssl-admin' || _ref === 'support' || _ref === 'webmaster')) {
      res._cc.fail('Requested alias is reserved');
      return;
    }
    DomainAlias = req.app.getModel('DomainAlias');
    DomainAlias.findOne().where({
      srcName: req.params.alias
    }).then(function(alias) {
      var currentUser;
      if (!alias) {
        res._cc.fail('Alias not found');
        throw false;
      }
      currentUser = req.app.get('user');
      if (currentUser.id !== alias.customerId && !currentUser.isAdmin) {
        res._cc.fail('You are not the owner of this alias!', 401);
        return;
      }
      req.app.getModel('VirtualAlias').destroy({
        domainId: req.app.get('config').mailserver_domain_id,
        destination: alias.destEmail,
        custom: true
      }).then(function() {
        return DomainAlias.destroy({
          id: alias.id
        });
      }).then(function() {
        res._cc.success();
      })["catch"](function(err) {
        res._cc.fail('Unable to delete alias', 500, null, err);
      });
    })["catch"](function(err) {
      if (err) {
        res._cc.fail('Unable to get alias', 500, null, err);
      }
    });
  };

  controller.deleteAll = function(req, res) {
    var currentUser;
    if (req.app.get('config').env === !'development') {
      res._cc.fail('Forbidden', 403);
      return;
    }
    currentUser = req.app.get('user');
    if (!currentUser.isAdmin) {
      res._cc.fail('Not authorized', 401);
      return;
    }
    req.app.getModel('DomainAlias').query('TRUNCATE TABLE aliases').then(function() {
      return req.app.getModel('VirtualAlias').destroy({
        custom: true
      });
    }).then(function() {
      res._cc.success();
    })["catch"](function(err) {
      if (err) {
        res._cc.fail('Unable to truncate aliases', 500, null, err);
      }
    });
  };

  formatAlias = function(req, alias) {
    var result;
    return result = {
      customerId: alias.customerId,
      alias: alias.srcName,
      domain: alias.destDomain,
      email: alias.destEmail
    };
  };

  module.exports = controller;

}).call(this);

//# sourceMappingURL=aliases.js.map
