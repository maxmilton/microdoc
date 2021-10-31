/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

// @ts-expect-error - no types yet
const framework = require('@ekscss/framework/config');
// @ts-expect-error - no types yet
const { preloadApply } = require('@ekscss/framework/utils');
const { merge } = require('dset/merge');
const { onBeforeBuild } = require('ekscss');

onBeforeBuild(preloadApply);

/** @type {(import('esbuild-plugin-ekscss').XCSSConfig)} */
module.exports = merge(framework, {
  globals: {
    gutterCol: '1rem',

    // FIXME: Remove after next @ekscss/framework release
    spinner: {
      size: '48px',
      width: '5px',
      animateSpeed: '496ms',
      animateTiming: 'linear',
    },
  },
});
