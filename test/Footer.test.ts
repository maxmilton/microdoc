import { test } from 'uvu';
import * as assert from 'uvu/assert';
// import { Footer } from '../src/components/Footer';
import {
  cleanup, render, setup, teardown,
} from './utils';

type FooterComponent = typeof import('../src/components/Footer');

test.before(setup);
test.after(teardown);
test.after.each(cleanup);

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
    rendered.container.querySelector(
      'a[href="https://maxmilton.github.io/microdoc"]',
    ),
  );
});

test('matches snapshot', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const { Footer } = require('../src/components/Footer') as FooterComponent;
  const rendered = render(Footer());
  assert.fixture(
    rendered.container.innerHTML,
    `<footer class="docs-footer mt5 muted fss tc">
    Powered by <a href="https://maxmilton.github.io/microdoc" class="muted" rel="noreferrer">microdoc</a>
  </footer>`,
  );
});

test.run();
