# Preload Plugin

The preload plugin fetches the files defined in your `window.microdoc.routes` so they are cached by the browser for fast page navigation.

> **Tip:** You don't need this if you're using the [search plugin](plugins/search.md)! The search plugin already fetches all routes in order to create its search index.

## Installation

Add the plugin script to your `index.html`, after `microdoc.js`:

```html
<script src=https://cdn.jsdelivr.net/npm/microdoc@0/microdoc.js defer></script>
<script src="https://cdn.jsdelivr.net/npm/microdoc@0/plugin/preload.js" defer></script>
```

## Configuration

No plugin configuration is necessary. The plugin works out-of-the-box.

If you're having issues with fetched files not being loaded from the browser cache upon navigation, you may need to adjust your web server HTTP headers. See <https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching>.
