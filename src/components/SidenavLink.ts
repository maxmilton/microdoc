import { h, type S1Node } from 'stage1';

export type SidenavLinkComponent = S1Node & HTMLLIElement;

type RefNodes = {
  a: HTMLAnchorElement;
};

const view = h(`
  <li class=microdoc-sidenav-link>
    <a class=microdoc-sidenav-item #a></a>
  </li>
`);

export function SidenavLink(title: string, href: string): SidenavLinkComponent {
  const root = view.cloneNode(true) as SidenavLinkComponent;
  const { a } = view.collect<RefNodes>(root);

  a.href = href;
  a.textContent = title;

  return root;
}
