<div style="margin:3rem;text-align:center">
  <img src="favicon.svg" style="width:290px">
  <div style="margin-top:1rem;font-size:3.5rem;font-weight:300">microdoc</div>
</div>

# Introduction

https://github.com/maxmilton/microdoc

Minimalist zero-config zero-build project documentation web apps.

> It's still early days for these docs so content might be a little rough around the edges. If you have any suggestions please [create an issue on GitHub](https://github.com/maxmilton/microdoc/issues). Contributors are welcome too!

---

TODO: Write me; show/describe basic `index.html`; also link to our docs: `docs/index.html`

TODO: Add a note about if they're OK with sending me error details, add a trackx script snippet to their html -- it would be much appreciated!

TODO: For developers and package maintainers, explain why build output is to the package root instead of a `dist/` dir -- for cleaner and simpler CDN URLs

TODO: Documentation:

- Routes - Menu item name is automatically inferred from path (capitalised + separators into space) -- if you want some other name, use object notation with "name" field
- Customise theme with CSS vars:
  - `--sidenav-width`
- Uses fetch so you need to include a polyfill for old browser support (+ list others that might need polyfills)
- No sanitation, directly render the resulting HTML from your markdown, open for XSS, don't accidentally pwn your reader
- Why markdown; developers can choose to either read the raw .md or the HTML rendered version
- Why use this over GitHub pages?

  - No tracking of any kind unless you add it yourself
  - Use without GitHub e.g., locally
  - x

- Uses hash based routing but still supports in-page hash anchor links!

- Similar projects:
  - https://docusaurus.io/docs/
  - https://docsify.js.org/#/?id=docsify
