const test = require('tape');
const intp = require('../interval.js').intp;

test('inteval parsing works', function(t) {
  t.equal(intp('1'), 1, '1 should be 1 per second');
  t.equal(intp('1/s'), 1, '1/s should be 1 per second');
  t.equal(intp('2/s'), 2, '2/s should be 2 per second');
  t.equal(intp('1/1s'), 1, '1/1s should be 1 per second');
  t.equal(intp('1/2s'), 1/2, '1/2s should be .5 per second');
  t.equal(intp('1/m'), 1/60, '1/m should be 1 per 60 seconds');
  t.equal(intp('1/h'), 1/3600, '1/h should be 1 per 3600 seconds');
  t.equal(intp('1/d'), 1/(24*3600), '1/d should be 1 per 86400 seconds');

  t.equal(intp('sadf'), -1, 'nonsense input should return -1');
  t.equal(intp('1/c'), -1, 'nonsense unit should return -1');
  t.equal(intp('1/2c'), -1, 'nonsense unit should return -1');
  t.equal(intp('1s'), -1, 'unit but no slash should return -1');
  t.end();
});
