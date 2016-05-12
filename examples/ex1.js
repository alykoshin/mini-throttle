/**
 * Created by alykoshin on 12.05.16.
 */

'use strict';

var throttle = require('../')({
  interval: 500,
  warnInterval: 5000,
  maxCalls: 2,
  onAccept: function() { accepted++; },
  onReject: function() { rejected++; },
  onWarn:   function(rejectedCount) { console.log('onWarn(): rejectedCount: '+rejectedCount); },
  //onStats:   function(acceptCount, rejectedCount) { console.log('onStats(): '+acceptCount+', rejectedCount: '+rejectedCount); },
});


var startTime = new Date(); // remember start time
var count = 0;
var accepted = 0, rejected = 0;


// Test function to be called through throttling function

var fn = function(i, start) {
  console.log('            | ' + prefix(i) + timeDiff(new Date(), start));
};


// Call test function several times (with regular intervals)

var delayedTest = function() {
  setTimeout(

    function() {
      var now = new Date();
      console.log('' + prefix(count) + timeDiff(now, startTime) + '  |');
      throttle(fn, count, now);
      count++;
      if (count >= 10) {
        console.log('Accepted: '+ accepted+', rejected: '+rejected+' calls.');
        return;
      }
      delayedTest();
    },

    100
  );
};

// Aux output formatting functions

var prefix = function(i) {
  return '['+lpad(i,2,'0')+'] ';
};

var lpad = function(s, l, c) {
  if (typeof s === 'number') { s = '' + s; }
  while(s.length<l) { s = (c || ' ')+s; }
  return s;
};

var timeDiff = function(now, start) {
  var diff = (now - start).toString();
  return lpad('+'+diff, 5, 0);
};


// Banner

console.log('        Throttling      ');
console.log('------------+-----------');
console.log(' Before     | After     ');
console.log('----+-------+----+------');
console.log(' No | Time  | No | Time ');
console.log('----+-------+-----------');


// Try to call the function with some interval

//for (var i=0; i<10; i++) {
//
//  delayedTest(i);
//
//}

delayedTest(count);
