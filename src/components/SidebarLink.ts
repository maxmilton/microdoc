import { h, S1Node } from 'stage1';

export interface SidebarLinkProps {
  title: string;
  href: string;
}

export type SidebarLinkComponent = S1Node & HTMLLIElement;

type RefNodes = {
  a: HTMLAnchorElement;
};

const view = h`
  <li class=microdoc-sidebar-link>
    <a #a class="microdoc-sidebar-item link-button w100"></a>
  </li>
`;

export function SidebarLink(item: SidebarLinkProps): SidebarLinkComponent {
  const root = view.cloneNode(true) as SidebarLinkComponent;
  const { a } = view.collect<RefNodes>(root);

  a.href = item.href;
  a.textContent = item.title;

  return root;
}
