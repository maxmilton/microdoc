/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies, strict */

'use strict';

const framework = require('@ekscss/framework/config');
const { extend, preloadApply } = require('@ekscss/framework/utils');
const { onBeforeBuild } = require('ekscss');

onBeforeBuild(() =>
  preloadApply(`
  @import '@ekscss/framework/level2.xcss';
  @import '@ekscss/framework/addon/alert.xcss';
  @import '@ekscss/framework/addon/code.xcss';
`),
);

module.exports = extend(framework, {
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
