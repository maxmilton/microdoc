/* eslint-disable import/no-extraneous-dependencies, no-param-reassign, no-console */

import csso from 'csso';
import esbuild from 'esbuild';
import {
  decodeUTF8,
  encodeUTF8,
  minifyTemplates,
  writeFiles,
} from 'esbuild-minify-templates';
import { xcss } from 'esbuild-plugin-ekscss';
import fs from 'fs/promises';
import { createRequire } from 'module';
import path from 'path';
import * as terser from 'terser';

const require = createRequire(import.meta.url);

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const dir = path.resolve(); // no __dirname in node ESM
/** @type {import('./package.json')} */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pkg = JSON.parse(await fs.readFile('./package.json', 'utf8'));
const target = ['chrome55', 'edge18', 'firefox53', 'safari11'];

/** @param {?Error} error */
function handleErr(error) {
  console.error(error);
  process.exitCode = 1;
}

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
        const { file, index } = findOutputFile(result.outputFiles, '.css');

        if (file) {
          const ast = csso.syntax.parse(decodeUTF8(file.contents));
          const compressedAst = csso.syntax.compress(ast, {
            restructure: true,
            forceMediaMerge: true, // unsafe!
            usage: {
              blacklist: {
                // Remove unnecessary classes
                classes: [
                  'blockquote',
                  'code',
                  'hyphenate',
                  'table',
                  'table-zebra',
                ],
                // tags: [],
              },
            },
          }).ast;
          const css = csso.syntax.generate(compressedAst);

          result.outputFiles[index].contents = encodeUTF8(css);
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
        const outMap = findOutputFile(result.outputFiles, '.js.map');
        const outJS = findOutputFile(result.outputFiles, '.js');

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
esbuild
  .build({
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
* (c) 2021 Max Milton
* MIT Licensed - https://github.com/maxmilton/microdoc/blob/main/LICENSE
*/`,
      js: `/*!
* microdoc v${pkg.version} - https://microdoc.js.org
* (c) 2021 Max Milton
* MIT Licensed - https://github.com/maxmilton/microdoc/blob/main/LICENSE
*/ "use strict";`,
    },
    bundle: true,
    minify: !dev,
    sourcemap: true,
    watch: dev,
    write: dev,
    metafile: !dev && process.stdout.isTTY,
    logLevel: 'debug',
  })
  .catch(handleErr);

/** @type {esbuild.Plugin} */
const fuseBasic = {
  name: 'fuse-basic',
  setup(build) {
    build.onResolve({ filter: /^fuse\.js$/ }, () => ({
      path: require.resolve('fuse.js/dist/fuse.basic.esm.js'),
    }));
  },
};

// Plugins
for (const plugin of ['dark-mode', 'preload', 'prevnext', 'search']) {
  esbuild
    .build({
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
* (c) 2021 Max Milton
* MIT Licensed - https://github.com/maxmilton/microdoc/blob/main/LICENSE
*/ "use strict";`,
      },
      bundle: true,
      minify: !dev,
      sourcemap: true,
      watch: dev,
      write: dev,
      metafile: !dev && process.stdout.isTTY,
      logLevel: 'debug',
    })
    .catch(handleErr);
}

// Custom PrismJS theme
esbuild
  .build({
    entryPoints: ['src/plugin/prism.xcss'],
    outfile: 'plugin/prism.css',
    target,
    plugins: [xcss(), minifyCss, writeFiles()],
    banner: {
      css: `/*!
* microdoc prism theme v${pkg.version} - https://microdoc.js.org
* (c) 2021 Max Milton
* MIT Licensed - https://github.com/maxmilton/microdoc/blob/main/LICENSE
*/`,
    },
    bundle: true,
    minify: !dev,
    watch: dev,
    write: dev,
    logLevel: 'debug',
  })
  .catch(handleErr);

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
esbuild
  .build({
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
    sourcemap: dev && 'inline',
    watch: dev,
    write: false,
    metafile: !dev && process.stdout.isTTY,
    logLevel: 'debug',
  })
  .catch(handleErr);
