import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'jigsaw',
			file: pkg.browser,
			format: 'umd'
		}
	}
];
