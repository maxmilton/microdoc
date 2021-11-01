import { h, S1Node } from 'stage1';

export type SidebarLinkComponent = S1Node & HTMLLIElement;

type RefNodes = {
  a: HTMLAnchorElement;
};

const view = h`
  <li class=microdoc-sidebar-link>
    <a #a class="microdoc-sidebar-item link-button w100"></a>
  </li>
`;

export function SidebarLink(title: string, href: string): SidebarLinkComponent {
  const root = view.cloneNode(true) as SidebarLinkComponent;
  const { a } = view.collect<RefNodes>(root);

  a.href = href;
  a.textContent = title;

  return root;
}
