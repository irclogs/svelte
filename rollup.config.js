import json from 'rollup-plugin-json';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import { preprocess as ts_preprocess } from 'svelte-ts-preprocess';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/main.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'dist/bundle.js'
    },
    plugins: [
        svelte({
            dev: !production,
            css: css => {
                css.write('dist/bundle.css');
            },
            preprocess: ts_preprocess
        }),
        json({
           exclude: 'node_modules/**',
           preferConst: true,
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration —
        // consult the documentation for details:
        // https://github.com/rollup/rollup-plugin-commonjs
        resolve(),
        commonjs(),
        typescript({lib: ["es5", "es6", "dom"], target: "es5"}),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()
    ]
};
