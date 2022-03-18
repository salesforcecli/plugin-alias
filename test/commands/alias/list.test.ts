/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect, test } from '@salesforce/command/lib/test';
import { GlobalInfo } from '@salesforce/core';
import * as sinon from 'sinon';

let sandbox: sinon.SinonSandbox;

describe('alias:list', () => {
  describe('no existing aliases', () => {
    beforeEach(async () => {
      sandbox = sinon.createSandbox();
      sandbox.stub(GlobalInfo, 'getInstance').resolves(GlobalInfo.prototype);
    });

    afterEach(() => {
      sandbox.restore();
    });

    test
      .stdout()
      .command(['alias:list'])
      .it('shows no results', (ctx) => {
        expect(ctx.stdout).to.contain('No results found');
      });

    test
      .stdout()
      .command(['alias:list', '--json'])
      .it('shows no results with --json', (ctx) => {
        const response = JSON.parse(ctx.stdout);
        expect(response.status).to.equal(0);
        expect(response.result.length).to.equal(0);
      });
  });

  describe('existing aliases', () => {
    beforeEach(async () => {
      sandbox = sinon.createSandbox();
      sandbox.stub(GlobalInfo, 'getInstance').resolves({
        aliases: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore we don't need to stub the entire object
          getAll: () => {
            return { Coffee: 'espresso' };
          },
        },
      });
    });

    afterEach(() => sandbox.restore());

    test
      .stdout()
      .command(['alias:list', '--json'])
      .it('shows results', (ctx) => {
        const response = JSON.parse(ctx.stdout);
        expect(response.result).to.deep.equal([
          {
            alias: 'Coffee',
            value: 'espresso',
          },
        ]);
      });
  });
});
