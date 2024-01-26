import { stat } from 'fs'
import { Command, CommandRunner } from 'nest-commander'
import { concat, defer, Observable, of, tap } from 'rxjs'
import { satisfies } from 'semver'

import { log, logError, logToFile } from '../loggers'
import { Next, ReactiveSpawn } from '../ReactiveSpawn'

const LOCAL_ZKEVM_REF = 'feat/stateless'
const ZERO_BIN_REF = 'main'
const MIN_VERSION_DOCKER = '17.6.0'
const MIN_VERSION_GIT = '2.0.0'
const MIN_VERSION_NODE = '16.0.0'

@Command({
  name: 'install',
  description: 'Install Topos-zkEVM-Demo',
})
export class InstallCommand extends CommandRunner {
  constructor(private _spawn: ReactiveSpawn) {
    super()
  }

  async run() {
    log(`Installing Topos-zkEVM-Demo...`)
    log(``)

    concat(
      this._verifyDependencyInstallation(),
      this._createWorkingDirectoryIfInexistant(),
      this._cloneGitRepositories(),
      this._buildDemoApp(),
      this._buildZeroBin()
    ).subscribe({
      complete: () => {
        log(`🔥 Topos zkEVM Demo has now been installed 🔥`)
        log(``)
        log(
          `You'll find a demo script in ${globalThis.workingDir}/local-zkevm/sample-hardhat-project/scripts as well as a demo contract in ${globalThis.workingDir}/local-zkevm/sample-hardhat-project/contract.`
        )
        log(``)
        log(`Run the following command to start the local-zkevm infra:`)
        log(`$ topos-zkevm-demo start`)
      },
      error: (errBuffer) => {
        logError(`❗ Error:\n${errBuffer}`)
        process.exit(1)
      },
      next: (data: Next) => {
        if (globalThis.verbose && data && data.hasOwnProperty('output')) {
          logToFile(`${data.output}`)
        }
      },
    })
  }

  private _verifyDependencyInstallation() {
    return concat(
      of(log('Verifying dependency installation...')),
      this._verifyDockerInstallation(),
      this._verifyGitInstallation(),
      this._verifyNodeJSInstallation(),
      this._verifyRustNightlyInstallation()
    ).pipe(
      tap({
        complete: () => {
          log('✅ Dependency checks completed!')
          log('')
        },
      })
    )
  }

  private _verifyDockerInstallation() {
    return this._spawn.reactify('docker --version').pipe(
      tap({
        next: (data) => {
          if (data && data.hasOwnProperty('output')) {
            const match = RegExp(
              /Docker version ([0-9]+\.[0-9]+\.[0-9]+)/
            ).exec(`${data.output}`)

            if (match && match.length > 1) {
              if (satisfies(match[1], `>=${MIN_VERSION_DOCKER}`)) {
                log(`✅ Docker -- Version: ${match[1]}`)
              } else {
                log(`❌ Docker -- Version: ${match[1]}`)
                throw new Error(
                  `Docker ${match[1]} is not supported\n` +
                    'Please upgrade Docker to version 17.06.0 or higher.'
                )
              }
            }
          }
        },
        error: () => {
          logError(`❌ Docker Not Installed!`)
        },
      })
    )
  }

  private _verifyGitInstallation() {
    return this._spawn.reactify('git --version').pipe(
      tap({
        next: (data) => {
          if (data && data.hasOwnProperty('output')) {
            const match = RegExp(/git version ([0-9]+\.[0-9]+\.[0-9]+)/).exec(
              `${data.output}`
            )

            if (match && match.length > 1) {
              if (satisfies(match[1], `>=${MIN_VERSION_GIT}`)) {
                log(`✅ Git -- Version: ${match[1]}`)
              } else {
                logError(`❌ Git -- Version: ${match[1]}`)
                throw new Error(
                  `Git ${match[1]} is not supported\n` +
                    'Please upgrade Git to version 2.0.0 or higher.'
                )
              }
            }
          }
        },
        error: () => {
          logError(`❌ Git not installed!`)
        },
      })
    )
  }

  private _verifyNodeJSInstallation() {
    return this._spawn.reactify('node --version').pipe(
      tap({
        next: (data) => {
          if (data && data.hasOwnProperty('output')) {
            const match = RegExp(/v([0-9]+\.[0-9]+\.[0-9]+)/).exec(
              `${data.output}`
            )

            if (match && match.length > 1) {
              if (satisfies(match[1], `>=${MIN_VERSION_NODE}`)) {
                log(`✅ Node.js -- Version: ${match[1]}`)
              } else {
                log(`❌ Node.js -- Version: ${match[1]}`)
                throw new Error(
                  `Node.js ${match[1]} is not supported\n` +
                    'Please upgrade Node.js to version 16.0.0 or higher.'
                )
              }
            }
          }
        },
        error: () => {
          logError(`❌ Node.js not installed!`)
        },
      })
    )
  }

