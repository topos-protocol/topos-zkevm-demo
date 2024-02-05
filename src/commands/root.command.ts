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

  $ ${example('topos-zkevm-demo install')}
    Install Topos-zkEVM-Demo. This command will output the status of the topos zkevm demo creation to the terminal as it runs, and will log a more detailed status to a log file.

  $ ${example('topos-zkevm-demo start')}
    Start the local-zkEVM infra to get your development chain up and running.

  $ ${example('topos-zkevm-demo execute')}
    Execute the Topos-zkEVM-Demo demo script to deploy contracts and execute transactions.

  $ ${example(
    'topos-zkevm-demo generate merkle-proof 0x064eaad7fb35c25410aec7f55603d9bb95436891cbda68a4be9a6fc3b19ca0a5'
  )}
    Generate a receipt merkle proof for the 0x064eaad7fb35c25410aec7f55603d9bb95436891cbda68a4be9a6fc3b19ca0a5 transaction.

  $ ${example('topos-zkevm-demo generate zk-proof 2')}
    Generate a zk-proof for block 2.

  $ ${example(
    'topos-zkevm-demo util get-receipt-trie-root 0x064eaad7fb35c25410aec7f55603d9bb95436891cbda68a4be9a6fc3b19ca0a5'
  )}
    Get the receipt trie root of the block of the 0x064eaad7fb35c25410aec7f55603d9bb95436891cbda68a4be9a6fc3b19ca0a5 transaction.

  $ ${example(
    'topos-zkevm-demo verify merkle-proof 0x064eaad7fb35c25410aec7f55603d9bb95436891cbda68a4be9a6fc3b19ca0a5 0xf851a02d247ca1770e3221e8aecf9d04fc9b6f7ff07361715c71ef8703bf24c7905d4580808080808080a0cfa9df4025f175e0c4338efc950dc2e30214a08e8ba6940226a97fd977b156b08080808080808080,0xf9011130b9010d02f90109018301155cb9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0 0x11ef2192f0c9aa092d69b9acf82085f384f172188cc321da94566dc9d33a3b18'
  )}
    Verify the 0xf851a02d247ca1770e3221e8aecf9d04fc9b6f7ff07361715c71ef8703bf24c7905d4580808080808080a0cfa9df4025f175e0c4338efc950dc2e30214a08e8ba6940226a97fd977b156b08080808080808080,0xf9011130b9010d02f90109018301155cb9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0 merkle proof, with the 0x064eaad7fb35c25410aec7f55603d9bb95436891cbda68a4be9a6fc3b19ca0a5 transaction, and 0x11ef2192f0c9aa092d69b9acf82085f384f172188cc321da94566dc9d33a3b18 receipt trie root.

  $ ${example(
    'topos-zkevm-demo verify zk-proof /path/to/proofs/b00002.zkproof'
  )}
    Verify the zk-proof found at /path/to/proofs/b00002.zkproof.

  $ ${example('topos-zkevm-demo stop')}
    Stop the local-zkEVM infra. Your development chain can be resumed by running the start commmand again.

  $ ${example('topos-zkevm-demo uninstall')}
    Uninstall Topos-zkEVM-Demo. It will shut down all containers, and remove all filesystem artifacts except for log files.

  $ ${example('topos-zkevm-demo version')}
    This will print the version of the topos zkevm demo.
  
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
