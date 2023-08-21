import { readdir, readFileSync } from 'node:fs'
import {
	ArgumentsCamelCase,
	CommandModule,
} from 'yargs'
import { marshall } from '@aws-sdk/util-dynamodb'
import {
	SESv2Client,
	CreateEmailTemplateCommand,
	GetEmailTemplateCommand,
	UpdateEmailTemplateCommand,
} from "@aws-sdk/client-sesv2"
import { globSync } from 'glob'

const command: CommandModule = {
	command: 'ses',
	describe: '',
	builder: yargs => yargs
		.command(syncCommand)
		.demandCommand(),
	handler: () => { },
}

export default command

const syncCommand: CommandModule = {
	command: 'sync',
	describe: '',
	builder: yargs => yargs
		.options({
			basePath: {
				type: 'string',
				default: '../templates/translator',
			},
		}),
	handler: handler,
}

async function handler(argv: ArgumentsCamelCase<any>) {
	const sesClient = new SESv2Client({ region: argv.region, maxAttempts: 10 })
	try {
		const paths = await globSync(`${argv.basePath}/output/**/*.json`)
		for (const path of paths) {
			const config: { name: string, subject: string } = JSON.parse(readFileSync(path, 'utf8'))
			const html = readFileSync(path.replace(/.json$/, '.html'), 'utf8')
			const txt = readFileSync(path.replace(/.json$/, '.txt'), 'utf8')
			const param = {
				TemplateName: `${argv.serviceName}_${config.name}_${argv.stage}`,
				TemplateContent: {
					Subject: config.subject,
					Text: txt,
					Html: html,
				},
			}
			console.info(`updating template ${param.TemplateName}`)
			const err = await sesClient.send(new UpdateEmailTemplateCommand(param)).then().catch(err => err)
			if (err?.$metadata?.httpStatusCode === 404) {
				console.info(`creating template ${param.TemplateName}`)
				await sesClient.send(new CreateEmailTemplateCommand(param))
			}
		}
	} catch (err) {
		console.error(err)
	}
}
