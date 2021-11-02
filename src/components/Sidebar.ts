import { append, h, S1Node } from 'stage1';
import type { InternalRoute } from '../types';
import { Footer } from './Footer';
import { SidebarLink } from './SidebarLink';
import { SidebarParent } from './SidebarParent';

type SidebarComponent = S1Node & HTMLDivElement;

type RefNodes = {
  nav: HTMLElement;
  ul: HTMLUListElement;
};

const view = h`
  <div class=microdoc-sidebar>
    <div class=microdoc-sidebar-stick>
      <nav #nav class=microdoc-sidebar-scroll>
        <ul #ul class="df f-col lsn mv0"></ul>
      </nav>
    </div>
  </div>
`;

export function Sidebar(): SidebarComponent {
  const root = view as SidebarComponent;
  const { nav, ul } = view.collect<RefNodes>(root);

  const attachRoutes = (routes: InternalRoute[], parent: HTMLElement) => {
    let item;

    routes.forEach((route) => {
      if (route.children) {
        item = SidebarParent(route.name);
        attachRoutes(route.children, item);
      } else {
        item = SidebarLink(route.name, route.path!);
      }
      // eslint-disable-next-line no-param-reassign
      route.ref = append(item, parent);
    });
  };

  attachRoutes(window.microdoc.routes as InternalRoute[], ul);

  append(Footer(), nav);

  return root;
}
