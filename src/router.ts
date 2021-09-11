/* eslint-disable no-plusplus */

import { Remarkable } from 'remarkable';
import { create, setupSyntheticEvent } from 'stage1';
import type { Route, Routes } from './types';
import { toName } from './utils';

interface RouteEntry {
  name: string;
  section?: true;
}

const md = new Remarkable({
  html: true,
});

const fakeBaseUrl = 'http://x';

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
              const cleanUrlPath = new URL(route, fakeBaseUrl).pathname;
              token.href = `#${cleanUrlPath}${token.href}`;
            } else {
              // leverage URL() to handle relative links with a fake base URL...
              token.href = new URL(token.href, fakeBaseUrl).href
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

export const routeMap = new Map<string, RouteEntry>();

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

function joinPaths(parent: string, route: string): string {
  return `#/${parent ? `${parent}/` : ''}${route}`;
}

function normaliseRoutes(routes: Routes, parentPath = '') {
  for (const route of routes) {
    const newRoute: { name?: string | undefined; section?: true } = {};
    let path: string | undefined;

    if (typeof route === 'string') {
      path = joinPaths(parentPath, route);
    } else {
      if (route.children) {
        newRoute.section = true;
      }
      if (route.path) {
        path = joinPaths(parentPath, route.path);
      }
      newRoute.name = route.name;
    }
    if (!newRoute.name) {
      if (path) {
        newRoute.name = toName(path);
      } else {
        // eslint-disable-next-line no-console
        console.error('Skipping route because no path:', route);
        break;
      }
    }

    routeMap.set(path!, newRoute as RouteEntry);

    // process children after adding parent section to routes
    if (newRoute.section) {
      normaliseRoutes((route as Route).children!, (route as Route).path);
    }
  }
}

export function setupRouter(): void {
  normaliseRoutes(window.microdoc.routes);

  document.body.__click = handleClick;
  setupSyntheticEvent('click');
}

interface CodedError extends Error {
  code?: number;
}

const loadingError = (path: string, err: CodedError) => `
  <div class="alert alert-error">
    <strong>ERROR:</strong> An error occured when loading ${path}
    <br/>${err.code || '500'} ${err.message || 'Unknown error'}
  </div>
`;

async function getContent(path: string): Promise<string> {
  let content;

  try {
    const res = await fetch(path);

    if (!res.ok) {
      const error: CodedError = new Error(await res.text());
      error.code = res.status;
      throw error;
    }

    content = await res.text();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    content = loadingError(path, error as Error);
  }

  return content;
}

type RouterComponent = HTMLDivElement;

const view = create('div');
view.className = 'udoc-page con';

export function Router(): RouterComponent {
  const root = view;

  const loadRoute = (path: string) => {
    root.innerHTML = 'Loading...';

    if (!path || path === '/') {
      // first route
      routeTo(routeMap.keys().next().value);
      return;
    }

    const route = routeMap.get(`#${path}`);

    if (!route) {
      const err: CodedError = new Error('Unknown route');
      err.code = 404;
      root.innerHTML = loadingError(path, err);
      document.title = `404 Error | ${window.microdoc.title}`;
      return;
    }

    // eslint-disable-next-line no-void
    void getContent(window.microdoc.root + path).then((code) => {
      const html = md.render(code);

      root.innerHTML = html;
      document.title = `${route.name} | ${window.microdoc.title}`;

      // scroll to an in-page link
      try {
        const hashPath = new URL(path, fakeBaseUrl).hash;

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
  };

  const handleHashChange = () => loadRoute(window.location.hash.slice(1));

  window.onhashchange = handleHashChange;

  // load initial route
  handleHashChange();

  return root;
}
