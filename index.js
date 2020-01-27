'use strict';

const {
  name,
  version
} = require('./package');

module.exports = {
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

    function remove(file) {
      let i = files.indexOf(file);
      if (i !== -1) {
        files.splice(i, 1);
      }
    }

    switch (this.options.ciProvider) {
      case 'github-actions': {
        remove('.travis.yml');
        remove('README.md');
        break;
      }
      case 'travis-ci':
      default: {
        remove('.github/workflows/ci.yml');
        remove('.github/workflows/publish.yml');
        if (!this.options.repoSlug) {
          remove('README.md');
        }
      }
    }

    return files;
  }
};
