import { h, S1Node } from 'stage1';

export type HeaderComponent = S1Node & HTMLElement;

type RefNodes = {
  a: HTMLAnchorElement;
};

const view = h`
  <header class="microdoc-header dfc pa2">
    <a #a href=/ class="microdoc-logo text"></a>
  </header>
`;

export function Header(): HeaderComponent {
  const root = view as HeaderComponent;
  const { a } = view.collect<RefNodes>(root);

  a.textContent = window.microdoc.title;

  return root;
}
