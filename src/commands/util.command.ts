import { Command, CommandRunner, SubCommand } from 'nest-commander'

import { ReactiveSpawn } from '../ReactiveSpawn'

@SubCommand({
  name: 'get-receipt',
  arguments: '<txHash>',
  description: 'Get a transaction receipt from a transaction hash',
})
export class GetReceiptCommand extends CommandRunner {
  constructor(private _spawn: ReactiveSpawn) {
    super()
  }

  async run(args: string[]) {
    const executionPath = `${globalThis.workingDir}/local-zkevm/sample-hardhat-project`
    const [txHash] = args
    this._spawn
      .reactify(`cd ${executionPath} && npm run get-receipt ${txHash}`)
      .subscribe({
        next: (data) => {
          console.log(data.output)
        },
      })
  }
}

@SubCommand({
  name: 'get-receipt-trie-root',
  arguments: '<blockNumber>',
  description: 'Get a receipt trie root from a block number',
})
export class GetReceiptTrieRootCommand extends CommandRunner {
  constructor(private _spawn: ReactiveSpawn) {
    super()
  }

  async run(args: string[]) {
    const executionPath = `${globalThis.workingDir}/local-zkevm/sample-hardhat-project`
    const [blockNumber] = args
    this._spawn
      .reactify(
        `cd ${executionPath} && npm run get-receipt-trie-root ${blockNumber}`
      )
      .subscribe({
        next: (data) => {
          console.log(data.output)
        },
      })
  }
}

@Command({
  name: 'util',
  arguments: '<subcommand>',
  description: 'Utility commands (e.g., get transaction receipt)',
  subCommands: [GetReceiptCommand, GetReceiptTrieRootCommand],
})
export class UtilCommand extends CommandRunner {
  async run(args: string[]) {}
}
