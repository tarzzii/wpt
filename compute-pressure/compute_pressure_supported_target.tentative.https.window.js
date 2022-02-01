'use strict';

promise_test(async t => {
  // Compute Pressure should only support "cpu" as target

  const target = ComputePressureObserver.supportedTargetTypes;

  assert_equals(target.length, 1);
  assert_equals(target[0], 'cpu');
}, 'ComputePressureObserver support should be "cpu" only');
