/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from '@salesforce/command/lib/test';

let testSession: TestSession;

function unsetAll() {
  execCmd('sfdx alias:unset DevHub');
  execCmd('sfdx alias:unset Admin');
  execCmd('sfdx alias:unset user');
}

describe('alias:list NUTs', async () => {
  testSession = await TestSession.create({});

  describe('alias:list without results', () => {
    beforeEach(() => {
      unsetAll();
    });

    it('lists no aliases correctly', () => {
      const res = execCmd('alias:list --json', { ensureExitCode: 0 });
      expect(res.jsonOutput).to.deep.equal({
        result: [],
        status: 0,
      });
    });

    it('lists no aliases stdout', () => {
      const res: string = execCmd('alias:list').shellOutput;
      expect(res).to.include('No results found');
    });
  });

  describe('alias:list with singular result', () => {
    beforeEach(() => {
      unsetAll();
      execCmd('alias:set DevHub=mydevhuborg@salesforce.com');
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

    it('lists singular result correctly stdout', () => {
      const res: string = execCmd('alias:list', { ensureExitCode: 0 }).shellOutput;
      expect(res).to.include('=== Alias List');
      expect(res).to.include('DevHub');
      expect(res).to.include('mydevhuborg@salesforce.com');
    });
  });

  describe('alias:list with multiple results', () => {
    beforeEach(() => {
      unsetAll();
      execCmd('alias:set DevHub=mydevhuborg@salesforce.com');
      execCmd('alias:set Admin=admin@salesforce.com');
      execCmd('alias:set user=user@salesforce.com');
    });

    it('lists multiple results correctly JSON', () => {
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

    it('lists multiple results correctly stdout', () => {
      const res: string = execCmd('alias:list', { ensureExitCode: 0 }).shellOutput;
      expect(res).to.include('=== Alias List');
      expect(res).to.include('DevHub');
      expect(res).to.include('mydevhuborg@salesforce.com');
      expect(res).to.include('Admin');
      expect(res).to.include('admin@salesforce.com');
      expect(res).to.include('user');
      expect(res).to.include('user@salesforce.com');
    });
  });
});

after(async () => {
  await testSession?.clean();
});
