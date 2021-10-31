# Development

Note that the project uses `pnpm` for package management. It's similar to `npm` and `yarn` which you're likely familiar with. For installation instructions see <https://pnpm.io/installation>.

## Installation

Install NPM dependencies:

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
1. Install the extra dependencies
   ```sh
   pnpm install
   ```
1. Start the dev server:
   ```sh
   pnpm run serve
   ```
1. Open <http://localhost:3000/dev> in a browser

## Production builds

Run the build process:

```sh
pnpm run build
```
