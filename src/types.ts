import type { h } from 'stage1';

declare global {
  interface HTMLElement {
    /** `stage1` synthetic click event handler. */
    __click?(event: MouseEvent): void;
  }

  interface Window {
    microdoc: Microdoc;
  }
}

export interface Microdoc {
  // generic index for plugin or advanced use
  [key: string]: unknown;

  /**
   * Optional callback function that's called after a route has finished
   * rendering in the browser.
   */
  afterRouteLoad?: (route: Route) => void;
  /**
   * Document title to append to page titles.
   *
   * When not provided title is inferred from the HTML document
   * `<title>...</title>` on initial page load.
   */
  title: string;
  /**
   * Markdown content URL path root.
   *
   * @default '.' // content is relative to HTML document
   */
  root: string;
  /**
   * Routes structure.
   *
   * @default ['README.md']
   */
  routes: Routes;
}

export interface InternalMicrodoc extends Microdoc {
  $routes: Map<string, InternalRoute & { path: string }>;
  h: typeof h;
}

export interface Route {
  /**
   * Name of the menu section or content item.
   *
   * When not provided name is inferred from route `path`.
   */
  name?: string;
  /**
   * File path.
   *
   * You can use a directory path when also providing `children` for child
   * paths to be resolved relative to your route path.
   *
   * When used together with `name` you can use this to explicitly set a
   * content item name instead of the default of inferring it from the path.
   */
  path?: string;
  /** Creates a new menu section with a list of child routes. */
  children?: Routes;
}

export interface InternalRoute extends Route {
  name: string;
  ref?: HTMLElement;
  children?: InternalRoute[];
  parent?: InternalRoute;
}

/**
 * List of content paths or Route definitions.
 *
 * When using a string the menu item name is inferred from the path.
 */
export type Routes = Array<string | Route>;
