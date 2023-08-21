import Yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { MiddlewareFunction, Options } from 'yargs'
import dynamodb from '~/cmds/dynamodb'
import ses from '~/cmds/ses'
import token from '~/cmds/token'
import cf from '~/cmds/cf'
import { resolve } from 'path'
import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { config } from 'dotenv'
config({
  debug: process.env.DEBUG === 'true' ? true : false,
  path: process.env.DOTENV_PATH ?? resolve(process.cwd(), '..', '.env'),
})

async function main() {
  const regionOption: Options = {
    type: 'string',
    default: 'ap-northeast-1',
  }
  const serviceNameOption: Options = {
    type: 'string',
    default: process.env.SERVICE_NAME,
    required: true,
  }
  const stageOption: Options = {
    type: 'string',
    default: 'dev',
  }
  const globalOptionChecker: MiddlewareFunction = async (argv) => {
    console.info(`service-name=${argv.serviceName}`)
    console.info(`region=${argv.region}`)
    console.info(`stage=${argv.stage}`)
    const rl = createInterface({ input, output })
    const answer = await rl.question(`${argv._.join(' ')}を実行しますか？[y/N]`)
    rl.close()
    if (answer !== 'y') {
      process.exit(0)
    }
  }
  Yargs(hideBin(process.argv))
    .options({
      region: regionOption,
      serviceName: serviceNameOption,
      stage: stageOption,
    })
    .middleware(globalOptionChecker)
    .command(dynamodb)
    .command(ses)
    .command(token)
    .command(cf)
    .demandCommand()
    .help()
    .parse()
}

main()
