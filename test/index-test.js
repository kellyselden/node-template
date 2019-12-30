'use strict';

const { describe } = require('./helpers/mocha');
const { expect } = require('./helpers/chai');
const execa = require('execa');
const path = require('path');
const { buildTmp } = require('git-fixtures');
const { promisify } = require('util');
const getTmpDir = promisify(require('tmp').dir);
const gitInit = require('git-diff-apply/src/git-init');
const copy = require('git-diff-apply/src/copy');
const commitAndTag = require('git-diff-apply/src/commit-and-tag');

function ecu(args, options) {
  let ps = execa('ember-cli-update', args, {
    preferLocal: true,
    localDir: __dirname,
    stdio: ['pipe', 'pipe', 'inherit'],
    ...options
  });

  ps.stdout.pipe(process.stdout);

  return ps;
}

describe(function() {
  this.timeout(10 * 1000);

  before(async function() {
    this.blueprintPath = await getTmpDir();

    await gitInit({ cwd: this.blueprintPath });
    await copy(path.resolve(__dirname, '..'), this.blueprintPath);
    await commitAndTag('v0.0.0', { cwd: this.blueprintPath });
  });

  beforeEach(async function() {
    this.tmpPath = await buildTmp({
      fixturesPath: path.resolve(__dirname, 'fixtures/base')
    });
  });

  it('works', async function() {
    await ecu([
      'init',
      '-b',
      this.blueprintPath
    ], {
      cwd: this.tmpPath
    });

    expect(path.join(this.tmpPath, 'README.md'))
      .to.be.a.file()
      .and.equal(path.resolve(__dirname, 'fixtures/expected/README.md'));
  });
});
