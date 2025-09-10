'use strict';

const {
  defineConfig,
  globalIgnores,
} = require('eslint/config');

const config = require('@kellyselden/eslint-config');

module.exports = defineConfig([
  config,

  globalIgnores([
    'files/',
  ]),
]);
