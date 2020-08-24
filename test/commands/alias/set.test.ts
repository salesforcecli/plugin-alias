import { expect, test } from '@salesforce/command/lib/test';

describe('alias:set', () => {
  test
    .stdout()
    .command(['alias:set', 'Coffee=espresso', '--json'])
    .it('returns new alias', ctx => {
      const response = JSON.parse(ctx.stdout);
      expect(response.result).to.deep.equal([
        {
          alias: 'Coffee',
          value: 'espresso'
        }
      ]);
    });

  test
    .stdout()
    .stderr()
    .command(['alias:set'])
    .it('throws error when no alias provided', ctx => {
      expect(ctx.stderr).to.include(
        'Provide required name=value pairs for the command. Enclose any values that contain spaces in double quotes.'
      );
    });
});
