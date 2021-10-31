import { append, h, S1Node } from 'stage1';
import type { InternalRoute } from '../types';
import { Footer } from './Footer';
import { Link } from './Link';

type SectionComponent = S1Node & HTMLUListElement;

type SectionRefNodes = {
  btn: HTMLButtonElement;
  t: HTMLDivElement;
};

// https://github.com/tailwindlabs/heroicons/blob/master/src/outline/chevron-right.svg
const sectionView = h`
  <ul class="microdoc-sidebar-section lsn">
    <button #btn class="microdoc-sidebar-item button-link dfc w100">
      #t
      <svg viewBox="0 0 24 24" class="icon ml-auto">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </ul>
`;

// TODO: Move somewhere better
function Section(title: string): SectionComponent {
  const root = sectionView.cloneNode(true) as SectionComponent;
  const { btn, t } = sectionView.collect<SectionRefNodes>(root);

  t.textContent = title;

  btn.__click = () => {
    root.classList.toggle('expanded');
  };

  return root;
}

// TODO: Currently active menu item should have extra CSS class

type SidebarComponent = S1Node & HTMLDivElement;

type RefNodes = {
  list: HTMLDivElement;
};

const view = h`
  <div class=microdoc-sidebar-wrapper>
    <nav class=microdoc-sidebar>
      <ul #list class="df f-col lsn mv0"></ul>
    </nav>
  </div>
`;

export function Sidebar(): SidebarComponent {
  const root = view as SidebarComponent;
  const { list } = view.collect<RefNodes>(root);

  const attachRoutes = (routes: InternalRoute[], parent: HTMLElement) => {
    let item;

    for (const route of routes) {
      if (route.children) {
        item = Section(route.name);
        attachRoutes(route.children, item);
      } else {
        item = Link({
          title: route.name,
          href: route.path!,
        });
      }
      route.ref = append(item, parent);
    }
  };

  attachRoutes(window.microdoc.routes as InternalRoute[], list);

  append(Footer(), root);

  return root;
}
