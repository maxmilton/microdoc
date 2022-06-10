# Search Plugin

The search plugin creates a fully client-side, documentation-wide, fuzzy search without a backend! Behind the scenes this plugin will fetch your [configured content routes](configuration.md#routes), read their content, and create a search index using a [fuse.js](https://github.com/krisk/Fuse) powered search engine.

Users can initiate a search via a search text input that's added to the top of your docs UI. You can see it in action in these very docs!

> 💡 **Tip:** Because this plugin fetches routes for indexing, they will be cached by the browser for fast navigation! Essentially the same benefits as the [preload plugin](plugins/preload.md).

## Installation

Add the plugin script to your `index.html`, after `microdoc.js`:

```html
<script src=https://cdn.jsdelivr.net/npm/microdoc@0/plugin/search.js defer></script>
```

## Configuration

No plugin configuration is currently available.
