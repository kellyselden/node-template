'use strict';

const {
  name,
  version
} = require('./package');

module.exports = {
  locals({
    repoSlug,
    travisCi,
    appveyor,
    renovate
  }) {
    return {
      name,
      version,
      repoSlug,
      travisCi,
      appveyor,
      renovate
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

    let {
      repoSlug,
      travisCi,
      appveyor,
      githubActions,
      renovate
    } = this.options;

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

    if (!renovate) {
      remove('renovate.json');
    }

    return files;
  }
};
