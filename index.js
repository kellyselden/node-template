'use strict';

module.exports = {
  name: require('./package').name,

  locals(options) {
    let { name } = options.entity;

    let encodedName = name.replace(/@/g, '%40').replace(/\//g, '%2F');

    return {
      name,
      encodedName
    };
  }
};
