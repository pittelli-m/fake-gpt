module.exports = {
	"*.{ts,tsx}": [
		"eslint --fix",
		"prettier --write",
		"bash -c \"tsc --noEmit\""
	],
	"*.{json,md}": ["prettier --write"]
};