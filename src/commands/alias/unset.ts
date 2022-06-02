/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { StateAggregator, Messages, SfError } from '@salesforce/core';
import { AliasCommand, AliasResult, Command } from '../../alias';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('@salesforce/plugin-alias', 'unset');

export default class Unset extends AliasCommand {
  public static readonly description = messages.getMessage('description');
  public static readonly strict = false;

  public async run(): Promise<AliasResult[]> {
    const argv = await this.parseArgs();

    if (!argv || argv.length === 0) {
      throw messages.createError('NoAliasKeysFound');
    } else {
      const results: AliasResult[] = [];
      const stateAggregator = await StateAggregator.getInstance();

      argv.forEach((key) => {
        try {
          stateAggregator.aliases.unset(key);
          results.push({ alias: key, success: true });
        } catch (error) {
          const err = error as SfError;
          process.exitCode = 1;
          results.push({ alias: key, success: false, error: err });
        }
      });
      await stateAggregator.aliases.write();
      this.output(Command.Unset, results);
      return results;
    }
  }
}
