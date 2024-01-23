import { Command, CommandRunner, SubCommand } from 'nest-commander'

import { log } from '../loggers'
import { ReactiveSpawn } from '../ReactiveSpawn'

const ZERO_BIN_ENDPOINT = `http://localhost:8546`

@SubCommand({
  name: 'zk-proof',
  arguments: '<blockNumber>',
  description: 'Generate a zk-proof for a block from a block number',
})
export class GeneratezkProofCommmand extends CommandRunner {
  constructor(private _spawn: ReactiveSpawn) {
    super()
  }

  async run(args: string[]) {
    const executionPath = `${globalThis.workingDir}/zero-bin`
    const [blockNumber] = args
    this._spawn
      .reactify(
        `cd ${executionPath} && ./tools/prove_blocks.sh 0x${blockNumber} 0x${blockNumber} ${ZERO_BIN_ENDPOINT}`
      )
      .subscribe({
        next: (data) => {
          log(data.output as string)
        },
      })
  }
}

@Command({
  name: 'generate',
  arguments: '<zk-proof|merkle-proof>',
  description: 'Generate proofs for some execution',
  subCommands: [GeneratezkProofCommmand],
})
export class GenerateCommand extends CommandRunner {
  async run(args: string[]) {}
}
