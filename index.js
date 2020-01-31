'use strict';

const {
  name,
  version
} = require('./package');

module.exports = {
  locals({
    repoSlug,
    travisCi,
    appveyor
  }) {
    return {
      name,
      version,
      repoSlug,
      travisCi: travisCi !== false,
      appveyor
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

    let repoSlug = this.options.repoSlug;
    let travisCi = this.options.travisCi !== false;
    let appveyor = this.options.appveyor;
    let githubActions = this.options.githubActions;

    if (!travisCi) {
      remove('.travis.yml');
    }

    if (!appveyor) {
      remove('appveyor.yml');
    }

    if (!githubActions) {
      remove('.github/workflows/ci.yml');
      remove('.github/workflows/publish.yml');
    }

    let keepReadme;

    if (repoSlug && (travisCi || appveyor)) {
      keepReadme = true;
    }

    if (!keepReadme) {
      remove('README.md');
    }

    return files;
  }
};
