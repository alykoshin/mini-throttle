'use strict';


var throttler = function(options) {
  options = options || {};
  options.maxCalls = options.maxCalls || 1;   // 1 function call
  options.interval = options.interval || 100; // interval 100 milliseconds
  options.onReject = typeof options.onReject === 'function' ? options.onReject : function() {}; // sanitize
  options.onAccept = typeof options.onAccept === 'function' ? options.onAccept : function() {}; // sanitize

  var timeout = null;
  var count = 0;

  // Main throttle function

  return function(fn /* , arguments */) {

    if (count === 0) {
      //if (!timeout) {
      //  if (count < options.maxCalls) { // maxCalls reached,
          timeout = setTimeout(
            function () {
              timeout = null;
              count   = 0;
            },
            options.interval
          );
        //}
      //}
    }

    if (count < options.maxCalls) {
      count++;
      // call onAccept handler
      options.onAccept.apply(this, arguments);
      // prepare argument for target function
      var  args = Array.prototype.slice.apply(arguments);
      args.shift();
      // call target function
      return fn.apply(this, args);

    } else { // function already called, prevent calls exceeding maxCalls
      options.onReject.apply(this, arguments); // call onReject handler
    }

  };

};


module.exports = function(options) { return throttler(options); };
