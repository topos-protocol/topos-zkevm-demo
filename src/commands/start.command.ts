import { Command, CommandRunner } from 'nest-commander'

import { log } from '../loggers'
import { ReactiveSpawn } from '../ReactiveSpawn'

@Command({
  name: 'start',
  description: 'Start Topos-zkEVM-Demo',
})
export class StartCommand extends CommandRunner {
  constructor(private _spawn: ReactiveSpawn) {
    super()
  }

  async run() {
    const executionPath = `${globalThis.workingDir}/local-zkevm`

    log(`Starting the local-zkevm infra...`)

    this._spawn
      .reactify(`cd ${executionPath} && docker compose up -d`)
      .subscribe({
        complete: () => {
          log(`✅ Local-zkEVM infra is running`), log(``)
        },
      })
  }
}
