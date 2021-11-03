# Getting Started

The only thing's needed to use microdoc is a HTML file which loads `microdoc.css` and `microdoc.js`, plus your markdown files. Everything else is optional.

## Starter template

Although you're welcome to write your HTML however you like, here's a minimal template to get you started quickly. If you'd like to see a real world example, see [our actual index.html](https://github.com/maxmilton/microdoc/blob/master/docs/index.html) (or view the source of this page!).

`index.html`:

```html
<!doctype html>
<meta charset=utf-8>
<title>PROJECT_NAME</title>
<meta name=description content="PROJECT_DESCRIPTION">
<meta name=viewport content="width=device-width">
<link href=https://cdn.jsdelivr.net/npm/microdoc@0/microdoc.css rel=stylesheet>
<script src=https://cdn.jsdelivr.net/npm/microdoc@0/microdoc.js defer></script>
<script src=https://cdn.jsdelivr.net/npm/microdoc@0/plugin/search.js defer></script>
<script>
  var microdoc = {
    root: "https://raw.githubusercontent.com/GITHUB_USERNAME/GITHUB_REPO/master/docs"
  }
</script>
```

Replace `PROJECT_NAME`, `PROJECT_DESCRIPTION`, `GITHUB_USERNAME`, and `GITHUB_REPO` with your relevant details. If you're not using GitHub to host your markdown files, set `root` to your base URL path or see [root configuration](configuration.md#root).

Optionally, place a `favicon.ico` in the web root (usually the same directory as the `index.html`). You're welcome to reuse [our favicon.ico](https://github.com/maxmilton/microdoc/blob/master/docs/favicon.ico).
