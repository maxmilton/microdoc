# Old Browser Support

TODO: Write me.

The expected use case of `microdoc` is developer docs so end-users are technically minded with an up-to-date browser. Only minimal efforts are made to polyfill browser APIs. That said, if you run into any compatibility bugs please [open an issue](https://github.com/maxmilton/microdoc/issues).

- State the non-supported browsers
  - Internet Explorer
  - Opera (no `String.raw()` support?)
  - Browsers that don't support ECMAScript 2018 (ES9) — <https://caniuse.com/?search=ECMAScript>
  - How to handle end user with an unsupported browser?
    - They could just read the raw markdown
    - It's probably up to the developer to handle this case e.g., they could use a browser detection lib and show a message
- State the minimum browser versions microdoc supports out-of-the-box
  - Chrome 60
  - Edge 79
  - Firefox 55
  - Safari 11.1
  - Make a list of all the newer APIs found the output bundles (`microdoc.js`, `microdoc.css`, and plugins), especially any non-polyfillable syntax
    - Syntax; can't polyfill 💀
      - String template literals
      - ~~async/await~~ (can transpile in build)
      - Rest parameters
      - Spread syntax
      - `<template>` element
      - CSS custom properties
      - CSS var()
      - CSS flexbox
    - Objects/methods; can polyfill 👌
      - Element.closest()
      - Map() constructor
      - fetch
      - URL() constructor
      - Object.keys
      - Object.getOwnPropertySymbols
- Tips for writing cross-browser compatible JS within `<script>` tags e.g., writing up to ECMAScript 2015 (ES6) is OK but probably no newer
  - [Trailing commas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas) — fine except function params which is ECMAScript 2017 (ES8)
- Tips for writing cross-browser compatible CSS within `<style>` tags
- Using <https://polyfill.io>
  - If we officially don't support IE 11 there might not be a real need to use polyfill.io!
  - Examples of using specific polyfills or feature groups (for simplicity)
  - Note it may have a (significant?) negative impact on initial page load performance

```html
<script src=https://polyfill.io/v3/polyfill.min.js crossorigin></script>
```

<!-- prettier-ignore-start -->

```html
<script src="https://polyfill.io/v3/polyfill.js?features=es5,es6,es7&flags=gated" crossorigin></script>
```

<!-- prettier-ignore-end -->
