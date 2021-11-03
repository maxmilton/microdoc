/**
 * Microdoc PrevNext Plugin
 *
 * @see https://microdoc.js.org/#/plugins/prevnext.md
 * docs/plugins/prevnext.md
 */

// TODO: The way this currently works is somewhat inefficient and should be refactored

import type { InternalMicrodoc } from '../types';

const { $routes, h, append } = window.microdoc as InternalMicrodoc;

const currentRouteIndex = () => [...$routes.values()].findIndex((route) => route.ref!.classList.contains('active'));

type RefNodes = {
  p: HTMLButtonElement;
  n: HTMLButtonElement;
};

const view = h`
  <div class=microdoc-prevnext>
    <button #p class=microdoc-button-prev>Previous</button>
    <button #n class=microdoc-button-next>Next</button>
  </div>
`;

function PrevNext() {
  const root = view;
  const { p, n } = view.collect<RefNodes>(root);

  const toggleDisable = () => {
    const index = currentRouteIndex();
    p.disabled = index === 0;
    n.disabled = index === $routes.size - 1;
  };

  p.__click = () => {
    window.location.hash = [...$routes.keys()][currentRouteIndex() - 1];
  };
  n.__click = () => {
    window.location.hash = [...$routes.keys()][currentRouteIndex() + 1];
  };

  window.addEventListener('hashchange', toggleDisable);
  toggleDisable();

  return root;
}

append(PrevNext(), document.querySelector('.microdoc-main')!);
