import { h, S1Node } from 'stage1';
// import { reuseNodes } from 'stage1/dist/reconcile/reuse-nodes';
import { routeMap } from '../router';
import { append, create } from '../utils';
import { Link } from './Link';

type SectionComponent = HTMLHeadingElement;

const sectionView = create('h2');

// TODO: Move somewhere better
function Section(title: string): SectionComponent {
  const root = sectionView.cloneNode(true) as SectionComponent;

  root.className = 'docs-menu-section';
  root.textContent = title;

  return root;
}

// TODO: Currently active menu item should have extra CSS class

type SidebarComponent = S1Node & HTMLDivElement;

type RefNodes = {
  list: HTMLDivElement;
};

const view = h`
  <div class=docs-sidebar-wrapper>
    <nav class="docs-sidebar pos-s t0 pa2">
      <div class="df f-col" #list></div>
    </nav>
  </div>
`;

export function Sidebar(): SidebarComponent {
  const root = view as SidebarComponent;
  const { list } = view.collect<RefNodes>(root);

  for (const [path, route] of routeMap.entries()) {
    const menuitem = route.section
      ? Section(route.name)
      : Link({
        title: route.name,
        href: path,
      });

    append(menuitem, list);
  }

  return root;
}
