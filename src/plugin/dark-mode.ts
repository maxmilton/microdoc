/**
 * Microdoc Dark Mode Plugin
 *
 * @see https://microdoc.js.org/#/plugins/dark-mode.md
 * docs/plugins/dark-mode.md
 *
 * @fileoverview Adds a button to the header to toggle dark mode. The actual
 * dark theme is already part of the main app CSS and can be applied by adding
 * a `.dark` CSS class to `:root` (`<html>` element).
 */

import type { S1Node } from 'stage1';
import type { InternalMicrodoc } from '../types';

const { append, h, darkMode } = window.microdoc as InternalMicrodoc;

type DarkModeToggleComponent = S1Node & HTMLDivElement;

type RefNodes = {
  button: HTMLButtonElement;
};

// https://github.com/feathericons/feather/blob/master/icons/moon.svg
// https://github.com/tabler/tabler-icons/blob/master/icons/sun.svg
const view = h(`
  <button class="microdoc-dark-mode microdoc-header-item button-clear" title="Toggle light/dark mode" #button>
    <svg viewBox="0 0 24 24" class=microdoc-icon-moon>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
    <svg viewBox="0 0 24 24" class=microdoc-icon-sun>
      <circle fill=currentColor cx=12 cy=12 r=4></circle>
      <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path>
    </svg>
  </button>
`);

function DarkModeToggle(): DarkModeToggleComponent {
  const root = view as DarkModeToggleComponent;
  const { button } = view.collect<RefNodes>(root);

  button.__click = () => {
    document.documentElement.classList.toggle('dark');
  };

  if (darkMode) {
    // @ts-expect-error - no mouse event
    button.__click();
  }

  return root;
}

append(DarkModeToggle(), document.querySelector('.microdoc-header')!);
