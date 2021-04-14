import h from 'stage0';
import type { Microdoc } from './types';

const oldTitle = document.title;

export function setDefaults(): void {
  window.microdoc = {
    root: '.',
    routes: ['README.md'],
    title: oldTitle,
    h,
    ...((window.microdoc as Partial<Microdoc> | undefined) || {}),
  };
}

export function toName(path: string): string {
  return (
    path
      // remove preceding directory path
      .substring(path.lastIndexOf('/') + 1)
      .toLowerCase()
      // remove file extension
      .replace(/\.md/, '')
      // replace separators with a space
      .replace(/[-_]+/g, ' ')
      // capitalise
      // https://github.com/sindresorhus/titleize/blob/main/index.js
      .replace(/(?:^|\s|-)\S/g, (x) => x.toUpperCase())
  );
}

/**
 * Delay running a function until X ms have passed since its last call.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 260): T {
  let timer: number;

  // @ts-expect-error - Transparent wraper will not change input function type
  return function (this: any, ...args) {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-unsafe-assignment
    const context = this;

    window.clearTimeout(timer);

    timer = window.setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
