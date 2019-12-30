'use strict';

module.exports = {
  name: require('./package').name,

  locals(options) {
    let { name } = options.entity;

    let encodedName = encodeURIComponent(name);

    return {
      name,
      encodedName
    };
  }
};
