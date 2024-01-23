import { Command, CommandRunner, SubCommand } from 'nest-commander'

import { log } from '../loggers'
import { ReactiveSpawn } from '../ReactiveSpawn'

@SubCommand({
  name: 'zk-proof',
  arguments: '<pathTozkProofFile>',
  description: 'Verify a zk-proof',
})
export class VerifyzkProofCommmand extends CommandRunner {
  constructor(private _spawn: ReactiveSpawn) {
    super()
  }

  async run(args: string[]) {
    const executionPath = `${globalThis.workingDir}/zero-bin`
    const [pathToFile] = args

    log(`Verifying zk-proof: ${pathToFile}`)

    this._spawn
      .reactify(
        `cd ${executionPath} && cargo r --release --bin verifier -- -f ${pathToFile}`
      )
      .subscribe({
        complete: () => {
          log(``)
          log(`✅ ${pathToFile} has been verified`)
        },
      })
  }
}

@Command({
  name: 'verify',
  arguments: '<zk-proof|merkle-proof>',
  description: 'Verify proofs for some execution',
  subCommands: [VerifyzkProofCommmand],
})
export class VerifyCommand extends CommandRunner {
  async run(args: string[]) {}
}
