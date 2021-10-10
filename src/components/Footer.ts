import { h, S1Node } from 'stage1';

export type FooterComponent = S1Node & HTMLDivElement;

const view = h`
  <footer class="udoc-footer muted">
    Powered by <a href=https://microdoc.js.org class=muted target=_blank rel=noreferrer>microdoc</a>
  </footer>
`;

export function Footer(): FooterComponent {
  const root = view as FooterComponent;
  return root;
}
