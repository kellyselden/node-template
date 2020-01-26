'use strict';

const { describe } = require('./helpers/mocha');
const { expect } = require('./helpers/chai');
const path = require('path');
const {
  emberInit: _emberInit,
  setUpBlueprintMocha
} = require('ember-cli-update-test-helpers');

async function emberInit({
  args = []
}) {
  return await _emberInit({
    args: [
      '-sn',
      ...args
    ]
  });
}

describe(function() {
  this.timeout(5 * 1000);

  // eslint-disable-next-line mocha/no-setup-in-describe
  setUpBlueprintMocha.call(this);

  it('works', async function() {
    let cwd = await emberInit({
      args: [
        '-b',
        this.blueprintPath
      ]
    });

    let {
      name,
      version
    } = require('../package');

    expect(require(path.join(cwd, 'package.json')).optionalDependencies[name])
      .to.equal(version);

    expect(path.join(cwd, 'README.md'))
      .to.not.be.a.path();
  });

  it('repo-slug', async function() {
    let repoSlug = 'foo/bar';

    let cwd = await emberInit({
      args: [
        '-b',
        this.blueprintPath,
        `--repo-slug=${repoSlug}`
      ]
    });

    expect(path.join(cwd, 'README.md'))
      .to.be.a.file()
      .and.equal(path.resolve(__dirname, 'fixtures/repo-slug/README.md'));
  });
});
