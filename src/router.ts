/* eslint-disable no-plusplus */

import { Remarkable } from 'remarkable';
import { create, setupSyntheticEvent } from 'stage1';
import type { InternalRoute, Routes } from './types';
import { toName } from './utils';

const LOADING_DELAY_MS = 176;
const FAKE_BASE_URL = 'http://x';

const md = new Remarkable({
  html: true,
});

md.core.ruler.push(
  'x',
  (state) => {
    const blockTokens = state.tokens;
    const len = blockTokens.length;
    let index = 0;
    let route;

    for (; index < len; index++) {
      const blockToken = blockTokens[index] as Remarkable.BlockContentToken;

      if (blockToken.type === 'inline') {
        const tokens = blockToken.children!;
        const inlineLen = tokens.length;
        let inlineIndex = 0;

        for (; inlineIndex < inlineLen; inlineIndex++) {
          const token = tokens[inlineIndex] as Remarkable.LinkOpenToken;

          if (token.type === 'link_open') {
            if (token.href[0] === '#' && token.href[1] !== '/') {
              // generate href for in-page links (start with # and correspond to
              // an element by id attribute)
              route = route || new URL(window.location.href).hash.slice(1);
              const cleanUrlPath = new URL(route, FAKE_BASE_URL).pathname;
              token.href = `#${cleanUrlPath}${token.href}`;
            } else {
              // leverage URL() to handle relative links with a fake base URL...
              token.href = new URL(token.href, FAKE_BASE_URL).href
                // then convert fake base URL to hash based routing
                .replace(/^http:\/\/x\/(?:#\/)?/, '#/');
            }
          }
        }
      }
    }

    return false;
  },
  {},
);

const $routes = new Map<string, InternalRoute>();
// Expose internal route map for plugin consumers
window.microdoc.$routes = $routes;

export function routeTo(url: string): void {
  window.location.hash = url;
}

// https://github.com/lukeed/navaid/blob/master/src/index.js#L52
function handleClick(event: MouseEvent): void {
  if (
    event.ctrlKey
    || event.metaKey
    || event.altKey
    || event.shiftKey
    || event.button
    || event.defaultPrevented
  ) {
    return;
  }

  const link = (event.target as HTMLElement).closest('a');
  const href = link && link.getAttribute('href');

  if (
    !href
    || link.target
    || link.host !== window.location.host
    || href[0] === '#'
  ) {
    return;
  }

  event.preventDefault();
  routeTo(href);
}

function normaliseRoutes(routes: Routes, parent?: InternalRoute) {
  for (let index = 0; index < routes.length; index++) {
    if (typeof routes[index] === 'string') {
      // eslint-disable-next-line no-param-reassign
      routes[index] = {
        path: routes[index] as string,
      };
    }

    const route = routes[index] as InternalRoute;

    if (parent) {
      route.parent = parent;
    }

    if (route.path) {
      route.path = `${parent?.path ? `${parent.path}/` : '#/'}${route.path}`;
    }

    if (!route.name) {
      if (route.path) {
        route.name = toName(route.path);
      } else {
        // eslint-disable-next-line no-console
        console.error('Invalid route:', route);
        break;
      }
    }

    if (route.children) {
      normaliseRoutes(route.children, route);
    } else {
      $routes.set(route.path!, route);
    }
  }
}

export function setupRouter(): void {
  normaliseRoutes(window.microdoc.routes);

  document.body.__click = handleClick;
  setupSyntheticEvent('click');
}

// const loadingError = (path: string, error: Error) => `
//   <div class="alert alert-danger">
//     <strong>Error:</strong> ${
//   (error.message || error).toString() || 'Unknown error'
// }
//   </div>
//
//   <p>An error occured when loading ${path}</p>
// `;
const loadingError = (path: string, error: unknown) => `
  <div class="alert alert-danger">
    <strong>Error: </strong>${`${error as string}` || 'Unknown error'}
  </div>

  <p>Unable to load ${path}</p>
`;

async function getContent(path: string): Promise<string> {
  let content;

  try {
    const res = await fetch(path);
    content = await res.text();

    if (!res.ok) {
      throw new Error(content);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    content = loadingError(path, error);
  }

  return content;
}

type RouterComponent = HTMLDivElement;

const view = create('div');
view.className = 'microdoc-page con';

export function Router(): RouterComponent {
  const root = view;

  const loadRoute = (path: string) => {
    if (!path || path === '/') {
      const [[firstRoute]] = $routes;
      routeTo(firstRoute);
      return;
    }

    // Delay loading state to prevent flash even when loading from cache
    const timer = setTimeout(() => {
      root.innerHTML = `
        <div class=spinner-wrapper>
          <div class=spinner></div>
        </div>
      `;
    }, LOADING_DELAY_MS);

    const route = $routes.get(`#${path}`);

    // TODO: Should we allow or prevent fetching a route even if it's not
    // registered?
    //  ↳ When not registered, should we construct the route.name on the fly
    //    from the file name?
    if (!route) {
      clearTimeout(timer);
      root.innerHTML = loadingError(path, new Error('Invalid route'));
      document.title = `Error | ${window.microdoc.title}`;
      return;
    }

    // eslint-disable-next-line no-void
    void getContent(window.microdoc.root + path).then((code) => {
      const html = md.render(code);

      clearTimeout(timer);
      root.innerHTML = html;
      document.title = `${route.name} | ${window.microdoc.title}`;

      // scroll to an in-page link
      try {
        const hashPath = new URL(path, FAKE_BASE_URL).hash;

        if (hashPath) {
          const id = hashPath.slice(1);
          const el = document.getElementById(id)!;
          el.scrollIntoView();
          return;
        }
      } catch (error) {
        /* noop */
      }

      // scroll to top
      window.scrollTo(0, 0);
    });

    $routes.forEach((route2) => {
      route2.ref?.classList.remove('active');
    });
    route.ref?.classList.add('active');

    let parent = route;

    // @ts-expect-error - FIXME:!
    // eslint-disable-next-line no-cond-assign
    while ((parent = parent.parent)) {
      parent.ref?.classList.add('expanded');
    }
  };

  const handleHashChange = () => loadRoute(window.location.hash.slice(1));

  window.onhashchange = handleHashChange;

  // load initial route
  handleHashChange();

  return root;
}
