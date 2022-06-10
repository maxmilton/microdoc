# Prism Plugin

The Prism plugin provides a custom theme for use with the [Prism code syntax highlighter](https://github.com/PrismJS/prism). The theme is based on [One Light](https://github.com/PrismJS/prism-themes/blob/master/themes/prism-one-light.css) and [One Dark](https://github.com/PrismJS/prism-themes/blob/master/themes/prism-one-dark.css) with changes for better compatibility with microdoc. The Prism theme will automatically switch between light and dark when used with the [Dark Mode plugin](plugins/dark-mode.md).

Once you've added Prism to your docs, fenced code blocks will have their syntax highlighted. You can see this in action throughout these docs!

## Installation

Add the plugin stylesheet and prismjs scripts to your `index.html`, before `microdoc.js`:

```html
<link href=https://cdn.jsdelivr.net/npm/microdoc@0/plugin/prism.css rel=stylesheet>
<script src=https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js data-manual defer></script>
<script src=https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js defer></script>
```

You also need to add an [`afterRouteLoad` callback handler](configuration.md#afterrouteload) to your microdoc configuration:

```html
<script>
  var microdoc = {
    afterRouteLoad: () => Prism.highlightAll()
  };
</script>
```

## Configuration

No plugin configuration is necessary.

If you wish to extend Prism's functionality, head over to the [Prism plugins documentation](https://prismjs.com/#plugins).

## Usage

> 💡 **Tip:** Prism supports [a lot of languages](https://github.com/PrismJS/prism/tree/master/components) out-of-the-box. When you include the [prismjs autoloader script](https://prismjs.com/plugins/autoloader/) (as in [installation](installation) above), it will automatically fetch required language syntax components for you.

In your markdown files use fenced code blocks such as the following ([see live example](https://microdoc.js.org/examples/plugin-prism1.html)):

`example.md`:

````md
# Code Block Examples

```javascript
function fancyAlert(arg) {
  if (arg) {
    $.facebox({ div: "#foo" });
  }
}
```

```js
import { h, Component, render } from "https://unpkg.com/preact?module";

const app = h("h1", null, "Hello World!");
render(app, document.body);
```

```css
body {
  color: var(--color-text);
  font-size: 1.2rem;
}
```

```sql
SELECT column1, column2
FROM table
WHERE column1='value'
```

```bash
#!/bin/bash
i=0

while [ $i -le 4 ]; do
  echo Number: $i
  ((i++))
done
```

```haskell
main = do
  writeFile "file.txt" "Hello, world!"
  readFile "file.txt" >>= print
```

```rust
fn greet_user(name: Option<String>) {
  match name {
    Some(name) => println!("Hello there, {}!", name),
    None => println!("Well howdy, stranger!"),
  }
}
```
````
