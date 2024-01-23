import { Command, CommandRunner } from 'nest-commander'

import { ReactiveSpawn } from '../ReactiveSpawn'

@Command({
  name: 'execute',
  description:
    'Execute the demo script to deploy contracts and send transactions',
})
export class ExecuteCommand extends CommandRunner {
  constructor(private _spawn: ReactiveSpawn) {
    super()
  }

  async run() {
    const executionPath = `${globalThis.workingDir}/local-zkevm/sample-hardhat-project`
    this._spawn.reactify(`cd ${executionPath} && npm run demo`).subscribe({
      next: (data) => {
        console.log(data.output)
      },
    })
  }
}
