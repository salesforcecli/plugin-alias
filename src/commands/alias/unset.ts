/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { Aliases, Messages, SfdxError } from '@salesforce/core';
import { AliasCommand, AliasResult, Command } from '../../alias';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-alias', 'unset');

export default class Unset extends AliasCommand {
  public static readonly description = messages.getMessage('description');
  public static readonly strict = false;

  public async run(): Promise<AliasResult[]> {
    const argv = this.parseArgs();

    if (!argv || argv.length === 0) {
      throw SfdxError.create('@salesforce/plugin-alias', 'unset', 'NoAliasKeysFound', []);
    } else {
      const results: AliasResult[] = [];
      const aliases = await Aliases.create(Aliases.getDefaultOptions());
      argv.forEach((key) => {
        try {
          aliases.unset(key);
          results.push({ alias: key, success: true });
        } catch (error) {
          const err = error as SfdxError;
          process.exitCode = 1;
          results.push({ alias: key, success: false, error: err });
        }
      });
      await aliases.write();
      this.output(Command.Unset, results);
      return results;
    }
  }
}
