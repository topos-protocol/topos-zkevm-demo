import { Module } from '@nestjs/common'

import { ExecuteCommand } from './commands/execute.command'
import { GenerateCommand } from './commands/generate.command'
import { InstallCommand } from './commands/install.command'
import { RootCommand } from './commands/root.command'
import { StartCommand } from './commands/start.command'
import { StopCommand } from './commands/stop.command'
import { UninstallCommand } from './commands/uninstall.command'
import { UtilCommand } from './commands/util.command'
import { VerifyCommand } from './commands/verify.command'
import { VersionCommand } from './commands/version.command'

import { ReactiveSpawn } from './ReactiveSpawn'

@Module({
  providers: [
    ReactiveSpawn,
    ExecuteCommand,
    ...GenerateCommand.registerWithSubCommands(),
    InstallCommand,
    RootCommand,
    StartCommand,
    StopCommand,
    UninstallCommand,
    ...UtilCommand.registerWithSubCommands(),
    ...VerifyCommand.registerWithSubCommands(),
    VersionCommand,
  ],
})
export class AppModule {}
