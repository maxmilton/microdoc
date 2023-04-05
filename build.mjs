/* eslint-disable import/no-extraneous-dependencies, no-param-reassign, no-console, no-bitwise */

import esbuild from 'esbuild';
import {
  decodeUTF8,
  encodeUTF8,
  minifyTemplates,
  stripWhitespace,
  writeFiles,
} from 'esbuild-minify-templates';
import { xcss } from 'esbuild-plugin-ekscss';
import * as lightningcss from 'lightningcss';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import * as terser from 'terser';
import pkg from './package.json' assert { type: 'json' };

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const dir = path.resolve(); // similar to __dirname
const target = ['chrome55', 'edge18', 'firefox53', 'safari11'];

// Keep mangled names consistent between all JS bundles
const mangleCache = {
  _refs: 'r',
  collect: 'c',
};

/**
 * @param {esbuild.OutputFile[]} outputFiles
 * @param {string} ext - File extension to match.
 * @returns {{ file: esbuild.OutputFile; index: number; }}
 */
function findOutputFile(outputFiles, ext) {
  const index = outputFiles.findIndex((outputFile) =>
    outputFile.path.endsWith(ext),
  );
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
const minifyCSS = {
  name: 'minify-css',
  setup(build) {
    if (!build.initialOptions.minify) return;

    build.onEnd((result) => {
      if (result.outputFiles) {
        const outCSS = findOutputFile(result.outputFiles, '.css');
        const outCSSMap = findOutputFile(result.outputFiles, '.css.map');

        if (outCSS.file) {
          // TODO: Remove unnecessary classes from final CSS:
          // - blockquote
          // - code
          // - hyphenate
          // - table
          // - table-zebra

          // FIXME: Don't remove /*! comments
          const minified = lightningcss.transform({
            filename: outCSS.file.path,
            code: Buffer.from(outCSS.file.contents),
            minify: true,
            sourceMap: outCSSMap.index !== -1,
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

          if (outCSSMap.index !== -1 && minified.map) {
            result.outputFiles[outCSSMap.index].contents = encodeUTF8(
              minified.map.toString(),
            );
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
const minifyJS = {
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

        if (outMap.index !== -1 && map) {
          result.outputFiles[outMap.index].contents = encodeUTF8(
            map.toString(),
          );
        }
        result.outputFiles[outJS.index].contents = encodeUTF8(code);
      }
    });
  },
};

/** @type {esbuild.Plugin} */
const buildHTML = {
  name: 'build-html',
  setup(build) {
    build.onEnd(async (result) => {
      if (result.outputFiles) {
        const outCSS = findOutputFile(result.outputFiles, '.css');

        const html = `
          <script>location.href="/dev#/dev/showcase.html"</script>
          <div id=showcase></div>
          <style>${decodeUTF8(outCSS.file.contents)}</style>
        `;

        await fs.writeFile(
          path.join(dir, 'docs/dev/showcase.html'),
          dev
            ? html
                .trim()
                // fixes for markdown parser to recognise HTML
                .replace(/\n\s+</g, '\n<')
                .replace('\n\n', '\n')
            : stripWhitespace(html),
        );

        // Remove CSS file from output
        result.outputFiles.splice(outCSS.index, 1);
      }
    });
  },
};

// Main web app
/** @type {esbuild.BuildOptions} */
const esbuildConfig1 = {
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
    minifyCSS,
    minifyJS,
    writeFiles(),
  ],
  banner: {
    css: `/*!
* microdoc v${pkg.version} - https://microdoc.js.org
* (c) 2023 Max Milton
* MIT Licensed - https://github.com/maxmilton/microdoc/blob/main/LICENSE
*/`,
    js: `/*!
* microdoc v${pkg.version} - https://microdoc.js.org
* (c) 2023 Max Milton
* MIT Licensed - https://github.com/maxmilton/microdoc/blob/main/LICENSE
*/ "use strict";`,
  },
  bundle: true,
  minify: !dev,
  mangleProps: /_refs|collect/,
  mangleCache,
  sourcemap: true,
  write: dev,
  metafile: !dev && process.stdout.isTTY,
  logLevel: 'debug',
};

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

// EXPERIMENTAL: Showcase web app
/** @type {esbuild.BuildOptions} */
const esbuildConfig2 = {
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
    minifyCSS,
    minifyJS,
    buildHTML,
    writeFiles(),
  ],
  banner: { js: '"use strict";' },
  bundle: true,
  minify: !dev,
  mangleProps: /_refs|collect/,
  mangleCache,
  sourcemap: dev && 'inline',
  write: false, // never save js to disk (use buildHTML plugin instead)
  metafile: !dev && process.stdout.isTTY,
  logLevel: 'debug',
};

// Custom PrismJS theme
/** @type {esbuild.BuildOptions} */
const esbuildConfig3 = {
  entryPoints: ['src/plugin/prism.xcss'],
  outfile: 'plugin/prism.css',
  target,
  plugins: [xcss(), minifyCSS, writeFiles()],
  banner: {
    css: `/*!
* microdoc prism theme v${pkg.version} - https://microdoc.js.org
* (c) 2023 Max Milton
* MIT Licensed - https://github.com/maxmilton/microdoc/blob/main/LICENSE
*/`,
  },
  bundle: true,
  minify: !dev,
  write: dev,
  logLevel: 'debug',
};

// Plugins
/** @type {esbuild.BuildOptions[]} */
const pluginEsbuildConfigs = [];

for (const plugin of ['dark-mode', 'preload', 'prevnext', 'search']) {
  pluginEsbuildConfigs.push({
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
      minifyCSS,
      minifyJS,
      writeFiles(),
    ],
    format: 'iife',
    banner: {
      js: `/*!
* microdoc ${plugin} plugin v${pkg.version} - https://microdoc.js.org
* (c) 2023 Max Milton
* MIT Licensed - https://github.com/maxmilton/microdoc/blob/main/LICENSE
*/ "use strict";`,
    },
    bundle: true,
    minify: !dev,
    mangleProps: /_refs|collect/,
    mangleCache,
    sourcemap: true,
    write: dev,
    metafile: !dev && process.stdout.isTTY,
    logLevel: 'debug',
  });
}

if (dev) {
  await Promise.all([
    esbuild.context(esbuildConfig1),
    esbuild.context(esbuildConfig2),
    esbuild.context(esbuildConfig3),
    ...pluginEsbuildConfigs.map((config) => esbuild.context(config)),
  ]).then((contexts) => contexts.map((context) => context.watch()));
} else {
  await esbuild.build(esbuildConfig1);
  await esbuild.build(esbuildConfig2);
  await esbuild.build(esbuildConfig3);

  for (const config of pluginEsbuildConfigs) {
    // eslint-disable-next-line no-await-in-loop
    await esbuild.build(config);
  }
}
