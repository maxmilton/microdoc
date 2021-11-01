# Configuration

Although microdoc touts itself as "zero config" — meaning that things will work without configuration — you'll need to set some basic options for a full experience.

Configuration options are set by defining a global `microdoc` object. If you're unfamiliar with JavaScript, that's the `var microdoc = {}` in the [starter template](getting-started.md#starter-template).

> **Tip:** When you're writing the config within inline `<script>` tags, keep in mind because the code is hand-written, you need to be mindful about cross-browser compatibility.

## Options

### `title`

Type: `string`  
Default: `document.title` (the text in your `<title>` element)

The name/title to use as your "logo" text. Also append to the document title when changing routes. Document titles will look like `Route.name | title`.

### `root`

Type: `string`  
Default: `'.'`

### `routes`

Type: `Routes`  
Default: `['README.md']`

```ts
type Routes = Array<string | Route>;

interface Route {
  name?: string;
  path?: string;
  children?: Routes;
}
```
