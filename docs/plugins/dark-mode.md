# Dark Mode Plugin

Adds a button to your docs header allowing users to toggle between a light and dark theme. You can see it in action at the top of these docs!

> **Tip:** If you want _only_ a dark theme (without the ability to toggle between a light theme) you don't need this plugin! Simply add `<html class=dark>` at the top of your `index.html` after the DOCTYPE ([see live example](https://microdoc.js.org/examples/plugin-dark-mode1.html)).

## Installation

Add the plugin script to your `index.html`, after `microdoc.js`:

```html
<script src=https://cdn.jsdelivr.net/npm/microdoc@0/plugin/dark-mode.js defer></script>
```

## Configuration

### Options

#### `darkMode`

Type: `boolean`  
Default: `false`

When `true` use the dark theme by default.

You can automatically choose the theme depending on the user's preference by using [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) along with the [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) CSS media feature:

```html
<script>
  var microdoc = {
    darkMode: matchMedia("(prefers-color-scheme: dark)").matches
  };
</script>
```

### Theme Customisation

You can customise all the same CSS properties as regular [theme customisation](configuration.md#theme-customisation) for dark mode too! Instead of placing your style customisations in a `:root` selector, place them in a `.dark` selector.

#### Example

Use a custom primary colour (which links etc. use by default) in dark mode ([see live example](https://microdoc.js.org/examples/plugin-dark-mode2.html)):

```html
<style>
  .dark {
    --color-primary: #f5498b;
  }
</style>
```

Use a custom primary colour in both light and dark themes ([see live example](https://microdoc.js.org/examples/plugin-dark-mode3.html)):

```html
<style>
  :root {
    --color-primary: #bf7326;
  }
  .dark {
    --color-primary: #f29d49;
  }
</style>
```
