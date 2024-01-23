#!/usr/bin/env node
import { CommandFactory } from 'nest-commander'

import { AppModule } from './app.module'
import { initializeGlobals, initializeDirectories } from './initializers'

async function bootstrap() {
  await CommandFactory.run(AppModule)
}

initializeGlobals()
initializeDirectories()
bootstrap()
