import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import babel from '@rollup/plugin-babel';
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import svelte from "rollup-plugin-svelte";
import autoPreprocess from 'svelte-preprocess';
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.js",
    sourcemap: true,
    format: "iife",
    name: "app",
  },
  plugins: [
    svelte({
      dev: !production,
      css: (css) => {
        css.write("bundle.css");
      },
      preprocess: autoPreprocess(),
    }),
    json({
      exclude: "node_modules/**",
      preferConst: true,
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: [".js", ".mjs", ".html", ".svelte"],
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({browser: true, dedupe: ['svelte']}),
    commonjs(),
    typescript({ sourceMap: !production, inlineSources: !production }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
};
