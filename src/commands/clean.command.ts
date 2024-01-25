import { stat, readdir } from 'fs'
import { Command, CommandRunner } from 'nest-commander'
import { Observable, concat, defer, of } from 'rxjs'
import { homedir } from 'os'

import { ReactiveSpawn } from '../ReactiveSpawn'
import { log, logError } from '../loggers'

@Command({
  name: 'clean',
  description: 'Uninstall Topos-zkEVM-Demo',
})
export class CleanCommand extends CommandRunner {
  constructor(private _spawn: ReactiveSpawn) {
    super()
  }

  async run() {
    log(`Cleaning up Topos-zkEVM-Demo...`)
    log(``)

    concat(
      this._verifyWorkingDirectoryExistence(),
      this._shutdownLocalzkEVM(),
      this._removeWorkingDirectory()
    ).subscribe()
  }

  private _verifyWorkingDirectoryExistence() {
    return new Observable((subscriber) => {
      stat(globalThis.workingDir, (error, stats) => {
        if (error) {
          globalThis.workingDirExists = false
          log(
            `Working directory (${globalThis.workingDir}) is not found; nothing to clean.`
          )
          log(``)
          subscriber.next()
          subscriber.complete()
        } else if (!stats.isDirectory()) {
          logError(
            `The working directory (${globalThis.workingDir}) is not a directory; this is an error!`
          )
          log(``)
          globalThis.workingDirExists = false
          subscriber.error()
        } else {
          readdir(globalThis.workingDir, (err, files) => {
            if (err) {
              globalThis.workingDirExists = false
              logError(
                `Error while trying to read the working directory (${globalThis.workingDir})`
              )
              log(``)
              subscriber.error()
            }

            if (files.length === 0) {
              globalThis.workingDirExists = false
              log(
                `Working directory (${globalThis.workingDir}) is empty; nothing to clean.`
              )
              log(``)
              subscriber.next()
              subscriber.complete()
            } else {
              globalThis.workingDirExists = true
              log(`Found working directory (${globalThis.workingDir})`)
              log(``)
              subscriber.next()
              subscriber.complete()
            }
          })
        }
      })
    })
  }

  private _shutdownLocalzkEVM() {
    const executionPath = `${globalThis.workingDir}/local-zkevm`

    return concat(
      defer(() => of(log(`Shutting down the local-zkevm infra...`))),
      this._spawn.reactify(`cd ${executionPath} && docker compose down -v`),
      defer(() => of(log(`✅ Local-zkEVM infra has been shut down`), log(``)))
    )
  }

  private _removeWorkingDirectory() {
    const homeDir = homedir()
    return new Observable((subscriber) => {
      if (
        globalThis.workingDirExists &&
        globalThis.workingDir.indexOf(homeDir) !== -1 &&
        globalThis.workingDir !== homeDir
      ) {
        log(`Cleaning up the working directory (${globalThis.workingDir})`)
        this._spawn.reactify(`rm -rf ${globalThis.workingDir}`).subscribe({
          complete: () => {
            log('✅ Working directory has been removed')
            subscriber.complete()
          },
        })
      } else {
        log('')
        log(`✅ Working direction does not exist; nothing to clean`)
        subscriber.complete()
      }
    })
  }
}
