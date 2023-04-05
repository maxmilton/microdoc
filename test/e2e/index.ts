/* eslint-disable no-console, unicorn/no-process-exit */

// TODO: Write tests to verify each feature of the app works

import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
  cleanupPage,
  renderPage,
  setup,
  sleep,
  teardown,
  type TestContext,
} from './utils';

const test = suite<TestContext>('e2e');

// FIXME: Use hooks normally once issue is fixed -- https://github.com/lukeed/uvu/issues/80
// test.before(setup);
// test.after(teardown);
// test.after.each(cleanupPage);
test.before(async (context) => {
  try {
    await setup(context);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
test.after(async (context) => {
  try {
    await teardown(context);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
test.after.each(async (context) => {
  try {
    await cleanupPage(context);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

test('renders a basic microdoc app', async (context) => {
  context.fixture = 'docs1';
  await renderPage(context);
  assert.ok(
    await context.page.$('.microdoc-header'),
    'has .microdoc-header element',
  );
  assert.ok(
    await context.page.$('.microdoc-logo'),
    'has .microdoc-logo element',
  );
  assert.ok(
    await context.page.$('.microdoc-sidenav'),
    'has .microdoc-sidenav element',
  );
  assert.ok(
    await context.page.$('.microdoc-sidenav-stick'),
    'has .microdoc-sidenav-stick element',
  );
  assert.ok(
    await context.page.$('.microdoc-sidenav-scroll'),
    'has .microdoc-sidenav-scroll element',
  );
  assert.ok(
    await context.page.$('.microdoc-footer'),
    'has .microdoc-footer element',
  );
  assert.ok(
    await context.page.$('.microdoc-main'),
    'has .microdoc-main element',
  );
  assert.ok(
    await context.page.$('.microdoc-page'),
    'has .microdoc-page element',
  );
  assert.ok(
    await context.page.$('a[href="https://microdoc.js.org"]'),
    'has link to microdoc docs',
  );
  await sleep(200);
  assert.is(context.unhandledErrors.length, 0, 'zero unhandled errors');
  assert.is(context.consoleMessages.length, 0, 'zero console messages');
});

test.run();
