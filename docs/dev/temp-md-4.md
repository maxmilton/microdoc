# Temp Test 4

```html
<!-- https://prismjs.com/ -->
<script src=https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js defer></script>
```

```css
body {
  color: blueviolet;
}
```

```html
<link href=/dev/node_modules/microdoc/microdoc.css rel=stylesheet>
<script src=https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js defer></script>
<script src=https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js defer></script>
<script src=/dev/node_modules/microdoc/microdoc.js defer></script>
<script src=/dev/node_modules/microdoc/plugin/search.js defer></script>
<script src=/dev/node_modules/microdoc/plugin/preload.js defer></script>
```

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
