# Configuration

Although microdoc touts itself as "zero config" — meaning that things will work without configuration — you'll need to set some basic options for a full experience.

Configuration options are set by defining a global `microdoc` object. If you're unfamiliar with JavaScript, that's the `var microdoc = {}` in the [starter template](getting-started.md#starter-template).

> **Tip:** When you're writing the config within inline `<script>` tags, keep in mind because the code is hand-written, you need to be mindful about cross-browser compatibility.

## Options

### `title`

Type: `string`  
Default: `document.title` (the text in your `<title>` element)

Used as the name in your "logo" text. Also append to the document title when changing routes. Document titles will look like `Route.name | title`.

### `root`

Type: `string`  
Default: `'.'`

The base URL to fetch route content from. `root` is prepended to route paths.

For example, with a config like:

```html
<script>
  var microdoc = {
    root: 'http://my-site.com/docs',
    routes: ['welcome.md'],
  };
</script>
```

The file we'll fetch will be `http://my-site.com/docs/welcome.md`.

Or if you didn't set `root` and fall back to the default value, we would fetch `./welcome.md`.

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

If you omit `root` and `routes`, the default file we'll fetch is `./README.md`.

You have two options for specifying each route, either a string with the path or an object. Object routes can be either _content_ (a file to be read) or a _parent_ with children (a logical group).

Object _content_ routes must have `path` defined. Object _parent_ routes must have `children` and either `name` or `path` defined. Invalid routes are ignored.

When `name` is not defined it's automatically generated based on `path`.

When an object _parent_ route has a `path`, its children will inherit it as their base path. Route paths look like: `root + parent.path + child.path`. There's no hard limit to nesting depth but in general not more than 3 levels deep is recommended.
