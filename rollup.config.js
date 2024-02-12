import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
	input: './index.js',
    output: {
        file: './dist/inlineparser.js',
        format: 'iife',
        sourcemap: true,
        name: "InlineParser"
    },
    plugins: [
        nodeResolve()
    ]
};