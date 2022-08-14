# Old Browser Support

TODO: Write me.

The expected use case of `microdoc` is developer docs so end-users are technically minded with an up-to-date browser. Only minimal efforts are made to polyfill browser APIs. That said, if you run into any compatibility bugs please [open an issue](https://github.com/maxmilton/microdoc/issues).

- State the non-supported browsers
  - Internet Explorer
  - How to handle end user with an unsupported browser?
    - They could just read the raw markdown
    - It's probably up to the developer to handle this case e.g., they could use a browser detection lib and show a message
- State the minimum browser versions microdoc supports out-of-the-box
  - Build target (any lower and the build fails or does not meet our min required version):
    - Chrome 55
    - Edge 18
    - Firefox 53
    - Safari 11
  - Opera 42 (not build target but should be supported)
  - Make a list of all the newer APIs found the output bundles (`microdoc.js`, `microdoc.css`, and plugins), especially any non-polyfillable syntax
    - Syntax; can't polyfill 💀
      - String template literals
      - ~~async/await~~ (can transpile in build)
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

---

## Newer Browser APIs Used

TODO: Remove this chart

| API/method                   | Chrome | Edge | Firefox | Safari/iOS  | IE  | Opera/mob |
| ---------------------------- | ------ | ---- | ------- | ----------- | --- | --------- |
| async/await                  | 55     | 15   | 52      | 10.1 / 10.3 | -   | 42        |
| CSS custom properties; `--*` | 49     | 15   | 31      | 9.1 / 9.3   | -   | 36        |
| CSS `var()`                  | 49     | 15   | 31      | 9.1 / 9.3   | -   | 36        |
| Destructuring assignment     | 49     | 14   | 41      | 8 / 8       | -   | 36        |
| Spread syntax (in array)     | 46     | 12   | 16      | 8 / 8       | -   | 37 / 37   |
| `fetch()`                    | 42     | 14   | 39      | 10.1 / 10.3 | -   | 29 / 29   |
| Element.closest()            | 41     | 15   | 35      | 6 / 9       | -   | 28 / 28   |
| String template literals     | 41     | 12   | 34      | 9 / 9       | -   | 28        |
| `new Map()` constructor      | 38     | 12   | 13      | 9 / 9       | 11  | 25 / 25   |
| Object.getOwnPropertySymbols | 38     | 12   | 36      | 9 / 9       | -   | 25 / 25   |
| CSS flexbox                  | 29     | 12   | 20      | 9 / 9       | 11  | 7 / 10.1  |
| `<template>`                 | 26     | 13   | 22      | 8 / 8       | -   | 15        |
| `new URL()` constructor      | 19     | 12   | 26      | 6 / 6       | -   | 15 / 14   |
| Object.keys                  | 5      | 12   | 4       | 5 / 5       | 9   | 12 / 12   |
