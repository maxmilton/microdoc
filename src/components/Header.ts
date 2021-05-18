import { h, S1Node } from 'stage1';

export type HeaderComponent = S1Node & HTMLElement;

type RefNodes = {
  name: HTMLHeadingElement;
};

const view = h`
  <header class="udoc-header dfc pa2">
    <a href=/ class="udoc-logo dib text">
      <h2 #name class=mv0></h2>
    </a>
  </header>
`;

export function Header(): HeaderComponent {
  const root = view as HeaderComponent;
  const { name } = view.collect<RefNodes>(root);

  name.textContent = window.microdoc.title;

  return root;
}
