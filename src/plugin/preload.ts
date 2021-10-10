/**
 * Microdoc Preload Plugin
 *
 * @fileoverview Simple standalone route content preloader.
 */

const reTextFileExt = /\.(md|txt)$/;

for (const link of document.querySelectorAll('.udoc-sidebar a')) {
  const href = link.getAttribute('href');

  if (href && reTextFileExt.test(href)) {
    try {
      // eslint-disable-next-line no-void
      void fetch(window.microdoc.root + href.slice(1));
    } catch (error) {
      /* No op */
    }
  }
}

// Keep TS happy
export {};
