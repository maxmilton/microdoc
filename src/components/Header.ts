import h, { HNode } from 'stage0';

export type HeaderComponent = HNode<HTMLElement>;

interface RefNodes {
  name: HTMLHeadingElement;
}

const view = h`
  <header class="docs-header dfc pa2 bg-gold5">
    <a href=/ class="docs-logo dib text">
      <h2 class=mv0 #name></h2>
    </a>
  </header>
`;

export function Header(): HeaderComponent {
  const root = view as HeaderComponent;
  const { name } = view.collect(root) as RefNodes;

  name.textContent = window.microdoc.title;

  return root;
}
