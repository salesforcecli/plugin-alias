import { expect, test } from '@salesforce/command/lib/test';
import { Aliases } from '@salesforce/core';
import * as sinon from 'sinon';

describe('alias:unset', () => {
  let sandbox: sinon.SinonSandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(Aliases.prototype, 'getGroup').returns({
      Coffee: 'espresso',
      Bacon: 'breakfast'
    });
    sandbox
      .stub(Aliases.prototype, 'unset')
      .withArgs('BadKey')
      .throws(new Error('BadKey'));
  });

  afterEach(() => sandbox.restore());

  test
    .stdout()
    .command(['alias:unset', 'Coffee', '--json'])
    .it('removes alias', ctx => {
      const response = JSON.parse(ctx.stdout);
      expect(response.result).to.deep.equal([
        {
          alias: 'Coffee',
          success: true
        }
      ]);
    });

  test
    .stdout()
    .command(['alias:unset', 'Coffee', 'Bacon', '--json'])
    .it('removes multiple aliases', ctx => {
      const response = JSON.parse(ctx.stdout);
      expect(response.result).to.deep.equal([
        { alias: 'Coffee', success: true },
        { alias: 'Bacon', success: true }
      ]);
    });

  test
    .stdout()
    .stderr()
    .command(['alias:unset'])
    .it('throws error when no aliases provided', ctx => {
      expect(ctx.stderr).to.contain('Please provide alias name(s) to unset.');
    });

  test
    .stdout()
    .stderr()
    .command(['alias:unset', 'BadKey'])
    .it('throws error when no aliases provided', ctx => {
      expect(ctx.stderr).to.contain('ERROR running alias:unset');
    });

  test
    .stdout()
    .stderr()
    .command(['alias:unset', 'BadKey', '--json'])
    .it('returns error when no aliases and --json provided', ctx => {
      const response = JSON.parse(ctx.stdout);
      expect(response.status).to.equal(1);
      expect(response.message).to.equal('BadKey');
    });
});
