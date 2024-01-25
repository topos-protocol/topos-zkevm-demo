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

@SubCommand({
  name: 'merkle-proof',
  arguments: '<txHash> <merkleProof> <receiptTrieRoot>',
  description: 'Verify a receipt merkle proof',
})
export class VerifyReceiptMerkleProofCommmand extends CommandRunner {
  constructor(private _spawn: ReactiveSpawn) {
    super()
  }

  async run(args: string[]) {
    const executionPath = `${globalThis.workingDir}/local-zkevm/sample-hardhat-project`
    const [txHash, merkleProof, receiptTrieRoot] = args

    log(`Verifying merkle-proof for transaction: ${txHash}`)

    this._spawn
      .reactify(
        `cd ${executionPath} && npm run verify-receipt-merkle-proof ${txHash} ${merkleProof} ${receiptTrieRoot}`
      )
      .subscribe({
        next: (data) => {
          log(``)
          log(data.output as string)
        },
      })
  }
}

@Command({
  name: 'verify',
  arguments: '<zk-proof|merkle-proof>',
  description: 'Verify proofs for some execution',
  subCommands: [VerifyzkProofCommmand, VerifyReceiptMerkleProofCommmand],
})
export class VerifyCommand extends CommandRunner {
  async run(args: string[]) {}
}
