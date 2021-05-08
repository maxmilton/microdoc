import { h, S1Node } from 'stage1';

export type HeaderComponent = S1Node & HTMLElement;

type RefNodes = {
  name: HTMLHeadingElement;
};

const view = h`
  <header class="docs-header dfc pa2 bg-gold5">
    <a href=/ class="docs-logo dib text">
      <h2 class=mv0 #name></h2>
    </a>
  </header>
`;

export function Header(): HeaderComponent {
  const root = view as HeaderComponent;
  const { name } = view.collect<RefNodes>(root);

  name.textContent = window.microdoc.title;

  return root;
}
