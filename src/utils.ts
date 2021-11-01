import { append, h } from 'stage1';
import type { Microdoc } from './types';

const oldTitle = document.title;

export function setDefaults(): void {
  window.microdoc = {
    root: '.',
    routes: ['README.md'],
    title: oldTitle,
    h,
    append,
    ...(window.microdoc as Partial<Microdoc> | undefined),
  };
}

export function toName(path: string) {
  return (
    path
      // .slice(Math.max(0, path.lastIndexOf('/') + 1))
      .slice(path.lastIndexOf('/') + 1)
      .toLowerCase()
      // remove file extension
      .replace(/\.(md|txt|html)/, '')
      // replace separators with a space
      .replace(/[_-]+/g, ' ')
      // capitalise
      // https://github.com/sindresorhus/titleize/blob/main/index.js
      .replace(/(?:^|\s|-)\S/g, (x) => x.toUpperCase())
  );
}

// TODO: Improve; this is overly simplistic and doesn't account for unicode
// characters etc., but it's probably not worth using something full-blown
// like https://github.com/sindresorhus/slugify
export function toSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

// /**
//  * Delay running a function until X ms have passed since its last call.
//  */
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function debounce<T extends (...args: any[]) => any>(
//   fn: T,
//   delay = 260): T {
//   let timer: number;

//   // @ts-expect-error - Transparent wraper will not change input function type
//   // eslint-disable-next-line func-names
//   return function (this: unknown, ...args) {
//     // eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
//     const context = this;

//     window.clearTimeout(timer);

//     timer = window.setTimeout(() => {
//       fn.apply(context, args);
//     }, delay);
//   };
// }

// // FIXME: Remove if unused
// export function ready(fn: () => void): void {
//   if (document.readyState !== 'loading') {
//     fn();
//   } else {
//     document.addEventListener('DOMContentLoaded', fn);
//   }
// }
