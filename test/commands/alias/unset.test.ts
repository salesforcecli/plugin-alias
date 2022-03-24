/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect, test } from '@salesforce/command/lib/test';
import * as sinon from 'sinon';

describe('alias:unset', () => {
  let sandbox: sinon.SinonSandbox;
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    test.command(['alias:set', 'Coffee=espresso,Bacon=breakfast']);
  });

  afterEach(() => sandbox.restore());

  test
    .stdout()
    .command(['alias:unset', 'Coffee', '--json'])
    .it('removes alias', (ctx) => {
      const response = JSON.parse(ctx.stdout);
      expect(response.result).to.deep.equal([
        {
          alias: 'Coffee',
          success: true,
        },
      ]);
    });

  test
    .stdout()
    .command(['alias:unset', 'Coffee', 'Bacon', '--json'])
    .it('removes multiple aliases', (ctx) => {
      const response = JSON.parse(ctx.stdout);
      expect(response.result).to.deep.equal([
        { alias: 'Coffee', success: true },
        { alias: 'Bacon', success: true },
      ]);
    });

  test
    .stdout()
    .stderr()
    .command(['alias:unset'])
    .it('throws error when no aliases provided', (ctx) => {
      expect(ctx.stderr).to.contain('Please provide alias name(s) to unset.');
    });
});
