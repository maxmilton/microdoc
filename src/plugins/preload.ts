// Simple markdown content preloader -- standalone; doesn't use microdoc private internals

for (const link of document.querySelectorAll('.udoc-sidebar a')) {
  const href = link.getAttribute('href');

  if (href && href.endsWith('.md')) {
    try {
      // eslint-disable-next-line no-void
      void fetch(window.microdoc.root + href.slice(1));
    } catch (error) {
      /* noop */
    }
  }
}

// mark file as module to keep TS happy
export {};
