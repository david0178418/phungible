const OFF = 0;
const WARN = 1;
const ERR = 2;


module.exports = {
	// In VS Code, ESLint only validates js by default. Be certain to enable
    // ts validation in eslint settings by adding the flowing to the
    // eslint.validate list:
    //   typescript
    //   typescriptreact
	extends: 'react-app',
	plugins: [
		'react-hooks',
	],
    rules: {
        'no-shadow': ERR,
        'no-extra-semi': WARN,
        quotes: [WARN, 'single'],
        semi: ERR,
        'comma-dangle': [WARN, 'always-multiline'],
		'jsx-a11y/anchor-is-valid': OFF,
		'jsx-a11y/alt-text': OFF,
    },
};
