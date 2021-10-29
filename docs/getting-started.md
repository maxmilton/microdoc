# Getting Started

<https://github.com/maxmilton/microdoc/blob/master/docs/index.html>

### Base minimal template

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
    root: "https://raw.githubusercontent.com/GITHUB_USERNAME/GITHUB_REPO/master/docs",
  }
</script>
```

Replace `PROJECT_NAME`, `PROJECT_DESCRIPTION`, `GITHUB_USERNAME`, and `GITHUB_REPO` with your relevant details.

Place a `favicon.ico` in the web root (usually the same directory as the `index.html`).
