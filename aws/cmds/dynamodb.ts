import { readdir, readFile } from 'node:fs/promises'
import {
  ArgumentsCamelCase,
  CommandModule,
} from 'yargs'
import { marshall } from '@aws-sdk/util-dynamodb'
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import type { PutItemCommandInput } from "@aws-sdk/client-dynamodb"

const command: CommandModule = {
  command: 'dynamodb',
  describe: '',
  builder: yargs => yargs
    .command(seedCommand)
    .command(fixtureCommand)
    .demandCommand(),
  handler: () => { },
}

export default command

const seedCommand: CommandModule = {
  command: 'seed',
  describe: '',
  builder: yargs => yargs
    .options({
      path: {
        type: 'string',
        default: './db/seeds',
      },
    }),
  handler: handler,
}

const fixtureCommand: CommandModule = {
  command: 'fixture',
  describe: '',
  builder: yargs => yargs
    .options({
      path: {
        type: 'string',
        default: './db/fixtures',
      },
    }),
  handler: handler,
}

async function handler(argv: ArgumentsCamelCase<any>) {
  const ddbClient = new DynamoDBClient({ region: argv.region, maxAttempts: 10 })
  try {
    const files = await readdir(argv.path)
    const seedJSONFileNames = files.filter(name => name.endsWith('.json'))
    for (const filename of seedJSONFileNames) {
      const seedJSONFile = await readFile(`${argv.path}/${filename}`)
      const items = JSON.parse(String(seedJSONFile))
      const tableName = filename.slice(0, -5).toString()
      for (const item of items) {
        const param = ({
          TableName: `${argv.serviceName}-${argv.stage}-${tableName}`,
          Item: marshall(item),
        })
        console.log(`inserting data: ${JSON.stringify(marshall(item))}`)
        await ddbClient.send(new PutItemCommand(param))
      }
    }
  } catch (err) {
    console.error(err)
  }
}
