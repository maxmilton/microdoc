import * as assert from 'uvu/assert';
import { Footer } from '../src/components/Footer';
import { cleanup, describe, render } from './utils';

describe('Footer', (test) => {
  test.after.each(cleanup);

  test('renders correctly', () => {
    const rendered = render(Footer());
    assert.is(rendered.container.firstChild!.nodeName, 'FOOTER');
  });

  test('contains a link to the microdocs docs', () => {
    const rendered = render(Footer());
    assert.ok(rendered.container.querySelector('a[href="https://microdoc.js.org"]'));
  });

  test('matches snapshot', () => {
    const rendered = render(Footer());
    assert.fixture(
      rendered.container.innerHTML,
      `<footer class="microdoc-footer">
Powered by <a href="https://microdoc.js.org" class="microdoc-footer-link" target="_blank" rel="noopener">microdoc</a>
</footer>`,
    );
  });
});
