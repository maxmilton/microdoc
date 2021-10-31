/**
 * Microdoc Preload Plugin
 *
 * @fileoverview Simple standalone route content preloader.
 */

import type { InternalMicrodoc } from '..';

const { $routes, root } = window.microdoc as InternalMicrodoc;

$routes.forEach((route) => {
  try {
    // eslint-disable-next-line no-void
    void fetch(root + route.path.slice(1));
  } catch (error) {
    /* No op */
  }
});

// Keep TS happy
export {};
