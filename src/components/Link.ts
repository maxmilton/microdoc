// import { h } from 'stage1';
import { create } from '../utils';

export interface LinkProps {
  title: string;
  href: string;
}

// export type LinkComponent = S1Node & HTMLAnchorElement;
export type LinkComponent = HTMLAnchorElement;

// type RefNodes = {
//   title: Text;
// }

// TODO: If we never add more elements (e.g., for accordion menu items) use a
// simple document.createElement
// const view = h`
//   <a>#title</a>
// `;
const view = create('a');

export function Link(item: LinkProps): LinkComponent {
  const root = view.cloneNode(true) as LinkComponent;
  // const { title } = view.collect<RefNodes>(root);

  root.href = item.href;
  // root.title = item.title;
  // title.nodeValue = item.title;
  root.textContent = item.title;

  return root;
}
