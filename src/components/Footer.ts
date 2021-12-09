import { h, S1Node } from 'stage1';

export type FooterComponent = S1Node & HTMLDivElement;

const view = h(`
  <footer class=microdoc-footer>
    Powered by <a href=https://microdoc.js.org class=microdoc-footer-link target=_blank rel=noopener>microdoc</a>
  </footer>
`);

export function Footer(): FooterComponent {
  const root = view as FooterComponent;
  return root;
}
