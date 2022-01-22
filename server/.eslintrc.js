module.exports = {
	env: {
		node: true,
		es6: true,
		es2021: true,
		jest: true,
	},
	extends: [
		"eslint:recommended",
		"airbnb-base",
	],
	parserOptions: {
		ecmaVersion: 12,
	},
	rules: {
		"linebreak-style": "off",
		"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
		"no-use-before-define": ["error", { variables: false }],
		"prefer-destructuring": ["error", { VariableDeclarator: { object: true } }],
		indent: ["error", "tab"],
		"no-tabs": ["error", { allowIndentationTabs: true }],
		quotes: ["error", "double"],
	},
};