  private _verifyRustNightlyInstallation() {
    return this._spawn.reactify('rustc +nightly --version').pipe(
      tap({
        next: (data) => {
          if (data && data.hasOwnProperty('output')) {
            const match = RegExp(/rustc \d+\.\d+\.\d+-nightly \(.+\)/).exec(
              `${data.output}`
            )

            if (match && match.length) {
              log(`✅ Rust nightly -- Version: ${match[0]}`)
            }
          }
        },
        error: () => {
          logError(`❌ Rust nightly not installed!`)
        },
      })
    )
  }

  private _createWorkingDirectoryIfInexistant() {
    return new Observable((subscriber) => {
      log(`Verifying working directory: [${globalThis.workingDir}]...`)

      stat(globalThis.workingDir, (error) => {
        if (error) {
          this._spawn
            .reactify(`mkdir -p ${globalThis.workingDir}`)
            .pipe(
              tap({
                complete: () => {
                  log(`✅ Working directory was successfully created`)
                },
              })
            )
            .subscribe(subscriber)
        } else {
          log(`✅ Working directory exists`)
          subscriber.complete()
        }
      })
    }).pipe(
      tap({
        complete: () => {
          log('')
        },
      })
    )
  }

  private _cloneGitRepositories() {
    return concat(
      defer(() => of(log('Cloning repositories...'))),
      this._cloneGitRepository(
        'topos-protocol',
        'local-zkevm',
        LOCAL_ZKEVM_REF
      ),
      this._cloneGitRepository('topos-protocol', 'zero-bin', ZERO_BIN_REF),
      defer(() => of(log('')))
    )
  }

  private _cloneGitRepository(
    organizationName: string,
    repositoryName: string,
    branch?: string
  ) {
    return new Observable((subscriber) => {
      const path = `${globalThis.workingDir}/${repositoryName}`

      stat(path, (error) => {
        if (error) {
          if (globalThis.verbose) {
            log(`Cloning ${organizationName}/${repositoryName}...`)
          }

          this._spawn
            .reactify(
              `git clone --depth 1 ${
                branch ? `--branch ${branch}` : ''
              } https://github.com/${organizationName}/${repositoryName}.git ${
                globalThis.workingDir
              }/${repositoryName}`
            )
            .pipe(
              tap({
                complete: () => {
                  log(
                    `✅ ${repositoryName}${
                      branch ? ` | ${branch}` : ''
                    } successfully cloned`
                  )
                  if (globalThis.verbose) {
                    log('')
                  }
                },
              })
            )
            .subscribe(subscriber)
        } else {
          log(
            `✅ ${repositoryName}${branch ? ` | ${branch}` : ''} already cloned`
          )
          subscriber.complete()
        }
      })
    })
  }

  private _buildDemoApp() {
    const executionPath = `${globalThis.workingDir}/local-zkevm/sample-hardhat-project`

    return concat(
      defer(() => of(log(`Building the Demo App...`))),
      this._npmInstall(executionPath),
      this._npmBuild(executionPath),
      defer(() => of(log(``)))
    )
  }

  private _npmInstall(executionPath: string) {
    return this._spawn.reactify(`cd ${executionPath} && npm install`).pipe(
      tap({
        complete: () => {
          log(`✅ Deps are installed`)
        },
      })
    )
  }

  private _npmBuild(executionPath: string) {
    return this._spawn.reactify(`cd ${executionPath} && npm run build`).pipe(
      tap({
        complete: () => {
          log(`✅ Project has been compiled`)
        },
      })
    )
  }

  private _buildZeroBin() {
    const executionPath = `${globalThis.workingDir}/zero-bin`

    return concat(
      defer(() => of(log(`Building Zero-Bin...`))),
      this._cargoBuildRelease(executionPath),
      defer(() => of(log(``)))
    )
  }

  private _cargoBuildRelease(executionPath: string) {
    return this._spawn
      .reactify(`cd ${executionPath} && cargo build --release`)
      .pipe(
        tap({
          complete: () => {
            log(`✅ Zero-Bin has been compiled`)
          },
        })
      )
  }
}
