'use strict';

const {
  defineConfig,
  globalIgnores
} = require('eslint/config');

const globals = require('globals');
const mocha = require('eslint-plugin-mocha');
const js = require('@eslint/js');

const {
  FlatCompat
} = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

module.exports = defineConfig([
  {
    files: [
      '**/*.js',
      'package.json'
    ],

    languageOptions: {
      ecmaVersion: 2022,
      parserOptions: {},
      globals: {}
    },

    extends: compat.extends('sane-node')
  },

  {
    files: [
      'test/**/*-test.js'
    ],

    languageOptions: {
      globals: {
        ...globals.mocha
      }
    },

    plugins: {
      mocha
    },

    extends: compat.extends('plugin:mocha/recommended'),

    rules: {
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-empty-description': 'off'
    }
  },

  globalIgnores([
    '!**/.*',
    'node_modules/',
    'files/',
    'test/fixtures/'
  ])
]);
