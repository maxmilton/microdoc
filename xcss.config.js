/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

// @ts-expect-error - no types yet
const framework = require('@ekscss/framework/config');
// @ts-expect-error - no types yet
const { preloadApply } = require('@ekscss/framework/utils');
const { merge } = require('dset/merge');
const { onBeforeBuild } = require('ekscss');

onBeforeBuild(() => preloadApply(`
  @import '@ekscss/framework/level2.xcss';
  @import '@ekscss/framework/addon/alert.xcss';
`));

/** @type {(import('esbuild-plugin-ekscss').XCSSConfig)} */
module.exports = merge(framework, {
  globals: {
    color: {
      primary: 'var(--color-primary)',
      muted: 'var(--color-muted)',
      background: 'var(--color-background)',
      text: 'var(--color-text)',
      link: 'var(--color-link)',
      linkHover: 'var(--color-link-hover)',
    },

    containerWidthMax: 'var(--main-max-width)',
    gutterCol: '1rem',

    form: {
      checkboxCheckedBackgroundColor: 'var(--color-primary)',
      checkboxCheckedBorderColor: 'var(--color-primary)',
    },

    input: {
      textColor: 'var(--input-color-text)',
      backgroundColor: 'var(--input-color-background)',
      placeholderTextColor: 'var(--input-color-placeholder)',
      border: '1px solid var(--input-color-border)',
      hoverBorderColor: 'var(--input-color-border-hover)',
    },

    alert: {
      infoBorderColor: 'var(--blockquote-color-border)',
    },
  },
});
