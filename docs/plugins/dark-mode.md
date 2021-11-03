# Dark Mode Plugin

Adds a button to your docs header allowing users to toggle between dark and light themes.

## Installation

Add the plugin script to your `index.html`, after `microdoc.js`:

```html
<script src=https://cdn.jsdelivr.net/npm/microdoc@0/microdoc.js defer></script>
<script src="https://cdn.jsdelivr.net/npm/microdoc@0/plugin/dark-mode.js" defer></script>
```

## Configuration

### Options

#### `darkMode`

Type: `boolean`  
Default: `false`

When `true` use the dark theme on page load.

You can automate this depending on the user's preference:

```html
<script>
  var microdoc = {
    darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches
  };
</script>
```

### Theme Customisation

You can customise all the same CSS properties as regular [theme customisation](configuration.md#theme-customisation) for dark mode too! Instead of placing your style customisations in a `:root` selector, place them in a `.dark` selector.

#### Example

Use a custom primary colour (which links etc. use by default) in dark mode ([see live example](https://microdoc.js.org/examples/plugin-dark-mode.html)):

```html
<style>
  .dark {
    --color-primary: #f5498b;
  }
</style>
```
