/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Aliases, AliasGroup, Messages } from '@salesforce/core';
import { Dictionary } from '@salesforce/ts-types';
import { AliasCommand, AliasResult, Command } from '../../alias';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-alias', 'list');

export default class List extends AliasCommand {
  public static readonly description = messages.getMessage('description');
  public static aliases = ['force:alias:list'];

  public async run(): Promise<AliasResult[]> {
    const aliases = await Aliases.create(Aliases.getDefaultOptions());
    const keyValues = (aliases.getGroup(AliasGroup.ORGS) as Dictionary<string>) || {};
    const results = Object.keys(keyValues).map((alias) => ({
      alias,
      value: keyValues[alias],
    }));
    this.output(Command.List, results);
    return results;
  }
}
