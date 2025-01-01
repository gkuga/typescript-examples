(() => {
	type Colors = "red" | "green" | "blue";
	type RGB = [red: number, green: number, blue: number];
	const palette = {
		red: [255, 0, 0],
		green: "#00ff00",
		// bleu: [0, 0, 255] // Object literal may only specify known properties, and 'bleu' does not exist in type 'Record<Colors, string | RGB>'.
		blue: [0, 0, 255]
		//  ~~~~ The typo is now caught!
	} satisfies Record<Colors, string | RGB>;
	// toUpperCase() method is still accessible!
	const greenNormalized = palette.green.toUpperCase();
	console.log(greenNormalized)
})()
