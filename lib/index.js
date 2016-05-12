'use strict';


var throttler = function(options) {
  options = options || {};
  options.maxCalls = options.maxCalls || 1;   // 1 function call
  options.interval = options.interval || 100; // interval 100 milliseconds
  //options.statsInterval = options.statsInterval || 5000; // interval to call onStats()
  options.warnInterval = options.warnInterval || 5000; // interval to call onWarn()
  options.onReject = typeof options.onReject === 'function' ? options.onReject : function() {}; // sanitize
  options.onAccept = typeof options.onAccept === 'function' ? options.onAccept : function() {}; // sanitize
  //options.onStats = typeof options.onStats === 'function' ? options.onStats : function() {}; // sanitize
  options.onWarn = typeof options.onWarn === 'function' ? options.onWarn : function() {}; // sanitize

  var timeout = null;
  var acceptCount = 0;
  //var acceptStatsCount = 0;
  var rejectWarnCount = 0;
  //var rejectStatsCount = 0;

  //setInterval(function () {
  //    options.onStats.call(this, acceptCount, rejectStatsCount); // call onWarn handler
  //    rejectStatsCount = 0;
  //    acceptStatsCount = 0;
  //  },
  //  options.statsInterval
  //);

  // >>> Main throttle function
  return function(fn /* , arguments */) {

    if (acceptCount === 0) {
      timeout = setTimeout(
        function () {
          timeout = null;
          acceptCount = 0;
        },
        options.interval
      );
    }

    if (acceptCount < options.maxCalls) {
      acceptCount++;
      //acceptStatsCount++;

      // call onAccept handler
      options.onAccept.apply(this, arguments);
      // prepare argument for target function
      var  args = Array.prototype.slice.apply(arguments);
      args.shift();
      // call target function
      return fn.apply(this, args);

    } else { // function already called, prevent calls exceeding maxCalls
      options.onReject.apply(this, arguments); // call onReject handler

      if (rejectWarnCount === 0) {
        setTimeout(function () {
          //if (rejectCount > 0) {
          options.onWarn.call(this, rejectWarnCount); // call onWarn handler
          rejectWarnCount = 0;
          //}
        }, options.warnInterval);
      }
      rejectWarnCount++;
      //rejectStatsCount++;

      return null;
    }

    //

  };
  // <<< Main throttle function

};


module.exports = function(options) { return throttler(options); };
