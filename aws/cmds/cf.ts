import { readFile } from 'node:fs/promises'
import {
	ArgumentsCamelCase,
	CommandModule,
} from 'yargs'
import {
	CloudFormationClient,
	CreateChangeSetCommand,
} from '@aws-sdk/client-cloudformation'
import type {
	ResourceToImport,
} from '@aws-sdk/client-cloudformation'


const command: CommandModule = {
	command: 'cf',
	describe: '',
	builder: yargs => yargs
		.command(dynamodbImportCommand)
		.demandCommand(),
	handler: () => { },
}

export default command

const dynamodbImportCommand: CommandModule = {
	command: 'dynamodb-import',
	describe: '',
	builder: yargs => yargs
		.options({
			path: {
				type: 'string',
				default: './templates/db/.serverless/cloudformation-template-update-stack.json',
			},
			stackName: {
				type: 'string',
				require: true,
			},
			changeSetName: {
				type: 'string',
				require: true,
			},
		}),
	handler: handler,
}

async function handler(argv: ArgumentsCamelCase<any>) {
	const client = new CloudFormationClient({ region: argv.region, maxAttempts: 10 })
	let imports: ResourceToImport[] = []
	try {
		const file = await readFile(argv.path)
		const templates = JSON.parse(file.toString())
		const resources: any = Object.entries(templates['Resources'])
		for (const [key, resource] of resources) {
			imports.push({
				ResourceType: resource.Type,
				LogicalResourceId: key,
				ResourceIdentifier: {
					TableName: resource['Properties']['TableName'],
				},
			})
		}
		// Delete unrecoverable properties from templates
		// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery_Howitworks.html
		delete templates['Outputs']
		for (const key of Object.keys(templates['Resources'])) {
			delete templates['Resources'][key]['Properties']['PointInTimeRecoverySpecification']
			delete templates['Resources'][key]['Properties']['StreamSpecification']
		}
		const command = new CreateChangeSetCommand({
			ChangeSetName: argv.changeSetName,
			StackName: argv.stackName,
			TemplateBody: JSON.stringify(templates),
			ChangeSetType: 'IMPORT',
			ResourcesToImport: imports,
		})
		const data = await client.send(command);
		console.log(data)
	} catch (err) {
		console.error(err)
	}
}
