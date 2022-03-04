/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { getNumber, getString } from '@salesforce/ts-types';
import { expect } from '@salesforce/command/lib/test';

let testSession: TestSession;

function unsetAll() {
  execCmd('sfdx alias:unset DevHub');
  execCmd('sfdx alias:unset Admin');
  execCmd('sfdx alias:unset user');
}

describe('alias:set NUTs', async () => {
  testSession = await TestSession.create({});

  describe('initial alias setup', () => {
    beforeEach(() => {
      unsetAll();
    });

    it('alias:set multiple values and json', () => {
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
    });

    it('alias:set multiple values stdout', () => {
      const res: string = execCmd('alias:set DevHub=devhuborg@salesforce.com Admin=admin@salesforce.com', {
        ensureExitCode: 0,
      }).shellOutput;
      expect(res).to.include('=== Alias Set');
      expect(res).to.include('Alias  Value');
      expect(res).to.include('DevHub');
      expect(res).to.include('devhuborg@salesforce.com');
      expect(res).to.include('Admin');
      expect(res).to.include('admin@salesforce.com');
    });
  });

  describe('alias:set overwrites existing entry', () => {
    beforeEach(() => {
      unsetAll();
      execCmd('alias:set DevHub=mydevhuborg@salesforce.com');
    });

    it('alias:set overwrites existing entry correctly json', () => {
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
    });

    it('alias:set overwrites entry correctly stdout', () => {
      const res: string = execCmd('alias:set DevHub=newdevhub@salesforce.com Admin=admin@salesforce.com', {
        ensureExitCode: 0,
      }).shellOutput;
      expect(res).to.include('=== Alias Set');
      expect(res).to.include('Alias  Value');
      expect(res).to.include('DevHub');
      expect(res).to.include('newdevhub@salesforce.com');
      expect(res).to.include('Admin');
      expect(res).to.include('admin@salesforce.com');
    });

    it('alias:set DevHub= sets DevHub entry to undefined stdout', () => {
      const res: string = execCmd('alias:set DevHub=', {
        ensureExitCode: 0,
      }).shellOutput;
      expect(res).to.include('=== Alias Set');
      expect(res).to.include('Alias  Value');
      expect(res).to.include('DevHub');
      expect(res).to.include('undefined');
    });
  });

  describe('alias:set without varargs throws error', () => {
    it('alias:set --json', () => {
      // access each member individually because the stack trace will be different
      const res = execCmd('alias:set  --json');
      expect(getNumber(res.jsonOutput, 'status')).to.equal(1);
      expect(getString(res.jsonOutput, 'name')).to.equal('VarargsRequiredError');
      expect(getString(res.jsonOutput, 'stack')).to.contain('VarargsRequiredError');
      expect(getString(res.jsonOutput, 'message')).to.equal(
        'Provide required name=value pairs for the command. Enclose any values that contain spaces in double quotes.'
      );
      expect(getNumber(res.jsonOutput, 'exitCode')).to.equal(1);
      expect(getNumber(res.jsonOutput, 'status')).to.equal(1);
    });

    it('alias:set without varargs stdout', () => {
      const res: string = execCmd('alias:set ').shellOutput.stderr;
      expect(res).to.include(
        'ERROR running alias:set:  Provide required name=value pairs for the command. Enclose any values that contain spaces in double quotes.'
      );
    });
  });
});

afterEach(async () => {
  await testSession?.clean();
});
