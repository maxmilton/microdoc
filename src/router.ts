/* eslint-disable no-plusplus */

// TODO: Remember scroll position when navigating and restore it when returning
//  ↳ Could be tricky because the markdown takes a little time to render
//    ↳ It might cause a visual jump when navigating -- although that could be
//      reduced if we don't need to fetch the content file e.g., when the search
//      or preload plugins are used
//  ↳ https://github.com/sveltejs/kit/blob/master/packages/kit/src/runtime/client/router.js
//  ↳ https://github.com/sveltejs/sapper/blob/master/runtime/src/app/router/index.ts#L201
//  ↳ https://github.com/vuejs/vue-router/blob/dev/src/util/scroll.js

import { Remarkable } from 'remarkable';
import { create, setupSyntheticEvent } from 'stage1';
import type { InternalRoute, Routes } from './types';
import {
  FAKE_BASE_URL, makeInPageLink, toName, toSlug,
} from './utils';

const LOADING_DELAY_MS = 176;

const md = new Remarkable({
  html: true,
});

md.core.ruler.push(
  '',
  (state) => {
    const blockTokens = state.tokens;
    const blockLen = blockTokens.length;

    for (let blockIndex = 0; blockIndex < blockLen; blockIndex++) {
      const blockToken: Remarkable.BlockContentToken = blockTokens[blockIndex];

      if (blockToken.type === 'inline') {
        const inlineTokens = blockToken.children!;
        const inlineLen = inlineTokens.length;

        for (let inlineIndex = 0; inlineIndex < inlineLen; inlineIndex++) {
          const token = inlineTokens[inlineIndex] as Remarkable.LinkOpenToken;

          if (token.type === 'link_open') {
            // FIXME: Relative links; "./" and "../"

            // Modify in-page (start with #) and relative link href in a way
            // that works with our hash based routing
            token.href = token.href[0] === '#' && token.href[1] !== '/'
              ? makeInPageLink(token.href.slice(1))
              : new URL(token.href, FAKE_BASE_URL).href.replace(
                /^http:\/\/x\/(?:#\/)?/,
                '#/',
              );
          }
        }
      }
    }

    return false;
  },
  {},
);

interface HeadingCloseToken extends Remarkable.HeadingToken {
  slug: string | false | undefined;
}

// Add id attribute to headings
// TODO: Prevent duplicate ids
md.renderer.rules.heading_open = (tokens, idx) => {
  const level = tokens[idx].hLevel;
  const text = (tokens[idx + 1] as unknown as Remarkable.TextToken).content;
  const slug = level > 1 && text && toSlug(text);
  // eslint-disable-next-line no-param-reassign
  (tokens[idx + 2] as HeadingCloseToken).slug = slug;

  return `<h${level}${slug ? ` id="${slug}"` : ''}>`;
};
md.renderer.rules.heading_close = (tokens, idx) => {
  // eslint-disable-next-line prefer-destructuring
  const slug = (tokens[idx] as HeadingCloseToken).slug;

  return `${
    slug
      ? `<a href="${makeInPageLink(
        slug,
      )}" class=microdoc-hash-link title="Direct link to heading">#</a>`
      : ''
  }</h${tokens[idx].hLevel}>\n`;
};

md.renderer.rules.table_open = () => '<div class=table-wrapper><table>';
md.renderer.rules.table_close = () => '</table></div>';

const $routes = new Map<string, InternalRoute>();

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
      // Parent routes (with children) can be without a path if they're being
      // used just for grouping together content into a logical section
      if (!route.path) {
        route.path = parent?.path || '';
      }

      normaliseRoutes(route.children, route);
    } else {
      $routes.set(route.path!, route);
    }
  }
}

export function setupRouter(): void {
  // Expose internal route map for plugins
  window.microdoc.$routes = $routes;

  normaliseRoutes(window.microdoc.routes);

  document.body.__click = handleClick;
  setupSyntheticEvent('click');
}

const loadingError = (path: string, error: unknown) => `
  <div class=microdoc-alert>
    <strong>Error: </strong>${String(error) || 'Unknown error'}
  </div>

  <p class=break>Unable to load ${path}</p>
`;

async function getContent(path: string): Promise<string> {
  let content;

  try {
    const res = await fetch(path);
    content = await res.text();

    if (!res.ok) {
      throw new Error(content || `${res.status}`);
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

    // Delay loading state to prevent flash even when loading from cache etc.
    const timer = setTimeout(() => {
      root.innerHTML = `
        <div class=spinner-wrapper>
          <div class=spinner></div>
        </div>
      `;
    }, LOADING_DELAY_MS);

    const { hash, pathname } = new URL(path, FAKE_BASE_URL);
    const route = $routes.get(`#${pathname}`);

    if (!route) {
      clearTimeout(timer);
      root.innerHTML = loadingError(pathname, new Error('Invalid route'));
      document.title = `Error | ${window.microdoc.title}`;
      return;
    }

    // eslint-disable-next-line no-void
    void getContent(window.microdoc.root + pathname).then((code) => {
      const html = md.render(code);

      clearTimeout(timer);
      root.innerHTML = html;
      document.title = `${route.name} | ${window.microdoc.title}`;

      window.microdoc.afterRouteLoad?.(route);

      // scroll to an in-page link
      if (hash) {
        try {
          const id = hash.slice(1);
          const el = document.getElementById(id)!;
          el.scrollIntoView();
          return;
        } catch (error) {
          /* No op */
        }
      }

      // scroll to top
      window.scrollTo(0, 0);
    });

    $routes.forEach((route2) => {
      route2.ref!.classList.remove('active');
    });
    route.ref!.classList.add('active');

    let parent: InternalRoute | undefined = route;

    // eslint-disable-next-line no-cond-assign
    while ((parent = parent.parent)) {
      parent.ref!.classList.add('expanded');
    }
  };

  const handleHashChange = () => loadRoute(window.location.hash.slice(1));

  window.onhashchange = handleHashChange;
  // load initial route
  handleHashChange();

  return root;
}
