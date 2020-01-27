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
      let i = files.indexOf('README.md');
      if (i !== -1) {
        files.splice(i, 1);
      }
    }

    return files;
  }
};
