/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { SfdxCommand } from '@salesforce/command';
import { SfdxError } from '@salesforce/core';
import { Nullable } from '@salesforce/ts-types';
import chalk from 'chalk';

export interface AliasResult {
  alias: string;
  value?: Nullable<string>;
  success?: boolean;
  error?: SfdxError;
}

export enum Command {
  List = 'List',
  Set = 'Set',
  Unset = 'Unset'
}

interface TableColumns {
  [Command.List]: TableColumn[];
  [Command.Set]: TableColumn[];
  [Command.Unset]: TableColumn[];
}

interface TableColumn {
  key: string;
  label: string;
}

export abstract class AliasCommand extends SfdxCommand {
  protected static tableColumns: TableColumns = {
    [Command.Unset]: [
      { key: 'alias', label: 'Alias' },
      { key: 'success', label: 'Success' }
    ],
    [Command.Set]: [
      { key: 'alias', label: 'Alias' },
      { key: 'value', label: 'Value' }
    ],
    [Command.List]: [
      { key: 'alias', label: 'Alias' },
      { key: 'value', label: 'Value' }
    ]
  };

  output(commandName: Command, results: AliasResult[]) {
    if (results.length === 0) {
      this.ux.log('No results found');
      return;
    }

    this.ux.styledHeader(chalk.blue(`Alias ${commandName}`));

    const values = AliasCommand.tableColumns[commandName] as TableColumn[];

    this.ux.table(results, { columns: values });

    results.forEach(result => {
      if (result.error) {
        throw result.error;
      }
    });
  }

  parseArgs(): string[] {
    const { argv } = this.parse({
      flags: this.statics.flags,
      args: this.statics.args,
      strict: this.statics.strict
    });
    return argv;
  }
}
