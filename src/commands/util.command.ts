import { Command, CommandRunner, SubCommand } from 'nest-commander'

import { log } from '../loggers'
import { ReactiveSpawn } from '../ReactiveSpawn'

@SubCommand({
  name: 'get-receipt-trie-root',
  arguments: '<txHash>',
  description: 'Get a receipt trie root from a transaction hash',
})
export class GetReceiptTrieRootCommand extends CommandRunner {
  constructor(private _spawn: ReactiveSpawn) {
    super()
  }

  async run(args: string[]) {
    const executionPath = `${globalThis.workingDir}/local-zkevm/sample-hardhat-project`
    const [txHash] = args
    this._spawn
      .reactify(
        `cd ${executionPath} && npm run get-receipt-trie-root ${txHash}`
      )
      .subscribe({
        next: (data) => {
          log(data.output as string)
        },
      })
  }
}

@Command({
  name: 'util',
  arguments: '<subcommand>',
  description: 'Utility commands (e.g., get receipt trie root)',
  subCommands: [GetReceiptTrieRootCommand],
})
export class UtilCommand extends CommandRunner {
  async run(args: string[]) {}
}
