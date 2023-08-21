import { load } from 'js-yaml'
import { readFile } from 'node:fs/promises'
import {
	ArgumentsCamelCase,
	CommandModule,
} from 'yargs'
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider'
import {
	CognitoIdentityClient,
	GetIdCommand,
	GetCredentialsForIdentityCommand,
} from '@aws-sdk/client-cognito-identity'

const command: CommandModule = {
	command: 'token',
	describe: '',
	builder: yargs => yargs
		.command(generateCommand)
		.demandCommand(),
	handler: () => { },
}

export default command

const generateCommand: CommandModule = {
	command: 'generate',
	describe: '',
	builder: yargs => yargs
		.options({
			parameterFilePath: {
				type: 'string',
				default: './shared/params.yml',
			},
			username: {
				type: 'string',
				require: true,
			},
			password: {
				type: 'string',
				require: true,
			},
		}),
	handler: handler,
}

const loadYamlFile = async (path: string) => {
	return readFile(path, 'utf8').then(file => load(file))
}

async function handler(argv: ArgumentsCamelCase<any>) {
	const client = new CognitoIdentityProvider({ region: argv.region, maxAttempts: 10 })
	const file: any = await loadYamlFile(argv.parameterFilePath)
	const authResp = await client.adminInitiateAuth({
		UserPoolId: file.dev.cognitoUserPoolID,
		ClientId: file.dev.cognitoUserPoolClientID,
		AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
		AuthParameters: {
			USERNAME: argv.username,
			PASSWORD: argv.password,
		},
	})
	const cognitoIdentity = new CognitoIdentityClient({ region: argv.region, maxAttempts: 10 })
	if (!authResp.AuthenticationResult?.IdToken)
		throw Error(`missing IdToken: ${JSON.stringify(authResp)}`)
	const cognitoUserPool = `cognito-idp.${argv.region}.amazonaws.com/${file.dev.cognitoUserPoolID}`
	const getIDCommand = new GetIdCommand({
		IdentityPoolId: file.dev.cognitoIdentityPoolID,
		Logins: {
			[cognitoUserPool]: authResp.AuthenticationResult.IdToken
		},
	})
	const getIDResp = await cognitoIdentity.send(getIDCommand)
	if (!getIDResp.IdentityId)
		throw new Error(`IdentityId is empty: ${JSON.stringify(getIDResp)}`)
	const getCredentialsForIdentityCommand = new GetCredentialsForIdentityCommand({
		IdentityId: getIDResp.IdentityId,
		Logins: {
			[cognitoUserPool]: authResp.AuthenticationResult.IdToken
		},
	})
	const token = await cognitoIdentity.send(getCredentialsForIdentityCommand)
	console.log(token)
}
