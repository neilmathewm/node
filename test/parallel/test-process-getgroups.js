'use strict';
const common = require('../common');

// Check `id -G` and `process.getgroups()` return same groups.

if (common.isOSX) {
  common.skip('Output of `id -G` is unreliable on Darwin.');
  return;
}
const assert = require('assert');
const exec = require('child_process').exec;

if (typeof process.getgroups === 'function') {
  const groups = unique(process.getgroups());
  assert(Array.isArray(groups));
  assert(groups.length > 0);
  exec('id -G', function(err, stdout) {
    assert.ifError(err);
    const real_groups = unique(stdout.match(/\d+/g).map(Number));
    assert.deepStrictEqual(groups, real_groups);
    check(groups, real_groups);
    check(real_groups, groups);
  });
}

function check(a, b) {
  for (let i = 0; i < a.length; ++i) assert.notStrictEqual(b.indexOf(a[i]), -1);
}

function unique(groups) {
  return [...new Set(groups)].sort();
}
