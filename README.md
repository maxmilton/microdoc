[![Build status](https://img.shields.io/github/workflow/status/maxmilton/microdoc/ci)](https://github.com/maxmilton/microdoc/actions)
[![Coverage status](https://img.shields.io/codeclimate/coverage/MaxMilton/microdoc)](https://codeclimate.com/github/MaxMilton/microdoc)
[![NPM version](https://img.shields.io/npm/v/microdoc.svg)](https://www.npmjs.com/package/microdoc)
[![NPM bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/microdoc.svg)](https://bundlephobia.com/result?p=microdoc)
[![Licence](https://img.shields.io/github/license/maxmilton/microdoc.svg)](https://github.com/maxmilton/microdoc/blob/master/LICENSE)

# microdoc

> WARNING: This is a work in progress and should not be used in production!

Minimalist project documentation web app runtime. Create interactive docs, generated on the fly, from markdown files.

**Features:**

- Zero config
- Zero build — only a simple `index.html` required; content generated on the fly from your markdown files
- Lightweight-ish — JS around 16kb gzip'd, mostly the markdown parser
- Works with any web server — uses hash based routing so no special server configuration required
- Simple, functional, and friendly UX

## Browser support

Recent versions of evergreen browsers.

The expected use case of `microdoc` is developer docs so end-users are technically minded with an up-to-date browser. Only minimal efforts are made to polyfill browser APIs. That said, if you run into any compatibility bugs please [open an issue](https://github.com/maxmilton/microdoc/issues).

TODO: Show how to use https://polyfill.io for wider cross-browser support

## Usage

See our docs: <https://microdoc.js.org>

TODO: Write me; show/describe basic `index.html`; also link to our docs: `docs/index.html`

TODO: Add a note about if they're OK with sending me error details, add a trackx script snippet to their html -- it would be much appreciated!

TODO: For developers and package maintainers, explain why build output is to the package root instead of a `dist/` dir -- for cleaner and simpler CDN URLs

TODO: Documentation:

- Routes - Menu item name is automatically inferred from path (capitalised + separators into space) -- if you want some other name, use object notation with "name" field
- Customise theme with CSS vars:
  - `--sidebar-width`
- Uses fetch so you need to include a polyfill for old browser support (+ list others that might need polyfills)
- No sanitation, directly render the resulting HTML from your markdown, open for XSS, don't accidentally pwn your reader
- Why markdown; developers can choose to either read the raw .md or the HTML rendered version
- Why use this over GitHub pages?

  - No tracking of any kind unless you add it yourself
  - Use without GitHub e.g., locally
  - x

- Similar projects:
  - https://docusaurus.io/docs/
  - https://docsify.js.org/#/?id=docsify

## Bugs

Please report any bugs you encounter on the [GitHub issue tracker](https://github.com/maxmilton/microdoc/issues).

## Changelog

See [releases on GitHub](https://github.com/maxmilton/microdoc/releases).

## License

`microdoc` is an MIT licensed open source project. See [LICENSE](https://github.com/maxmilton/microdoc/blob/master/LICENSE).

---

© 2021 [Max Milton](https://maxmilton.com)
