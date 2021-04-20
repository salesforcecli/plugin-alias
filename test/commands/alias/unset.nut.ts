/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from '@salesforce/command/lib/test';

let testSession: TestSession;

describe('alias:unset NUTs', async () => {
  testSession = await TestSession.create({});

  describe('alias:unset non-existent key', () => {
    it("will unset a key even if it doesn't exist", () => {
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
    });

    it("will unset a key even if it doesn't exist stdout", () => {
      const res: string = execCmd('alias:unset noAlias', {
        ensureExitCode: 0,
      }).shellOutput;
      expect(res).to.include('=== Alias Unset');
      expect(res).to.include('Alias    Success');
      expect(res).to.include('noAlias');
      expect(res).to.include('true');
    });
  });

  describe('alias unset value', () => {
    beforeEach(() => {
      execCmd('alias:set DevHub=mydevhuborg@salesforce.com');
      execCmd('alias:set Admin=admin@salesforce.com');
      execCmd('alias:set user=user@salesforce.com');
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

    it('alias:unset DevHub', () => {
      const res: string = execCmd('alias:unset DevHub user', {
        ensureExitCode: 0,
      }).shellOutput;
      expect(res).to.include('=== Alias Unset');
      expect(res).to.include('Alias   Success');
      expect(res).to.include('DevHub');
      expect(res).to.include('true');
    });
  });

  describe('alias unset multiple values', () => {
    beforeEach(() => {
      execCmd('alias:set DevHub=mydevhuborg@salesforce.com');
      execCmd('alias:set Admin=admin@salesforce.com');
      execCmd('alias:set user=user@salesforce.com');
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

    it('alias:unset DevHub user', () => {
      const res: string = execCmd('alias:unset DevHub user', {
        ensureExitCode: 0,
      }).shellOutput;
      expect(res).to.include('=== Alias Unset');
      expect(res).to.include('Alias   Success');
      expect(res).to.include('DevHub');
      expect(res).to.include('true');
      expect(res).to.include('user');
      expect(res).to.include('true');
    });
  });
});

after(async () => {
  await testSession?.clean();
});
