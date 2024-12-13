import * as v from "valibot";
export const kouseiApiSchema = v.object({
	name: v.string(),
	_name: v.string(), // original name
	text: v.string(),
})

export type KouseiApiResponse = v.Input<typeof kouseiApiSchema>;

export const yahooKouseiApiResponseSchema = v.object({
	id: v.string(),
	jsonrpc: v.string(),
	result: v.object({
		suggestions: v.array(
			v.object({
				length: v.string(),
				note: v.string(),
				offset: v.string(),
				rule: v.string(),
				suggestion: v.string(), word: v.string()
			})),
	}),
})
export type YahooKouseiApiResponse = v.Input<typeof yahooKouseiApiResponseSchema>;

export const kousei = (resp: YahooKouseiApiResponse, text: string) => {
	if (resp.result.suggestions.length == 0) return text;

	let cur = 0;
	let updatedText = text;

	for (const suggestion of resp.result.suggestions) {
		if (suggestion.suggestion.length == 0) continue
		const offset = parseInt(suggestion.offset, 10);
		const length = parseInt(suggestion.length, 10);
		const start = offset + cur;
		const end = start + length;
		updatedText =
			updatedText.slice(0, start) +
			suggestion.suggestion +
			updatedText.slice(end);
		cur += suggestion.suggestion.length - length;
	}
	return updatedText
}


const apiKey = "";
const apiEndpoint = "https://jlp.yahooapis.jp/KouseiService/V2/kousei";
const resp = await fetch(apiEndpoint, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"User-Agent": `Yahoo AppID: ${apiKey}`,
	},
	body: JSON.stringify({
		id: "1",
		jsonrpc: "2.0",
		method: "jlp.kouseiservice.kousei",
		params: {
			q: submission.value.text
		},
	}),
})
const data = await resp.json();
const validated = safeParse(yahooKouseiApiResponseSchema, data)
if (!validated.success)
	return ({
		message: JSON.stringify(validated.issues),
		result: false,
		submission: null,
	})
const kouseiData = kousei(validated.output, submission.value.text)
