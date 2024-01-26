import { Command, CommandRunner, Option } from 'nest-commander'

import { log } from '../loggers'
import { ReactiveSpawn } from '../ReactiveSpawn'

interface CommandOptions {
  purge?: boolean
}

@Command({
  name: 'stop',
  description: 'Stop Topos-zkEVM-Demo',
})
export class StopCommand extends CommandRunner {
  constructor(private _spawn: ReactiveSpawn) {
    super()
  }

  async run(_, options?: CommandOptions) {
    const executionPath = `${globalThis.workingDir}/local-zkevm`
    const { purge } = options

    log(`Stopping ${purge ? 'and purging ' : ''}the local-zkevm infra...`)

    this._spawn
      .reactify(
        `cd ${executionPath} && docker compose down ${purge ? '-v' : ''}`
      )
      .subscribe({
        complete: () => {
          log(
            `✅ Local-zkEVM infra has been stopped${purge ? ' and purged' : ''}`
          ),
            log(``)
        },
      })
  }

  @Option({
    flags: '-p, --purge',
    description: 'Purge chain data',
  })
  parsePurgeOption(val: boolean) {
    return val
  }
}
