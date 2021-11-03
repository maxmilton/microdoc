import { h, S1Node } from 'stage1';

type SidebarParentComponent = S1Node & HTMLUListElement;

type RefNodes = {
  button: HTMLButtonElement;
  t: HTMLDivElement;
};

// https://github.com/tailwindlabs/heroicons/blob/master/src/outline/chevron-right.svg
const view = h`
  <ul class=microdoc-sidebar-parent>
    <button #button class="microdoc-sidebar-item button-link dfc">
      #t
      <svg viewBox="0 0 24 24" class="microdoc-icon ml-auto">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </ul>
`;

export function SidebarParent(title: string): SidebarParentComponent {
  const root = view.cloneNode(true) as SidebarParentComponent;
  const { button, t } = view.collect<RefNodes>(root);

  t.textContent = title;

  button.__click = () => {
    root.classList.toggle('expanded');
  };

  return root;
}
