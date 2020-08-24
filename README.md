# plugin-alias

Plugin for alias commands

## Getting Started

To use, install the [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli) and run the following commands.

```
Verify the CLI is installed
  $ sfdx (-v | --version)
Install the @salesforce/plugin-alias plugin
  $ sfdx plugins:install @salesforce/plugin-alias
To run a command
  $ sfdx [command]
```

To build the plugin locally, make sure to have yarn installed and run the following commands:

```
Clone the repository
  $ git clone git@github.com:salesforcecli/plugin-alias
Install the dependencies and compile
  $ yarn install
  $ yarn prepack
Link your plugin to the sfdx cli
  $ sfdx plugins:link .
To verify
  $ sfdx plugins
```
