# Preload Plugin

The preload plugin fetches the files defined in your `window.microdoc.routes` so they are cached by the browser for fast page navigation.

> **Note:** This plugin is unnecessary if you're using [search plugin](plugins/search.md). The search plugin already fetches all routes.

## Installation

Add the plugin script to your `index.html`, after `microdoc.js`:

<!-- FIXME: remarkable markdown parser fails to render the next line after HTML comments so we have to use prettier range ignore comments instead of prettier-ignore -->
<!-- prettier-ignore-start -->

```html
<script src="https://cdn.jsdelivr.net/npm/microdoc@0/plugin/preload.js" defer></script>
```

<!-- prettier-ignore-end -->

## Configuration

No configuration is necessary. The plugin works out-of-the-box.
