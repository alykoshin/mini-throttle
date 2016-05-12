'use strict';


var throttler = function(options) {
  options = options || {};
  options.maxCalls = options.maxCalls || 1;   // 1 function call
  options.interval = options.interval || 100; // interval 100 milliseconds

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
      var  args = Array.prototype.slice.apply(arguments);
      args.shift();
      fn.apply(this, args);
      count++;

    } else { // function already called, prevent calls exceeding maxCalls
      //options.

    }

  };

};


module.exports = function(options) { return throttler(options); };
