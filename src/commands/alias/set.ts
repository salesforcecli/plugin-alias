/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as os from 'os';
import { GlobalInfo, Messages } from '@salesforce/core';
import { AliasCommand, AliasResult, Command } from '../../alias';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-alias', 'set');

export default class Set extends AliasCommand {
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessage('examples').split(os.EOL);
  public static readonly varargs = { required: true };
  public static aliases = ['force:alias:set'];

  public async run(): Promise<AliasResult[]> {
    const varargs = this.varargs || {};
    const info = await GlobalInfo.create();

    const results = Object.keys(varargs).map((key) => {
      const value = varargs[key] as string;
      info.aliases.set(key, value ?? 'undefined');
      return { alias: key, value };
    });
    await info.write();
    this.output(Command.Set, results);
    return results;
  }
}
