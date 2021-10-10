/* eslint-disable no-console, unicorn/no-process-exit */

import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
  mocksSetup, mocksTeardown, setup, teardown,
} from './utils';

// FIXME: Use hooks normally once issue is fixed -- https://github.com/lukeed/uvu/issues/80
// test.before.each(setup);
// test.before.each(mocksSetup);
// test.after.each(mocksTeardown);
// test.after.each(teardown);
test.before.each(() => {
  try {
    setup();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
test.before.each(() => {
  try {
    mocksSetup();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
test.after.each(() => {
  try {
    mocksTeardown();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
test.after.each(() => {
  try {
    teardown();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

test('renders microdoc core app', () => {
  // eslint-disable-next-line import/extensions, global-require
  require('../microdoc.js');

  // TODO: Better assertions
  assert.is(document.body.innerHTML.length > 450, true, 'body has content');
  const firstNode = document.body.firstChild as HTMLDivElement;
  assert.instance(firstNode, window.HTMLDivElement);
  assert.is(firstNode.id, 'app', 'first element id=app');
});

// TODO: Test app renders with each plugin and with all plugins
// TODO: Test app render with various configs

test.run();
