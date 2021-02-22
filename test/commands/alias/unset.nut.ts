/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from '@salesforce/command/lib/test';

describe('alias:unset NUTs', () => {
  let testSession: TestSession;

  describe('alias:unset without alias file', () => {
    before(() => {
      testSession = TestSession.create({});
    });

    it('alias:unset --json', () => {
      // weird behavior that unsetting an alias that doesn't exist shows as success
      // there's no harm in doing so, just a little unintuitive
      const res = execCmd('alias:unset noAlias --json', { ensureExitCode: 0 });
      expect(res.jsonOutput).to.deep.equal({
        status: 0,
        result: [
          {
            alias: 'noAlias',
            success: true,
          },
        ],
      });
      const list = execCmd('alias:list --json', { ensureExitCode: 0 });
      expect(list.jsonOutput).to.deep.equal({
        status: 0,
        result: [],
      });
    });
  });
  describe('alias unset value', () => {
    before(() => {
      testSession = TestSession.create({
        setupCommands: [
          'sfdx alias:set DevHub=mydevhuborg@salesforce.com',
          'sfdx alias:set Admin=admin@salesforce.com',
          'sfdx alias:set user=user@salesforce.com',
        ],
      });
    });

    it('alias:unset --json', () => {
      const res = execCmd('alias:unset DevHub --json', { ensureExitCode: 0 });
      expect(res.jsonOutput).to.deep.equal({
        status: 0,
        result: [
          {
            alias: 'DevHub',
            success: true,
          },
        ],
      });
      const list = execCmd('alias:list --json', { ensureExitCode: 0 });
      expect(list.jsonOutput).to.deep.equal({
        status: 0,
        result: [
          {
            alias: 'Admin',
            value: 'admin@salesforce.com',
          },
          {
            alias: 'user',
            value: 'user@salesforce.com',
          },
        ],
      });
    });
  });

  describe('alias unset multiple values', () => {
    before(() => {
      testSession = TestSession.create({
        setupCommands: [
          'sfdx alias:set DevHub=mydevhuborg@salesforce.com',
          'sfdx alias:set Admin=admin@salesforce.com',
          'sfdx alias:set user=user@salesforce.com',
        ],
      });
    });

    it('alias:unset --json', () => {
      const res = execCmd('alias:unset DevHub user --json', { ensureExitCode: 0 });
      expect(res.jsonOutput).to.deep.equal({
        status: 0,
        result: [
          {
            alias: 'DevHub',
            success: true,
          },
          {
            alias: 'user',
            success: true,
          },
        ],
      });
      const list = execCmd('alias:list --json', { ensureExitCode: 0 });
      expect(list.jsonOutput).to.deep.equal({
        status: 0,
        result: [
          {
            alias: 'Admin',
            value: 'admin@salesforce.com',
          },
        ],
      });
    });
  });

  afterEach(async () => {
    await testSession?.clean();
  });
});
