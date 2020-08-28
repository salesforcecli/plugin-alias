/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Aliases, AliasGroup, Messages } from '@salesforce/core';
import { Dictionary } from '@salesforce/ts-types';
import * as os from 'os';
import { AliasCommand, AliasResult, Command } from '../../alias';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-alias', 'set');

export default class Set extends AliasCommand {
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessage('examples').split(os.EOL);
  public static readonly varargs = { required: true };
  public static aliases = ['force:alias:set'];

  async run(): Promise<AliasResult[]> {
    const varargs = this.varargs || {};
    const valuesToSet = Object.keys(varargs).map(v => `${v}=${varargs[v]}`);
    const savedValues = (await Aliases.parseAndUpdate(
      valuesToSet,
      AliasGroup.ORGS
    )) as Dictionary<string>;
    const results = Object.keys(savedValues).map(alias => ({
      alias,
      value: savedValues[alias]
    }));
    this.output(Command.Set, results);
    return results;
  }
}
