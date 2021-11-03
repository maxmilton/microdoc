/**
 * Microdoc Preload Plugin
 *
 * @see https://microdoc.js.org/#/plugins/preload.md
 * docs/plugins/preload.md
 */

import type { InternalMicrodoc } from '../types';

const { $routes, root } = window.microdoc as InternalMicrodoc;

$routes.forEach((route) => {
  fetch(root + route.path.slice(1)).catch(() => {});
});
