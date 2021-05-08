import { h, S1Node } from 'stage1';

export type FooterComponent = S1Node & HTMLDivElement;

const view = h`
  <footer class="docs-footer mt5 muted fss tc">
    Powered by <a href=https://maxmilton.github.io/microdoc class=muted rel=noreferrer>microdoc</a>
  </footer>
`;

export function Footer(): FooterComponent {
  const root = view as FooterComponent;
  return root;
}
