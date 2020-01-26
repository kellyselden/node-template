'use strict';

const {
  name,
  version
} = require('./package');

module.exports = {
  availableOptions: [
    {
      name: 'repo-slug',
      type: String
    }
  ],

  locals({
    repoSlug
  }) {
    return {
      name,
      version,
      repoSlug
    };
  },

  files() {
    let files = this._super.files.apply(this, arguments);

    if (!this.options.repoSlug) {
      files.splice(files.indexOf('README.md'), 1);
    }

    return files;
  }
};
