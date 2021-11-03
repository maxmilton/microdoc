# Configuration

Although microdoc touts itself as "zero config" — meaning that things will work without configuration — you'll need to set some basic options for a full experience.

Configuration options are set by defining a global `microdoc` object. If you're unfamiliar with JavaScript, that's the `var microdoc = {}` in the [starter template](getting-started.md#starter-template) and examples below.

> **Tip:** When you're writing the config within inline `<script>` tags, keep in mind because the code is hand-written, you need to be mindful about cross-browser compatibility.

To customise the visual look and feel of your docs see [theme customisation](#theme-customisation) below.

## Options

### `afterRouteLoad`

Type: `Function`  
Default `undefined`

```ts
function afterRouteLoad(route: Route): void;
```

An optional callback function that's called after a route has finished rendering in the browser.

We use it in these docs to trigger code syntax highlighting using [Prism.js](https://github.com/PrismJS/prism). See [our index.html](https://github.com/maxmilton/microdoc/blob/master/docs/index.html) (or view the source of this page!).

### `title`

Type: `string`  
Default: `document.title` (the text in your `<title>` element)

Used as the name in your "logo" text. Also append to the document title when changing routes. Document titles will look like `Route.name | title`.

Rather than using this option it's recommended you set your `<title>` element. This option exists for advanced or dynamic use.

### `root`

Type: `string`  
Default: `'.'`

The base URL to fetch route content from. `root` is prepended to route paths.

For example, with a configuration like:

```html
<script>
  var microdoc = {
    root: "https://example.com/docs",
    routes: ["welcome.md"]
  };
</script>
```

The fetched file would be `https://example.com/docs/welcome.md` ([see live example](https://microdoc.js.org/examples/config1.html)).

If you didn't set `root` the app would fetch `./welcome.md` ([see live example](https://microdoc.js.org/examples/config2.html)).

### `routes`

Type: `Routes`  
Default: `["README.md"]`

```ts
type Routes = Array<string | Route>;

interface Route {
  name?: string;
  path?: string;
  children?: Routes;
}
```

If you omit `root` and `routes`, the default file fetched is `./README.md` ([see live example](https://microdoc.js.org/examples/config3.html)).

You have two options for specifying each route, either a string with the path or an object. Object routes can be either _content_ (a file to be read) or a _parent_ with children (a logical group).

Object _content_ routes must have `path` defined. Object _parent_ routes must have `children` and either `name` or `path` defined. Invalid routes are ignored.

When `name` is not defined it's automatically generated based on `path`. If the auto-generated name is not exactly what you need, use an object route with a `name`.

When an object _parent_ route has a `path`, its children will inherit it as their base path. Route paths look like: `root + parent.path + child.path`. There's no hard limit to nesting depth but in general not more than 3 levels deep is recommended.

Only routes which are defined can be loaded. Even if you link to files in your markdown, unless they're in `routes` they will generate an error when attempting to load them. The reason behind this is twofold, firstly to prevent users accessing files they shouldn't, and secondly for discoverability e.g., routes are fetched by the [search plugin](plugins/search.md) to index their content.

## Example

Given the following configuration ([see live example](https://microdoc.js.org/examples/config4.html)):

```html
<script>
  var microdoc = {
    root: "https://example.com/docs",
    routes: [
      "my-file-1.md",
      "MY_FILE_2.md",
      { name: "Custom Name", path: "my-file-3.md" },
      {
        path: "nested-path",
        children: [
          "my-file-4.md",
          { path: "deeper", children: ["my-file-5.md"] }
        ]
      },
      { name: "nested-name", children: ["my-file-6.md"] }
    ]
  };
</script>
```

It would evaluate into data that looks like:

```json
[
  {
    "name": "My File 1",
    "path": "https://example.com/docs/my-file-1.md"
  },
  {
    "name": "My File 2",
    "path": "https://example.com/docs/MY_FILE_2.md"
  },
  {
    "name": "Custom Name",
    "path": "https://example.com/docs/my-file-3.md"
  },
  {
    "name": "Nested Path",
    "children": [
      {
        "name": "My File 4",
        "path": "https://example.com/docs/nested-path/my-file-4.md"
      },
      {
        "name": "Deeper",
        "children": [
          {
            "name": "My File 5",
            "path": "https://example.com/docs/nested-path/deeper/my-file-5.md"
          }
        ]
      }
    ]
  },
  {
    "name": "nested-name",
    "children": [
      {
        "name": "My File 6",
        "path": "https://example.com/docs/my-file-6.md"
      }
    ]
  }
]
```

## Theme Customisation

<!-- Your docs theme can be customised in two ways,  -->

Customise theme with
The most common x
are [CSS custom properties (also known as CSS variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

<!--
getComputedStyle(document.documentElement).getPropertyValue('--input-color-text')
-->

<!-- prettier-ignore-start -->

| Property Name | Default | Description |
| --- | --- | --- |
| `--color-primary` | `#106ba3` | Main theme colour. Many styles use this property so it's easy to give your docs a unique feel by setting just this one value. |
| `--color-background` | `#f5f8fa` | Page background colour. |
| `--color-text` | `#202b33` | Text colour. |
| `--color-muted` | `#5c7080` | Muted accent colour. Used for things which are less important e.g., footer message. |
| `--color-link` | `var(--color-primary)` | Anchor link tag colour. |
| `--color-link-hover` | `var(--color-link)` | Anchor link tag colour on hover and focus. |
| `--sidebar-width` | `15rem` | Width of the sidebar. |
| `--sidebar-color-active` | `#e1e8ed` | Background colour of the current active route in the sidebar. |
| `--input-color-text` | `inherit` | Input and button element text colour. |
| `--input-color-placeholder` | `var(--color-muted)` | Input and button element placeholder text colour. |
| `--input-color-background` | `#fff` | Input and button element background colour. |
| `--input-color-border` | `#a7b6c2` | Input and button element border colour. |
| `--input-color-border-hover` | `rgba(48, 64, 77, 0.5)` | Input and button element border colour on hover. |

<!-- prettier-ignore-end -->

### Examples

#### Custom Branding

xx ([see live example](https://microdoc.js.org/examples/theme1.html)):

```html
<style>
  @import url("https://fonts.googleapis.com/css2?family=Rubik&display=swap");

  :root {
    --color-primary: #d97706;
    --color-background: #fff;
    --color-text: #111827;
    --color-border: #e5e7eb;
    --sidebar-color-active: #f3f4f6;

    font-family: "Rubik", sans-serif;
    font-size: 18px;
  }
</style>
```

#### Dark Theme

> **Tip:** See the [dark mode plugin](plugins/dark-mode.md) for a way to toggle between themes.

Simple dark theme ([see live example](https://microdoc.js.org/examples/theme2.html)):

```html
<style>
  :root {
    --color-primary: #48aff0;
    --color-background: #10161a;
    --color-text: #ced9e0;
    --color-muted: #738694;
    --color-border: #30404d;
    --sidebar-color-active: #202b33;
    --input-color-text: #d8e1e8;
    --input-color-placeholder: #a7b6c2;
    --input-color-background: #293742;
    --input-color-border: #5c7080;
    --input-color-border-hover: #a7b6c2;
  }
</style>
```

#### No Sidebar

Hide the entire sidebar e.g., for a single page docs ([see live example](https://microdoc.js.org/examples/theme3.html)):

```html
<style>
  .microdoc-sidebar {
    display: none;
  }
</style>
```

#### No Footer

Hide the "Powered by microdoc" footer message ([see live example](https://microdoc.js.org/examples/theme4.html)):

```html
<style>
  .microdoc-footer {
    display: none;
  }
</style>
```
