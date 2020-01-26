'use strict';

const {
  name,
  version
} = require('./package');

module.exports = {
  locals() {
    return {
      name,
      version
    };
  }
};
