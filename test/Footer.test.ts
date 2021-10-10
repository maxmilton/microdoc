/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console, unicorn/no-process-exit */

import { test } from 'uvu';
import * as assert from 'uvu/assert';
// import { Footer } from '../src/components/Footer';
import {
  cleanup,
  mocksSetup,
  mocksTeardown,
  render,
  setup,
  teardown,
} from './utils';

type FooterComponent = typeof import('../src/components/Footer');

// FIXME: Use hooks normally once issue is fixed -- https://github.com/lukeed/uvu/issues/80
// test.before(setup);
// test.before(mocksSetup);
// test.after(mocksTeardown);
// test.after(teardown);
// test.after.each(cleanup);
test.before(() => {
  try {
    setup();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
test.before(() => {
  try {
    mocksSetup();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
test.after(() => {
  try {
    mocksTeardown();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
test.after(() => {
  try {
    teardown();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
test.after.each(() => {
  try {
    cleanup();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

test('renders correctly', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const { Footer } = require('../src/components/Footer') as FooterComponent;
  const rendered = render(Footer());
  assert.is(rendered.container.firstChild!.nodeName, 'FOOTER');
});

test('contains a link to the microdocs docs', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const { Footer } = require('../src/components/Footer') as FooterComponent;
  const rendered = render(Footer());
  assert.ok(
    rendered.container.querySelector('a[href="https://microdoc.js.org"]'),
  );
});

test('matches snapshot', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const { Footer } = require('../src/components/Footer') as FooterComponent;
  const rendered = render(Footer());
  assert.fixture(
    rendered.container.innerHTML,
    `<footer class="udoc-footer muted">
Powered by <a href="https://microdoc.js.org" class="muted" target="_blank" rel="noreferrer">microdoc</a>
</footer>`,
  );
});

test.run();
