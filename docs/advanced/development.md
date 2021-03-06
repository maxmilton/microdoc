# Development

<!-- TODO: Rewrite this page for "development of your own docs", including local microdoc install for offline use + move this current kind of thing to a CONTRIBUTING.md file -->
<!--
`docs/dev/package.json`:

```json
{
  "scripts": {
    "serve": "sirv .. --port 3000 --dev --cors"
  },
  "devDependencies": {
    "microdoc": "*",
    "sirv-cli": "*"
  }
}
```
 -->

<!-- TODO: Add a nice write up like https://github.com/bcoe/c8/blob/main/CONTRIBUTING.md -->

This page contains instructions for working on microdoc itself or [developing your own microdoc plugins](#plugin-development).

> 💡 **Note:** We use `pnpm` for package management. It's similar to `npm` and `yarn` which you're likely already familiar with. For installation instructions see <https://pnpm.io/installation>.

## Installation

1. Fork/clone the [maxmilton/microdoc](https://github.com/maxmilton/microdoc) git repo.
1. Install NPM dependencies:
   ```sh
   pnpm install
   ```

## Dev builds

You'll need to open two terminal windows, one for JS/CSS bundling and another to serve the `/docs` files.

### First terminal

1. Start build and watch for changes:
   ```sh
   pnpm run dev
   ```

### Second terminal

1. Enter the docs dev directory:
   ```sh
   cd docs/dev
   ```
1. Install the extra dependencies:
   ```sh
   pnpm install
   ```
1. Start the dev server:
   ```sh
   pnpm run serve
   ```
1. Open <http://localhost:3000/dev> in your browser

## Production builds

Run the build process:

```sh
pnpm run build
```

## Plugin Development

See the [source code of our official plugins](https://github.com/maxmilton/microdoc/tree/master/src/plugin) as a reference.

We use `stage1` as our JavaScript framework for rendering components etc. Plugins also have access to some of the stage1 API which is exposed via the `window.microdoc` global. You may want to check out <https://github.com/maxmilton/stage1>.
