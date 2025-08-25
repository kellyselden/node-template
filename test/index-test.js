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

async function assertExpectedFiles(cwd, ignoredFiles) {
  let actual = await walkDir(cwd);
  let expected = await walkDir(path.resolve(__dirname, '../files'));

  for (let ignoredFile of ignoredFiles.map(path.normalize)) {
    expected.splice(expected.indexOf(ignoredFile), 1);
  }

  expect(actual).to.deep.equal(expected);
}

describe(function() {
  this.timeout(5e3);

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

    expect(require(path.join(cwd, 'package')).devDependencies)
      .to.have.property(name, version);

    expect(require(path.join(cwd, 'package')).devDependencies)
      .to.not.have.property('renovate-config-standard');

    expect(path.join(cwd, 'README.md'))
      .to.not.be.a.path();

    expect(path.join(cwd, '.travis.yml'))
      .to.not.be.a.path();

    expect(path.join(cwd, 'appveyor.yml'))
      .to.not.be.a.path();

    expect(path.join(cwd, '.github'))
      .to.not.be.a.path();

    expect(path.join(cwd, 'renovate.json'))
      .to.not.be.a.path();

    await assertExpectedFiles(cwd, [
      'README.md',
      '.travis.yml',
      'appveyor.yml',
      '.github/workflows/ci.yml',
      '.github/workflows/publish.yml',
      'renovate.json'
    ]);
  });

  it('travis-ci', async function() {
    let cwd = await emberInit({
      args: [
        '-b',
        this.blueprintPath,
        '--travis-ci'
      ]
    });

    expect(path.join(cwd, 'README.md'))
      .to.not.be.a.path();

    expect(path.join(cwd, '.travis.yml'))
      .to.be.a.file()
      .and.equal(path.join(fixturesDir, 'default/.travis.yml'));

    expect(path.join(cwd, 'appveyor.yml'))
      .to.not.be.a.path();

    expect(path.join(cwd, '.github'))
      .to.not.be.a.path();

    await assertExpectedFiles(cwd, [
      'README.md',
      'appveyor.yml',
      '.github/workflows/ci.yml',
      '.github/workflows/publish.yml',
      'renovate.json'
    ]);
  });

  it('appveyor', async function() {
    let cwd = await emberInit({
      args: [
        '-b',
        this.blueprintPath,
        '--appveyor'
      ]
    });

    expect(path.join(cwd, 'README.md'))
      .to.not.be.a.path();

    expect(path.join(cwd, '.travis.yml'))
      .to.not.be.a.path();

    expect(path.join(cwd, 'appveyor.yml'))
      .to.be.a.file();

    expect(path.join(cwd, '.github'))
      .to.not.be.a.path();

    await assertExpectedFiles(cwd, [
      'README.md',
      '.travis.yml',
      '.github/workflows/ci.yml',
      '.github/workflows/publish.yml',
      'renovate.json'
    ]);
  });

  it('github-actions', async function() {
    let cwd = await emberInit({
      args: [
        '-b',
        this.blueprintPath,
        '--github-actions'
      ]
    });

    expect(path.join(cwd, 'README.md'))
      .to.not.be.a.path();

    expect(path.join(cwd, '.travis.yml'))
      .to.not.be.a.path();

    expect(path.join(cwd, 'appveyor.yml'))
      .to.not.be.a.path();

    expect(path.join(cwd, '.github/workflows/ci.yml'))
      .to.be.a.file()
      .and.equal(path.join(fixturesDir, 'default/ci.yml'));

    await assertExpectedFiles(cwd, [
      'README.md',
      '.travis.yml',
      'appveyor.yml',
      'renovate.json'
    ]);
  });

  it('renovate', async function() {
    let cwd = await emberInit({
      args: [
        '-b',
        this.blueprintPath,
        '--renovate'
      ]
    });

    expect(require(path.join(cwd, 'package')).devDependencies)
      .to.have.property('renovate-config-standard');

    expect(path.join(cwd, 'renovate.json'))
      .to.be.a.file();

    await assertExpectedFiles(cwd, [
      'README.md',
      '.travis.yml',
      'appveyor.yml',
      '.github/workflows/ci.yml',
      '.github/workflows/publish.yml'
    ]);
  });

  it('dependabot', async function() {
    let cwd = await emberInit({
      args: [
        '-b',
        this.blueprintPath,
        '--dependabot'
      ]
    });

    expect(require(path.join(cwd, 'package')).devDependencies)
      .to.not.have.property('renovate-config-standard');

    expect(path.join(cwd, 'renovate.json'))
      .to.not.be.a.path();

    await assertExpectedFiles(cwd, [
      'README.md',
      '.travis.yml',
      'appveyor.yml',
      '.github/workflows/ci.yml',
      '.github/workflows/publish.yml',
      'renovate.json'
    ]);
  });

  describe('repo-slug', function() {
    let repoSlug = 'foo/bar';

    it('works', async function() {
      let cwd = await emberInit({
        args: [
          '-b',
          this.blueprintPath,
          `--repo-slug=${repoSlug}`
        ]
      });

      expect(path.join(cwd, 'README.md'))
        .to.not.be.a.path();

      expect(path.join(cwd, '.travis.yml'))
        .to.not.be.a.path();

      expect(path.join(cwd, 'appveyor.yml'))
        .to.not.be.a.path();

      expect(path.join(cwd, '.github'))
        .to.not.be.a.path();
    });

    it('travis-ci', async function() {
      let cwd = await emberInit({
        args: [
          '-b',
          this.blueprintPath,
          `--repo-slug=${repoSlug}`,
          '--travis-ci'
        ]
      });

      expect(path.join(cwd, 'README.md'))
        .to.be.a.file()
        .and.equal(path.resolve(__dirname, 'fixtures/repo-slug/travis-ci/README.md'));

      expect(path.join(cwd, '.travis.yml'))
        .to.be.a.file()
        .and.equal(path.join(fixturesDir, 'repo-slug/travis-ci/.travis.yml'));
    });

    it('appveyor', async function() {
      let cwd = await emberInit({
        args: [
          '-b',
          this.blueprintPath,
          `--repo-slug=${repoSlug}`,
          '--appveyor=appveyor_test_key'
        ]
      });

      expect(path.join(cwd, 'README.md'))
        .to.be.a.file()
        .and.equal(path.resolve(__dirname, 'fixtures/repo-slug/appveyor/README.md'));
    });

    it('travis-ci + appveyor', async function() {
      let cwd = await emberInit({
        args: [
          '-b',
          this.blueprintPath,
          `--repo-slug=${repoSlug}`,
          '--travis-ci',
          '--appveyor=appveyor_test_key'
        ]
      });

      expect(path.join(cwd, 'README.md'))
        .to.be.a.file()
        .and.equal(path.resolve(__dirname, 'fixtures/repo-slug/travis-ci+appveyor/README.md'));
    });

    it('github-actions', async function() {
      let cwd = await emberInit({
        args: [
          '-b',
          this.blueprintPath,
          `--repo-slug=${repoSlug}`,
          '--github-actions'
        ]
      });

      expect(path.join(cwd, 'README.md'))
        .to.not.be.a.path();
    });
  });
});
