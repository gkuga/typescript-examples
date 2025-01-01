(() => {
	type Colors = "red" | "green" | "blue";
	type RGB = [red: number, green: number, blue: number];
	const palette: Record<Colors, string | RGB> = {
		red: [255, 0, 0],
		green: "#00ff00",
		// bleu: [0, 0, 255] # Object literal may only specify known properties, and 'bleu' does not exist in type 'Record<Colors, string | RGB>'.
		blue: [0, 0, 255]
		//  ~~~~ The typo is now correctly detected
	};
	// But we now have an undesirable error here - 'palette.green' "could" be of type RGB and
	// property 'toUpperCase' does not exist on type 'string | RGB'.

	// Property 'toUpperCase' does not exist on type 'string | RGB'.   Property 'toUpperCase' does not exist on type 'RGB'.
	// const greenNormalized = palette.green.toUpperCase();
})()
