import { h, S1Node } from 'stage1';

export type HeaderComponent = S1Node & HTMLElement;

type RefNodes = {
  button: HTMLButtonElement;
  a: HTMLAnchorElement;
};

// https://github.com/tailwindlabs/heroicons/blob/master/optimized/outline/menu.svg
const view = h(`
  <header class=microdoc-header>
    <button class="microdoc-button-menu button-clear" #button>
      <svg viewBox="0 0 24 24" class=microdoc-icon>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <a href=/ class=microdoc-logo #a></a>
  </header>
`);

export function Header(): HeaderComponent {
  const root = view as HeaderComponent;
  const { button, a } = view.collect<RefNodes>(root);

  a.textContent = window.microdoc.title;

  button.__click = () => {
    // TODO: Store and use refs?
    const sidenav = document.querySelector('.microdoc-sidenav')!;
    const cl = sidenav.classList;

    const close = () => {
      cl.remove('open');
      // @ts-expect-error - clean up event handler
      document.body.__click = null;
    };

    if (cl.contains('open')) {
      close();
    } else {
      cl.add('open');
      document.body.__click = ({ target }: MouseEvent & { target: Node }) => {
        if (!sidenav.contains(target) || target.nodeName === 'A') {
          close();
        }
      };
    }
  };

  return root;
}
