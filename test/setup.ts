import { GlobalWindow, type Window } from 'happy-dom';
import { addHook } from 'pirates';

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var happyDOM: Window['happyDOM'];
}

// increase limit from 10
global.Error.stackTraceLimit = 100;

// Make imported .xcss files return empty to prevent test errors (unit tests
// can't assert styles properly anyway; better to create e2e tests!)
addHook(() => '', {
  exts: ['.xcss'],
});

function setupDOM() {
  const dom = new GlobalWindow();
  global.happyDOM = dom.happyDOM;
  // @ts-expect-error - happy-dom only implements a subset of the DOM API
  global.window = dom.window.document.defaultView;
  global.document = window.document;
  global.console = window.console;
  global.setTimeout = window.setTimeout;
  global.clearTimeout = window.clearTimeout;
  global.DocumentFragment = window.DocumentFragment;
}

function setupMocks(): void {
  // FIXME: The fetch mock is too simple for our use cases (router, plugins, etc.)

  // Even though node v18 has native fetch, it fails to parse relative URLs
  // which are valid in browsers, so we need to mock it
  global.fetch = () =>
    // @ts-expect-error - just a simple stub
    Promise.resolve({
      json: () => Promise.resolve({}),
    });
}

export function reset(): void {
  setupDOM();
  setupMocks();
}

reset();
