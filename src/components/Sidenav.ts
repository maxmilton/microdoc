import { append, h, S1Node } from 'stage1';
import type { InternalRoute } from '../types';
import { Footer } from './Footer';
import { SidenavLink } from './SidenavLink';
import { SidenavParent } from './SidenavParent';

type SidenavComponent = S1Node & HTMLDivElement;

type RefNodes = {
  nav: HTMLElement;
  ul: HTMLUListElement;
};

const view = h`
  <aside class=microdoc-sidenav>
    <div class=microdoc-sidenav-stick>
      <nav #nav class=microdoc-sidenav-scroll>
        <ul #ul class=microdoc-sidenav-list></ul>
      </nav>
    </div>
  </aside>
`;

export function Sidenav(): SidenavComponent {
  const root = view as SidenavComponent;
  const { nav, ul } = view.collect<RefNodes>(root);

  const attachRoutes = (routes: InternalRoute[], parent: HTMLElement) => {
    let item;

    routes.forEach((route) => {
      if (route.children) {
        item = SidenavParent(route.name);
        attachRoutes(route.children, item);
      } else {
        item = SidenavLink(route.name, route.path!);
      }
      // eslint-disable-next-line no-param-reassign
      route.ref = append(item, parent);
    });
  };

  attachRoutes(window.microdoc.routes as InternalRoute[], ul);

  append(Footer(), nav);

  return root;
}
