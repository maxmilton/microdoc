/* eslint-disable import/no-extraneous-dependencies */

import esbuild from 'esbuild';
import { minifyTemplates, writeFiles } from 'esbuild-minify-templates';
import { xcss } from 'esbuild-plugin-ekscss';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const target = ['chrome78', 'firefox77', 'safari11', 'edge44'];

/** @param {?Error} err */
function handleErr(err) {
  if (err) throw err;
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
    banner: { js: '"use strict";' },
    bundle: true,
    minify: !dev,
    sourcemap: true,
    watch: dev,
    write: dev,
    logLevel: 'debug',
  })
  .then(minifyTemplates)
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
    .then(writeFiles)
    .catch(handleErr);
});
