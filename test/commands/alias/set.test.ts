/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect, test } from '@salesforce/command/lib/test';
import * as sinon from 'sinon';
import { GlobalInfo } from '@salesforce/core';

describe('alias:set', () => {
  let sandbox: sinon.SinonSandbox;
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    sandbox.stub(GlobalInfo, 'getInstance').resolves(GlobalInfo.prototype);
    sandbox.stub(GlobalInfo.prototype, 'write').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  test
    .stdout()
    .command(['alias:set', 'Coffee=espresso', '--json'])
    .it('returns new alias', (ctx) => {
      const response = JSON.parse(ctx.stdout);
      expect(response.result).to.deep.equal([
        {
          alias: 'Coffee',
          value: 'espresso',
        },
      ]);
    });

  test
    .stdout()
    .stderr()
    .command(['alias:set'])
    .it('throws error when no alias provided', (ctx) => {
      expect(ctx.stderr).to.include(
        'Provide required name=value pairs for the command. Enclose any values that contain spaces in double quotes.'
      );
    });
});
