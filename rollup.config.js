import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {  
	input: 'src/index.js',
	output: {
		name: 'jigsaw',
		file: pkg.browser,
		format: 'umd', // browser-friendly UMD build
	},
	plugins: [
		resolve(),
		babel({
			runtimeHelpers: true,
			exclude: 'node_modules/**' // only transpile our source code
		})
	]
}
