'use strict';

const { describe } = require('./helpers/mocha');
const { expect } = require('./helpers/chai');
const execa = require('execa');
const path = require('path');
const {
  buildTmp
} = require('git-fixtures');

const blueprintPath = path.resolve(__dirname, '..');

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

  beforeEach(async function() {
    this.tmpPath = await buildTmp({
      fixturesPath: path.resolve(__dirname, 'fixtures')
    });
  });

  it('works', async function() {
    await ecu([
      'init',
      '-b',
      blueprintPath
    ], {
      cwd: this.tmpPath
    });

    expect(path.join(this.tmpPath, 'renovate.json'))
      .to.be.a.file();
  });
});
