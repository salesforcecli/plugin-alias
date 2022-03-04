/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { GlobalInfo, Messages } from '@salesforce/core';
import { AliasCommand, AliasResult, Command } from '../../alias';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-alias', 'list');

export default class List extends AliasCommand {
  public static readonly description = messages.getMessage('description');
  public static aliases = ['force:alias:list'];

  public async run(): Promise<AliasResult[]> {
    const info = await GlobalInfo.create();
    const keys = info.aliases.getAll() || {};
    const results = Object.keys(keys).map((alias) => ({
      alias,
      value: keys[alias],
    }));
    this.output(Command.List, results);
    return results;
  }
}
