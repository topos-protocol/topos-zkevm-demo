import * as chalk from 'chalk'
import {
  RootCommand as _RootCommand,
  Option,
  CommandRunner,
} from 'nest-commander'

const { description, version } = require('../../package.json')
import { log } from '../loggers'
import { breakText } from '../utility'

const example = chalk.green

const helptext = `
Example Usage

  $ ${example('topos-zkevm-demo init')}
    Initialize the Topos-zkEVM-Demo. This command will output the status of the topos zkevm demo creation to the terminal as it runs, and will log a more detailed status to a log file.

  $ ${example('topos-zkevm-demo execute')}
    Execute the Topos-zkEVM-Demo demo script to deploy contracts and execute transactions.

  $ ${example('topos-zkevm-demo get-receipt')}
    Get a transaction receipt from a transaction hash.

  $ ${example('topos-zkevm-demo get-receipt-trie-root')}
    Get a receipt trie root from a block number.

  $ ${example('topos-zkevm-demo clean')}
    This will clean the topos zkevm demo. It will shut down all containers, and remove all filesystem artifacts except for log files.

  $ ${example('topos-zkevm-demo version')}
    This will print the version of the topos zkevm demo.

  $ ${example('topos-zkevm-demo version -q')}
    This will print only the numbers of the topos-zkevm-demo version, with no other output.
  
Configuration

  topos-zkevm-demo follows the XDG Base Directory Specification, which means that data files for use during runs of the topos zkevm demo are stored in $XDG_DATA_HOME/topos-zkevm-demo, which defaults to $HOME/.local/share/topos-zkevm-demo and log files are stored in $XDG_STATE_HOME/topos-zkevm-demo/logs, which defaults to $HOME/.local/state/topos-zkevm-demo/logs.

  These locations can be overridden by setting the environment variables HOME, XDG_DATA_HOME, and XDG_STATE_HOME.
`
const columns = process.stdout.columns || 80
const overrideQuiet = true

@_RootCommand({
  description: `${breakText(description, columns)}\n\n${breakText(
    helptext,
    columns
  )}`,
})
export class RootCommand extends CommandRunner {
  constructor() {
    super()
  }

  async run(_, options): Promise<void> {
    if (!(options.version || options.verbose || options.quiet)) {
      this.command.help()
    }
  }

  @Option({
    flags: '--version',
    description: `Show topos-zkevm-demo version (v${version})`,
  })
  doVersion() {
    log(
      (globalThis.quiet ? '' : 'topos-zkevm-demo version ') + version,
      overrideQuiet
    )
    log(``)

    return true
  }

  @Option({
    flags: '-v, --verbose',
    description: breakText(
      `Show more information about the execution of a command`,
      columns - 18
    ),
  })
  doVerbose() {
    globalThis.verbose = true

    return true
  }

  @Option({
    flags: '-q, --quiet',
    description: breakText(
      `Show minimal onscreen information about the execution of a command`,
      columns - 18
    ),
  })
  doQuiet() {
    globalThis.quiet = true

    return true
  }

  @Option({
    flags: '-n, --no-log',
    description: `Do not write a log file`,
  })
  doNoLog() {
    globalThis.noLog = true

    return true
  }
}
