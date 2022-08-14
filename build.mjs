/* eslint-disable import/no-extraneous-dependencies, no-param-reassign, no-console, no-bitwise */

import * as pcss from '@parcel/css';
import esbuild from 'esbuild';
import {
  decodeUTF8,
  encodeUTF8,
  minifyTemplates,
  writeFiles,
} from 'esbuild-minify-templates';
import { xcss } from 'esbuild-plugin-ekscss';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import * as terser from 'terser';
import pkg from './package.json' assert { type: 'json' };

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const dir = path.resolve(); // similar to __dirname
const target = ['chrome55', 'edge18', 'firefox53', 'safari11'];

/**
 * @param {esbuild.OutputFile[]} outputFiles
 * @param {string} ext - File extension to match.
 * @returns {{ file: esbuild.OutputFile; index: number; }}
 */
function findOutputFile(outputFiles, ext) {
  const index = outputFiles.findIndex((outputFile) => outputFile.path.endsWith(ext));
  return { file: outputFiles[index], index };
}

/** @type {esbuild.Plugin} */
const analyzeMeta = {
  name: 'analyze-meta',
  setup(build) {
    if (!build.initialOptions.metafile) return;
    build.onEnd((result) => {
      if (result.metafile) {
        esbuild
          .analyzeMetafile(result.metafile)
          .then(console.log)
          .catch(console.error);
      }
    });
  },
};

/** @type {esbuild.Plugin} */
const minifyCss = {
  name: 'minify-css',
  setup(build) {
    if (!build.initialOptions.minify) return;

    build.onEnd((result) => {
      if (result.outputFiles) {
        const outCSS = findOutputFile(result.outputFiles, '.css');

        if (outCSS.file) {
          // TODO: Remove unnecessary classes from final CSS:
          // - blockquote
          // - code
          // - hyphenate
          // - table
          // - table-zebra

          const minified = pcss.transform({
            filename: outCSS.file.path,
            code: Buffer.from(outCSS.file.contents),
            minify: true,
            sourceMap: dev,
            targets: {
              chrome: 55 << 16,
              edge: 18 << 16,
              firefox: 53 << 16,
              safari: (11 << 16) | (1 << 8),
            },
          });

          for (const warning of minified.warnings) {
            console.error('CSS WARNING:', warning.message);
          }

          result.outputFiles[outCSS.index].contents = encodeUTF8(
            minified.code.toString(),
          );
        }
      }
    });
  },
};

/** @type {esbuild.Plugin} */
const minifyJs = {
  name: 'minify-js',
  setup(build) {
    if (!build.initialOptions.minify) return;

    build.onEnd(async (result) => {
      if (result.outputFiles) {
        const outJS = findOutputFile(result.outputFiles, '.js');
        const outMap = findOutputFile(result.outputFiles, '.js.map');

        /** @type {terser.MinifyOptions} */
        const opts = {
          ecma: 2020,
          compress: {
            comparisons: false,
            passes: 2,
            inline: 2,
            unsafe: true,
          },
        };

        if (outMap.index !== -1) {
          opts.sourceMap = {
            content: decodeUTF8(outMap.file.contents),
            filename: path.basename(outJS.file.path),
            url: path.basename(outMap.file.path),
          };
        }

        const { code = '', map = '' } = await terser.minify(
          decodeUTF8(outJS.file.contents),
          opts,
        );

        if (outMap.index !== -1) {
          result.outputFiles[outMap.index].contents = encodeUTF8(
            map.toString(),
          );
        }
        result.outputFiles[outJS.index].contents = encodeUTF8(code);
      }
    });
  },
};

