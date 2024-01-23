import { Module } from '@nestjs/common'

import { CleanCommand } from './commands/clean.command'
import { ExecuteCommand } from './commands/execute.command'
import { GenerateCommand } from './commands/generate.command'
import { InitCommand } from './commands/init.command'
import { RootCommand } from './commands/root.command'
import { UtilCommand } from './commands/util.command'
import { VerifyCommand } from './commands/verify.command'
import { VersionCommand } from './commands/version.command'

import { ReactiveSpawn } from './ReactiveSpawn'

@Module({
  providers: [
    ReactiveSpawn,
    CleanCommand,
    ExecuteCommand,
    ...GenerateCommand.registerWithSubCommands(),
    InitCommand,
    RootCommand,
    ...UtilCommand.registerWithSubCommands(),
    ...VerifyCommand.registerWithSubCommands(),
    VersionCommand,
  ],
})
export class AppModule {}
