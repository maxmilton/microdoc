/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable import/no-extraneous-dependencies, no-param-reassign */

import esbuild from 'esbuild';
import {
  decodeUTF8,
  encodeUTF8,
  minifyTemplates,
  writeFiles,
} from 'esbuild-minify-templates';
import { xcss } from 'esbuild-plugin-ekscss';
import fs from 'fs';
import path from 'path';
import { minify } from 'terser';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const target = ['chrome78', 'firefox77', 'safari11', 'edge44'];

/** @param {?Error} err */
function handleErr(err) {
  if (err) throw err;
}

/**
 *
 * @param {esbuild.OutputFile[]} outputFiles
 * @param {string} ext - File extension to match.
 * @returns {{ file: esbuild.OutputFile; index: number; }}
 */
function findOutputFile(outputFiles, ext) {
  const index = outputFiles.findIndex((outputFile) => outputFile.path.endsWith(ext));

  return {
    file: outputFiles[index],
    index,
  };
}

/**
 * @param {esbuild.BuildResult} buildResult
 * @returns {Promise<esbuild.BuildResult>}
 */
async function minifyJs(buildResult) {
  if (buildResult.outputFiles) {
    const outputJsMap = findOutputFile(buildResult.outputFiles, '.js.map');
    const { file, index } = findOutputFile(buildResult.outputFiles, '.js');

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
    buildResult.outputFiles[outputJsMap.index].contents = encodeUTF8(map);
    buildResult.outputFiles[index].contents = encodeUTF8(code);
  }

  return buildResult;
}

// Main web app
esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    target,
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    plugins: [xcss()],
    banner: {
      js: `/*!
* microdoc v${pkg.version} - https://maxmilton.github.io/microdoc
* (c) 2021 Max Milton
* MIT Licensed - https://github.com/MaxMilton/microdoc/blob/main/LICENSE
*/ "use strict";`,
    },
    bundle: true,
    minify: !dev,
    sourcemap: true,
    watch: dev,
    write: dev,
    logLevel: 'debug',
  })
  .then(minifyTemplates)
  .then(minifyJs)
  .then(writeFiles)
  .catch(handleErr);

// Plugins
['search', 'preload'].forEach((pluginName) => {
  esbuild
    .build({
      entryPoints: [`src/plugins/${pluginName}.ts`],
      outfile: `dist/plugins/${pluginName}.js`,
      target,
      define: {
        'process.env.NODE_ENV': JSON.stringify(mode),
      },
      plugins: [xcss()],
      format: 'iife',
      banner: { js: '"use strict";' },
      bundle: true,
      minify: !dev,
      sourcemap: true,
      watch: dev,
      write: dev,
      logLevel: 'debug',
    })
    .then(minifyTemplates)
    .then(minifyJs)
    .then(writeFiles)
    .catch(handleErr);
});
