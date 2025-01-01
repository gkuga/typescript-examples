type Colors = "red" | "green" | "blue";
// Ensure that we have exactly the keys from 'Colors'.
const favoriteColors = {
  "red": "yes",
  "green": false,
  "blue": "kinda",

  // Object literal may only specify known properties, and '"platypus"' does not exist in type 'Record<Colors, unknown>'.
  //"platypus": false
  //  ~~~~~~~~~~ error - "platypus" was never listed in 'Colors'.
} satisfies Record<Colors, unknown>;
// All the information about the 'red', 'green', and 'blue' properties are retained.
const g: boolean = favoriteColors.green;
