/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

const { onBeforeBuild } = require('ekscss');
// @ts-expect-error - no types yet
const { preloadApply } = require('@ekscss/framework/utils');

onBeforeBuild(preloadApply);

// @ts-expect-error - no types yet
module.exports = require('@ekscss/framework/config');
