import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import svelte from "rollup-plugin-svelte";
import autoPreprocess from 'svelte-preprocess';
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "dist/bundle.js",
  },
  plugins: [
    svelte({
      dev: !production,
      css: (css) => {
        css.write("dist/bundle.css");
      },
      preprocess: autoPreprocess(),
    }),
    json({
      exclude: "node_modules/**",
      preferConst: true,
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve(),
    commonjs(),
    typescript({ sourceMap: !production }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
};
