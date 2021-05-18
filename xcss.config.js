/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

const { onBeforeBuild } = require('ekscss');
const { preloadApply } = require('@ekscss/framework/utils');

onBeforeBuild(preloadApply);

module.exports = require('@ekscss/framework/config');
