/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { getString, getNumber } from '@salesforce/ts-types';
import { expect } from '@salesforce/command/lib/test';

describe('alias:set NUTs', () => {
  let testSession: TestSession;

  describe('alias set success', () => {
    before(() => {
      testSession = TestSession.create({});
    });

    it('alias:set --json', () => {
      const res = execCmd('alias:set DevHub=devhuborg@salesforce.com Admin=admin@salesforce.com --json', {
        ensureExitCode: 0,
      });
      expect(res.jsonOutput).to.deep.equal({
        result: [
          { alias: 'DevHub', value: 'devhuborg@salesforce.com' },
          { alias: 'Admin', value: 'admin@salesforce.com' },
        ],
        status: 0,
      });

      const list = execCmd('alias:list --json', {
        ensureExitCode: 0,
      });
      expect(list.jsonOutput).to.deep.equal({
        result: [
          { alias: 'DevHub', value: 'devhuborg@salesforce.com' },
          { alias: 'Admin', value: 'admin@salesforce.com' },
        ],
        status: 0,
      });
    });
  });

  describe('alias:set overwrites existing entry', () => {
    before(() => {
      testSession = TestSession.create({
        setupCommands: ['sfdx alias:set DevHub=mydevhuborg@salesforce.com'],
      });
    });

    it('alias:set overwrites existing entry correctly', () => {
      // overwriting DevHub entry to point to newdevhub
      const res = execCmd('alias:set DevHub=newdevhub@salesforce.com Admin=admin@salesforce.com --json', {
        ensureExitCode: 0,
      });
      expect(res.jsonOutput).to.deep.equal({
        result: [
          // newdevhub verified
          { alias: 'DevHub', value: 'newdevhub@salesforce.com' },
          { alias: 'Admin', value: 'admin@salesforce.com' },
        ],
        status: 0,
      });
      const list = execCmd('alias:list --json', {
        ensureExitCode: 0,
      });
      expect(list.jsonOutput).to.deep.equal({
        result: [
          { alias: 'DevHub', value: 'newdevhub@salesforce.com' },
          { alias: 'Admin', value: 'admin@salesforce.com' },
        ],
        status: 0,
      });
    });
  });

  describe('alias:set without varargs throws error', () => {
    beforeEach(() => {
      testSession = TestSession.create({});
    });

    it('alias:set --json', () => {
      // access each member individually because the stack trace will be different
      const res = execCmd('alias:set  --json');
      expect(getNumber(res.jsonOutput, 'status')).to.equal(1);
      expect(getString(res.jsonOutput, 'name')).to.equal('VarargsRequired');
      expect(getString(res.jsonOutput, 'stack')).to.contain('VarargsRequired');
      expect(getString(res.jsonOutput, 'message')).to.equal(
        'Provide required name=value pairs for the command. Enclose any values that contain spaces in double quotes.'
      );
      expect(getNumber(res.jsonOutput, 'exitCode')).to.equal(1);
      expect(getNumber(res.jsonOutput, 'status')).to.equal(1);
      const list = execCmd('alias:list --json', {
        ensureExitCode: 0,
      });
      expect(list.jsonOutput).to.deep.equal({
        result: [],
        status: 0,
      });
    });

    it('alias:set DevHub= --json', () => {
      // access each member individually because the stack trace will be different
      const res = execCmd('alias:set  --json');
      expect(getNumber(res.jsonOutput, 'status')).to.equal(1);
      expect(getString(res.jsonOutput, 'name')).to.equal('VarargsRequired');
      expect(getString(res.jsonOutput, 'stack')).to.contain('VarargsRequired');
      expect(getString(res.jsonOutput, 'message')).to.equal(
        'Provide required name=value pairs for the command. Enclose any values that contain spaces in double quotes.'
      );
      expect(getNumber(res.jsonOutput, 'exitCode')).to.equal(1);
      expect(getNumber(res.jsonOutput, 'status')).to.equal(1);
      const list = execCmd('alias:list --json', {
        ensureExitCode: 0,
      });
      expect(list.jsonOutput).to.deep.equal({
        result: [],
        status: 0,
      });
    });
  });
  afterEach(async () => {
    await testSession?.clean();
  });
});
