/* eslint-disable import/no-extraneous-dependencies, no-console */

// TODO: Write tests to verify each feature of the app works

import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
  setup,
  teardown,
  renderPage,
  cleanupPage,
  TestContext,
  sleep,
} from './utils';

const test = suite<TestContext>('e2e');

// FIXME: Use hooks normally once issue is fixed -- https://github.com/lukeed/uvu/issues/80
// test.before(setup);
// test.after(teardown);
// test.after.each(cleanupPage);
test.before(async (context) => {
  try {
    await setup(context);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
test.after(async (context) => {
  try {
    await teardown(context);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
test.after.each(async (context) => {
  try {
    await cleanupPage(context);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

test('renders a basic microdoc app', async (context) => {
  context.fixture = 'docs1';
  await renderPage(context);
  assert.ok(await context.page.$('#alert'), 'has #alert element');
  assert.ok(await context.page.$('.docs-header'), 'has .docs-header element');
  assert.ok(await context.page.$('.docs-logo'), 'has .docs-logo element');
  assert.ok(
    await context.page.$('.docs-sidebar-wrapper'),
    'has .docs-sidebar-wrapper element',
  );
  assert.ok(
    await context.page.$('.docs-sidebar-wrapper'),
    'has .docs-sidebar-wrapper element',
  );
  assert.ok(await context.page.$('.docs-sidebar'), 'has .docs-sidebar element');
  assert.ok(await context.page.$('.docs-footer'), 'has .docs-footer element');
  assert.ok(await context.page.$('.docs-main'), 'has .docs-main element');
  assert.ok(await context.page.$('.docs-page'), 'has .docs-page element');
  assert.ok(
    await context.page.$('a[href="https://microdoc.js.org"]'),
    'has link to microdoc docs',
  );
  await sleep(200);
  assert.is(context.unhandledErrors.length, 0, 'zero unhandled errors');
  assert.is(context.consoleMessages.length, 0, 'zero console messages');
});

test.run();
