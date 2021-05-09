[![Build status](https://img.shields.io/github/workflow/status/MaxMilton/microdoc/ci)](https://github.com/MaxMilton/microdoc/actions)
[![Coverage status](https://img.shields.io/codeclimate/coverage/MaxMilton/microdoc)](https://codeclimate.com/github/MaxMilton/microdoc)
[![NPM version](https://img.shields.io/npm/v/microdoc.svg)](https://www.npmjs.com/package/microdoc)
[![NPM bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/microdoc.svg)](https://bundlephobia.com/result?p=microdoc)
[![Licence](https://img.shields.io/github/license/MaxMilton/microdoc.svg)](https://github.com/MaxMilton/microdoc/blob/master/LICENSE)

# microdoc

> WARNING: `microdoc` is a work in progress and should not be used in production!

Minimalist no-build project documentation web app runtime. For the times you want a better experience than just markdown files.

**Features:**

- Zero config
- No build step — only a simple entry `index.html` is required as HTML is generated on the fly from your markdown content
- Lightweight-ish — around 15kb g'zip'd, mostly the markdown parser
- Works with any web server — uses hash based routing so no special server configuration required
- Simple, functional, and friendly UX

## Browser support

Recent versions of evergreen browsers.

It's expected users have up-to-date browsers so `microdoc` makes minimal effort to polyfill browser APIs. That said, if you run into any compatibility bugs please [open an issue](https://github.com/MaxMilton/microdoc/issues).

## Usage

TODO: Write me; show/describe basic `index.html`

TODO: Add a note about if they're OK with sending me error details, add a trackx script snippet to their html -- it would be much appreciated!

TODO: Documentation:

- Routes - Menu item name is automatically inferred from path (capitalised + separators into space) -- if you want some other name, use object notation with "name" field
- Customise theme with CSS vars:
  - `--sidebar-width`
- Uses fetch so you need to include a polyfill for old browser support (+ list others that might need polyfills)
- No sanitation, directly render the resulting HTML from your markdown, open for XSS, don't accidentally pwn your reader
- Why markdown; developers can choose to either read the raw .md or the HTML rendered version

- Similar projects:
  - https://docusaurus.io/docs/
  - https://docsify.js.org/#/?id=docsify

## Bugs

Please report any bugs you encounter on the [GitHub issue tracker](https://github.com/MaxMilton/microdoc/issues).

## Changelog

See [releases on GitHub](https://github.com/MaxMilton/microdoc/releases).

## Licence

`microdoc` is an MIT licensed open source project. See [LICENCE](https://github.com/MaxMilton/microdoc/blob/master/LICENCE).

---

© 2021 [Max Milton](https://maxmilton.com)
