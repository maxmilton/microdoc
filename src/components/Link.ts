import { h, S1Node } from 'stage1';

export interface LinkProps {
  title: string;
  href: string;
}

export type LinkComponent = S1Node & HTMLLIElement;

type RefNodes = {
  a: HTMLAnchorElement;
};

const view = h`
  <li>
    <a #a class="microdoc-sidebar-item link-button w100"></a>
  </li>
`;

export function Link(item: LinkProps): LinkComponent {
  const root = view.cloneNode(true) as LinkComponent;
  const { a } = view.collect<RefNodes>(root);

  a.href = item.href;
  a.textContent = item.title;

  return root;
}
