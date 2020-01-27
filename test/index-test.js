'use strict';

const { describe } = require('./helpers/mocha');
const { expect } = require('./helpers/chai');
const path = require('path');
const {
  emberInit: _emberInit,
  setUpBlueprintMocha
} = require('ember-cli-update-test-helpers');
const klaw = require('klaw');

const fixturesDir = path.resolve(__dirname, 'fixtures');

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

async function walkDir(dir) {
  return await new Promise((resolve, reject) => {
    let items = [];
    klaw(dir)
      .on('data', item => {
        if (!item.stats.isDirectory()) {
          items.push(path.relative(dir, item.path));
        }
      })
      .on('end', () => resolve(items))
      .on('error', reject);
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

    expect(require(path.join(cwd, 'package.json')).devDependencies[name])
      .to.equal(version);

    expect(path.join(cwd, 'README.md'))
      .to.not.be.a.path();

    expect(path.join(cwd, '.travis.yml'))
      .to.be.a.file()
      .and.equal(path.join(fixturesDir, 'default/.travis.yml'));

    expect(path.join(cwd, '.github'))
      .to.not.be.a.path();

    let actual = await walkDir(cwd);
    let expected = await walkDir(path.resolve(__dirname, '../files'));

    expected.splice(expected.indexOf('README.md'), 1);
    expected.splice(expected.indexOf('.github/workflows/ci.yml'), 1);
    expected.splice(expected.indexOf('.github/workflows/publish.yml'), 1);

    expect(actual).to.deep.equal(expected);
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

    expect(path.join(cwd, '.travis.yml'))
      .to.be.a.file()
      .and.equal(path.join(fixturesDir, 'repo-slug/.travis.yml'));

    expect(path.join(cwd, '.github'))
      .to.not.be.a.path();

    let actual = await walkDir(cwd);
    let expected = await walkDir(path.resolve(__dirname, '../files'));

    expected.splice(expected.indexOf('.github/workflows/ci.yml'), 1);
    expected.splice(expected.indexOf('.github/workflows/publish.yml'), 1);

    expect(actual).to.deep.equal(expected);
  });

  it('ci-provider=github-actions', async function() {
    let cwd = await emberInit({
      args: [
        '-b',
        this.blueprintPath,
        '--ci-provider=github-actions'
      ]
    });

    expect(path.join(cwd, 'README.md'))
      .to.not.be.a.path();

    expect(path.join(cwd, '.travis.yml'))
      .to.not.be.a.path();

    expect(path.join(cwd, '.github'))
      .to.be.a.directory();

    let actual = await walkDir(cwd);
    let expected = await walkDir(path.resolve(__dirname, '../files'));

    expected.splice(expected.indexOf('.travis.yml'), 1);
    expected.splice(expected.indexOf('README.md'), 1);

    expect(actual).to.deep.equal(expected);
  });
});
