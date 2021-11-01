# Test 1 — Misc.

## Link base URL tests

- [#aaa](#aaa)
- [./link1](./link1)
- [./link2](./link2)
- [link3](link3)
- [/link4](/link4)
- [#/link5](#/link5)
- [/#/link6](/#/link6)
- pre [./link7](./link7) post
- [https://maxmilton.com](https://maxmilton.com)
- <./link8>
- <#/link9>
- <https://maxmilton.com>
- [#link10](#link10)

[#aaa](#aaa)
[./link1](./link1)
[./link2](./link2)
[link3](link3)
[/link4](/link4)
[#/link5](#/link5)
[/#/link6](/#/link6)
pre [./link7](./link7) post
[https://maxmilton.com](https://maxmilton.com)
<./link8>
<#/link9>
<https://maxmilton.com>
[#link10](#link10)

<h3 id="aaa">AAA</h3>

aaa

---

## Fenced code blocks

html:

```html
<!-- https://prismjs.com/ -->
<script src=https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js defer></script>
<script src=https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js defer></script>
```

css:

```css
body {
  color: blueviolet;
}
```

js:

```js
// scroll to an in-page link
try {
  const hashPath = new URL(path, fakeBaseUrl).hash;

  if (hashPath) {
    const id = hashPath.slice(1);
    const el = document.getElementById(id)!;
    el.scrollIntoView();
    return;
  }
} catch (error) {
  /* noop */
}
```

ts:

```ts
// scroll to an in-page link
try {
  const hashPath = new URL(path, fakeBaseUrl).hash;

  if (hashPath) {
    const id = hashPath.slice(1);
    const el = document.getElementById(id)!;
    el.scrollIntoView();
    return;
  }
} catch (error) {
  /* noop */
}
```
