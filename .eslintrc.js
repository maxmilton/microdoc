'use strict'; // eslint-disable-line

const OFF = 0;

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    extraFileExtensions: ['.mjs', '.cjs'],
    project: ['./tsconfig.json', './test/tsconfig.json'],
  },
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    'import/prefer-default-export': OFF,
    'no-restricted-syntax': OFF,
    // stage1 uses underscores in synthetic event handler names
    'no-underscore-dangle': OFF,
  },
  overrides: [
    {
      files: ['.eslintrc.js', 'build.mjs', 'xcss.config.js'],
      parserOptions: {
        createDefaultProgram: true,
      },
    },
  ],
};
