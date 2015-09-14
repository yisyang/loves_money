// Generated by CoffeeScript 1.8.0
(function() {
  var controller, createCustomer, formatCustomer, hmacSha1, sha1, uuid;

  hmacSha1 = require('crypto-js/hmac-sha1');

  sha1 = require('crypto-js/sha1');

  uuid = require('uuid');

  controller = {};

  controller.index = function(req, res) {
    res._cc.fail('Invalid route, please use the UI at loves.money or view github source for valid requests.');
  };

  controller.getCustomer = function(req, res) {
    var customers;
    customers = req.app.models.customer;
    customers.findOne({
      uuid: req.params.uuid
    }, function(err, customer) {
      if (err) {
        res._cc.fail('Unable to get customer', {}, err);
        return;
      }
      if (customer) {
        res._cc.success(formatCustomer(req, customer));
      } else {
        res._cc.fail('Customer not found');
      }
    });
  };

  controller.postCustomer = function(req, res) {
    var customers;
    customers = req.app.models.customer;
    customers.findOne().where({
      email: req.body.email
    }).then(function(customer) {
      if (customer) {
        res._cc.fail('Customer email is already in use by an ' + (customer.active ? 'active' : 'inactive') + ' customer');
        throw false;
      }
    }).then(function() {
      return createCustomer(req);
    }).then(function(customer) {
      res._cc.success(formatCustomer(req, customer));
    })["catch"](function(err) {
      if (err) {
        res._cc.fail('Error creating customer', {}, err);
      }
    });
  };

  controller.deleteCustomer = function(req, res) {
    var customers;
    customers = req.app.models.customer;
    customers.findOne({
      uuid: req.params.uuid,
      active: true
    }).then(function(customer) {
      customer.active = false;
      return customer.save();
    }).then(function() {
      res._cc.success();
    })["catch"](function(err) {
      res._cc.fail('Unable to delete customer', {}, err);
    });
  };

  formatCustomer = function(req, customer) {
    var result;
    result = {
      uuid: customer.uuid,
      name: customer.name,
      email: customer.email
    };
    if (req.headers['api-secret'] === req.app.get('config').secret_keys.api_secret) {
      result.customer_secret = customer.customer_secret;
    }
    return result;
  };

  createCustomer = function(req, retriesLeft) {
    var customers, newCustomer;
    if (retriesLeft == null) {
      retriesLeft = 3;
    }
    newCustomer = {
      name: req.body.name,
      email: req.body.email
    };
    newCustomer.uuid = uuid.v4();
    newCustomer.pw_hash = hmacSha1(req.body.pw_hash, newCustomer.uuid + req.app.get('config').secret_keys.db_hash).toString();
    customers = req.app.models.customer;
    return customers.create(newCustomer).then(function(customer) {
      return customer;
    })["catch"](function(err) {
      if (retriesLeft <= 0) {
        throw err;
      }
      return createCustomer(req, retriesLeft - 1);
    });
  };

  module.exports = controller;

}).call(this);

//# sourceMappingURL=customers.js.map
