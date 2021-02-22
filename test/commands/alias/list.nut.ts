/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from '@salesforce/command/lib/test';

describe('alias:list NUTs', () => {
  let testSession: TestSession;

  describe('alias:list without results', () => {
    before(() => {
      testSession = TestSession.create({});
    });

    it('lists no aliases correctly', () => {
      const res = execCmd('alias:list --json', { ensureExitCode: 0 });
      expect(res.jsonOutput).to.deep.equal({
        result: [],
        status: 0,
      });
    });
  });

  describe('alias:list with singular result', () => {
    before(() => {
      testSession = TestSession.create({
        setupCommands: ['sfdx alias:set DevHub=mydevhuborg@salesforce.com'],
      });
    });

    it('lists singular alias correctly', () => {
      const res = execCmd('alias:list --json', { ensureExitCode: 0 });
      expect(res.jsonOutput).to.deep.equal({
        result: [
          {
            alias: 'DevHub',
            value: 'mydevhuborg@salesforce.com',
          },
        ],
        status: 0,
      });
    });
  });

  describe('alias:list with multiple results', () => {
    before(() => {
      testSession = TestSession.create({
        setupCommands: [
          'sfdx alias:set DevHub=mydevhuborg@salesforce.com',
          'sfdx alias:set Admin=admin@salesforce.com',
          'sfdx alias:set user=user@salesforce.com',
        ],
      });
    });

    it('lists multiple results correctly', () => {
      const res = execCmd('alias:list --json', { ensureExitCode: 0 });
      expect(res.jsonOutput).to.deep.equal({
        result: [
          {
            alias: 'DevHub',
            value: 'mydevhuborg@salesforce.com',
          },
          {
            alias: 'Admin',
            value: 'admin@salesforce.com',
          },
          {
            alias: 'user',
            value: 'user@salesforce.com',
          },
        ],
        status: 0,
      });
    });
  });

  afterEach(async () => {
    await testSession?.clean();
  });
});
