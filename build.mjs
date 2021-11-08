// FIXME: Remove these lint exceptions once linting can handle mjs
//  ↳ When TS 4.5 is released and typescript-eslint has support
//  ↳ https://github.com/typescript-eslint/typescript-eslint/issues/3950
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { minify } from 'terser';

const require = createRequire(import.meta.url);

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const target = ['chrome60', 'edge79', 'firefox55', 'safari11.1'];

/** @param {?Error} error */
function handleErr(error) {
  console.error(error);
  process.exitCode = 1;
}

/**
 *
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
    // @ts-expect-error - FIXME:!
    build.onEnd((result) => esbuild.analyzeMetafile(result.metafile).then(console.log));
  },
};

/** @type {esbuild.Plugin} */
const minifyCss = {
  name: 'minify-css',
  setup(build) {
    if (build.initialOptions.write !== false) return;

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
                  'break',
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
    if (build.initialOptions.write !== false) return;

    build.onEnd(async (result) => {
      if (result.outputFiles) {
        const outputJsMap = findOutputFile(result.outputFiles, '.js.map');
        const { file, index } = findOutputFile(result.outputFiles, '.js');

        const { code, map } = await minify(decodeUTF8(file.contents), {
          ecma: 2020,
          compress: {
            passes: 2,
            unsafe_methods: true,
            unsafe_proto: true,
          },
          sourceMap: {
            content: decodeUTF8(outputJsMap.file.contents),
            filename: path.basename(file.path),
            url: path.basename(outputJsMap.file.path),
          },
        });

        // @ts-expect-error - map is string
        result.outputFiles[outputJsMap.index].contents = encodeUTF8(map);
        // @ts-expect-error - FIXME: code is defined
        result.outputFiles[index].contents = encodeUTF8(code);
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
      xcss(),
      analyzeMeta,
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
        xcss(),
        fuseBasic,
        analyzeMeta,
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
