/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { SfdxCommand } from '@salesforce/command';
import { SfError } from '@salesforce/core';
import { Nullable } from '@salesforce/ts-types';
import * as chalk from 'chalk';
import { CliUx } from '@oclif/core';

export interface AliasResult {
  alias: string;
  value?: Nullable<string>;
  success?: boolean;
  error?: SfError;
}

export enum Command {
  List = 'List',
  Set = 'Set',
  Unset = 'Unset',
}

export abstract class AliasCommand extends SfdxCommand {
  protected static tableColumns: { [key: string]: CliUx.Table.table.Columns<Record<string, string>> } = {
    [Command.Unset]: { alias: { header: 'Alias' }, success: { header: 'Success' } },
    [Command.Set]: { alias: { header: 'Alias' }, value: { header: 'Value' } },
    [Command.List]: { alias: { header: 'Alias' }, value: { header: 'Value' } },
  };

  public output(commandName: Command, results: AliasResult[]): void {
    if (results.length === 0) {
      this.ux.log('No results found');
      return;
    }

    this.ux.styledHeader(chalk.blue(`Alias ${commandName}`));

    const column = AliasCommand.tableColumns[commandName];

    this.ux.table(results, column);

    results.forEach((result) => {
      if (result.error) {
        throw result.error;
      }
    });
  }

  public async parseArgs(): Promise<string[]> {
    const { argv } = await this.parse({
      flags: this.statics.flags,
      args: this.statics.args,
      strict: this.statics.strict,
    });
    return argv;
  }
}
