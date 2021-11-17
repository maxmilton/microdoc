import { h } from 'stage1';
import type { Microdoc } from './types';

export const FAKE_BASE_URL = 'http://x';
const oldTitle = document.title;

export function setDefaults(): void {
  window.microdoc = {
    root: '.',
    routes: ['README.md'],
    title: oldTitle,
    h,
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

export function makeInPageLink(href: string) {
  const route = window.location.hash.slice(1);
  const cleanUrlPath = new URL(route, FAKE_BASE_URL).pathname;
  return `#${cleanUrlPath}#${href}`;
}
