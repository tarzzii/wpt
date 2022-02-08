'use strict';

test(function (t) {
    const observer = new ComputePressureObserver(function () {
      assert_unreached('This callback should not have been called.')
    });
    let entries = observer.takeRecords();
    assert_equals(entries.length, 0, 'No records before observe');
}, 'records should be empty before starting to observer');

promise_test(async t => {
  let observer;
  const update = await new Promise((resolve, reject) => {
    observer = new ComputePressureObserver(resolve);
    t.add_cleanup(() => observer.disconnect());
    observer.observe(["cpu"], {cpuUtilizationThresholds: [0.25], cpuSpeedThresholds: [0.75]}).catch(reject);
  });

  assert_in_array(update.cpuUtilization, [0.125, 0.625],
                  'cpuUtilization quantization');
  assert_in_array(update.cpuSpeed, [0.375, 0.875], 'cpuSpeed quantization');
  const entry = observer.takeRecords();

  assert_equals(update.cpuUtilization, entry[0].cpuUtilization);
  assert_equals(update.cpuSpeed, entry[0].cpuSpeed);
}, 'ComputePressureObserver quantizes utilization and speed separately');
