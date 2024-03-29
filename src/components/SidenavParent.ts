import { h, type S1Node } from 'stage1';

type SidenavParentComponent = S1Node & HTMLUListElement;

type RefNodes = {
  button: HTMLButtonElement;
  t: HTMLDivElement;
};

// https://github.com/tailwindlabs/heroicons/blob/master/src/outline/chevron-right.svg
const view = h(`
  <ul class=microdoc-sidenav-parent>
    <button class=microdoc-sidenav-item #button>
      #t
      <svg viewBox="0 0 24 24" class=microdoc-icon-chevron>
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </ul>
`);

export function SidenavParent(
  title: string,
  expanded?: boolean,
): SidenavParentComponent {
  const root = view.cloneNode(true) as SidenavParentComponent;
  const { button, t } = view.collect<RefNodes>(root);

  t.textContent = title;

  if (expanded) {
    root.classList.add('expanded');
  }

  button.__click = () => {
    root.classList.toggle('expanded');
  };

  return root;
}
