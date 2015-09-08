// Generated by CoffeeScript 1.8.0

/*
CC API JS Helper

Copyright (c) 2015 Scott Yang

Dependencies:
CC Core (cc.core.js)
CC Prompt (cc.prompt.js)
jQuery (Ver 1.11+)
Q (Ver 1.x)
 */

(function() {
  (function(global) {
    "use strict";

    /*
    	Posts to CC API
    
    	@param params JSON object of key => value
    	@return Promise
    
    	Example:
    	CC = new CarCrashSingletonClass({foo: 'bar'})
    	CC.api({'method': 'POST', 'action': '/user/login', 'data': {'user': 'guest', 'password': 'pass'}})
     */
    global.CarCrashSingletonClass.prototype.api = function(params) {
      var deferred, me;
      me = this;
      deferred = Q.defer();
      $.ajax({
        type: params.method,
        url: params.action,
        data: params.data,
        dataType: "json",
        cache: false,
        success: function(resp) {
          var apiError;
          if (typeof resp.success !== "undefined" && resp.success) {
            deferred.resolve(resp);
          } else {
            apiError = me.composeApiError(resp);
            deferred.reject(apiError);
          }
        },
        error: function(xhr, textStatus, errorThrown) {
          var error;
          error = new Error("Network request failed.");
          error.textStatus = textStatus;
          error.errorThrown = errorThrown;
          deferred.reject(error);
        }
      });
    };

    /*
    	Compose AJAX error message using resp.errors
    
    	@param resp Ajax response
     */
    global.CarCrashSingletonClass.prototype.composeApiError = function(resp) {
      var displayedError, error, _i, _len, _ref;
      if (typeof resp.errors !== "undefined" && resp.errors) {
        displayedError = "API errors occurred: <br>";
        _ref = resp.errors;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          error = _ref[_i];
          displayedError += error.code + ": " + error.message + "<br>";
        }
      } else {
        displayedError = "General API error occurred.";
      }
      return displayedError;
    };
  })(window);

}).call(this);

//# sourceMappingURL=cc.api.js.map