// Main web app
await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'microdoc.js',
  target,
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  plugins: [
    analyzeMeta,
    xcss(),
    minifyTemplates(),
    minifyCss,
    minifyJs,
    writeFiles(),
  ],
  banner: {
    css: `/*!
* microdoc v${pkg.version} - https://microdoc.js.org
* (c) 2022 Max Milton
* MIT Licensed - https://github.com/maxmilton/microdoc/blob/main/LICENSE
*/`,
    js: `/*!
* microdoc v${pkg.version} - https://microdoc.js.org
* (c) 2022 Max Milton
* MIT Licensed - https://github.com/maxmilton/microdoc/blob/main/LICENSE
*/ "use strict";`,
  },
  bundle: true,
  minify: !dev,
  mangleProps: /_refs|collect/,
  sourcemap: true,
  watch: dev,
  write: dev,
  metafile: !dev && process.stdout.isTTY,
  logLevel: 'debug',
});

/** @type {esbuild.Plugin} */
const fuseBasic = {
  name: 'fuse-basic',
  setup(build) {
    const require = createRequire(import.meta.url);

    build.onResolve({ filter: /^fuse\.js$/ }, () => ({
      path: require.resolve('fuse.js/dist/fuse.basic.esm.js'),
    }));
  },
};

// Plugins
for (const plugin of ['dark-mode', 'preload', 'prevnext', 'search']) {
  // eslint-disable-next-line no-await-in-loop
  await esbuild.build({
    entryPoints: [`src/plugin/${plugin}.ts`],
    outfile: `plugin/${plugin}.js`,
    target,
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    plugins: [
      analyzeMeta,
      xcss(),
      fuseBasic,
      minifyTemplates(),
      minifyCss,
      minifyJs,
      writeFiles(),
    ],
    format: 'iife',
    banner: {
      js: `/*!
* microdoc ${plugin} plugin v${pkg.version} - https://microdoc.js.org
* (c) 2022 Max Milton
* MIT Licensed - https://github.com/maxmilton/microdoc/blob/main/LICENSE
*/ "use strict";`,
    },
    bundle: true,
    minify: !dev,
    mangleProps: /_refs|collect/,
    sourcemap: true,
    watch: dev,
    write: dev,
    metafile: !dev && process.stdout.isTTY,
    logLevel: 'debug',
  });
}

// Custom PrismJS theme
await esbuild.build({
  entryPoints: ['src/plugin/prism.xcss'],
  outfile: 'plugin/prism.css',
  target,
  plugins: [xcss(), minifyCss, writeFiles()],
  banner: {
    css: `/*!
* microdoc prism theme v${pkg.version} - https://microdoc.js.org
* (c) 2022 Max Milton
* MIT Licensed - https://github.com/maxmilton/microdoc/blob/main/LICENSE
*/`,
  },
  bundle: true,
  minify: !dev,
  watch: dev,
  write: dev,
  logLevel: 'debug',
});

/** @type {esbuild.Plugin} */
const buildHtml = {
  name: 'build-html',
  setup(build) {
    build.onEnd(async (result) => {
      if (result.outputFiles) {
        const outputJs = findOutputFile(result.outputFiles, '.js').file;
        const outputCss = findOutputFile(result.outputFiles, '.css').file;

        // FIXME: Script loading hack is extremely dodgy
        const html = `<script>location.href="/dev#/dev/showcase.html"</script>
<div id="showcase"></div>
<style>${decodeUTF8(outputCss.contents)}</style>
<script>${decodeUTF8(outputJs.contents)}</script>
<img hidden src="" onerror="var s=document.createElement('script');s.appendChild(new Text(this.previousElementSibling.textContent));document.body.appendChild(s);s.remove();">`;

        await fs.writeFile(path.join(dir, 'docs/dev/showcase.html'), html);
      }
    });
  },
};

// EXPERIMENTAL: Showcase web app
await esbuild.build({
  entryPoints: ['src/showcase/index.ts'],
  outfile: 'docs/dev/showcase.js',
  target,
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  plugins: [
    analyzeMeta,
    xcss(),
    minifyTemplates(),
    minifyCss,
    minifyJs,
    buildHtml,
  ],
  banner: { js: '"use strict";' },
  bundle: true,
  minify: !dev,
  mangleProps: /_refs|collect/,
  sourcemap: dev && 'inline',
  watch: dev,
  write: false,
  metafile: !dev && process.stdout.isTTY,
  logLevel: 'debug',
});
