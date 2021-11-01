import { append, h, S1Node } from 'stage1';
import type { InternalRoute } from '../types';
import { Footer } from './Footer';
import { SidebarLink } from './SidebarLink';
import { SidebarParent } from './SidebarParent';

type SidebarComponent = S1Node & HTMLDivElement;

type RefNodes = {
  ul: HTMLUListElement;
};

const view = h`
  <div class=microdoc-sidebar-wrapper>
    <nav class=microdoc-sidebar>
      <ul #ul class="df f-col lsn mv0"></ul>
    </nav>
  </div>
`;

export function Sidebar(): SidebarComponent {
  const root = view as SidebarComponent;
  const { ul } = view.collect<RefNodes>(root);

  const attachRoutes = (routes: InternalRoute[], parent: HTMLElement) => {
    let item;

    routes.forEach((route) => {
      if (route.children) {
        item = SidebarParent(route.name);
        attachRoutes(route.children, item);
      } else {
        item = SidebarLink({
          title: route.name,
          href: route.path!,
        });
      }
      // eslint-disable-next-line no-param-reassign
      route.ref = append(item, parent);
    });
  };

  attachRoutes(window.microdoc.routes as InternalRoute[], ul);

  append(Footer(), root);

  return root;
}
