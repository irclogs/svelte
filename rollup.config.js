import json from "@rollup/plugin-json";
import css from "rollup-plugin-css-only";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import svelte from "rollup-plugin-svelte";
import autoPreprocess from 'svelte-preprocess';
import { plugins as prodPlugins } from './rollup.prod.config.js';

const production = process.env.NODE_ENV == "production";
const sourcemap = true;

const plugins = [
  svelte({
    compilerOptions: { dev: !production },
    extensions: [".svelte"],
    preprocess: autoPreprocess(),
  }),
  typescript({ sourceMap: sourcemap }),
  css({ output: "bundle.css" }),
  json({
    exclude: "node_modules/**",
    preferConst: true,
  }),

  resolve({browser: true, dedupe: ['svelte']}),
  commonjs(),
];

if (production) {
   plugins.push(...prodPlugins);
}

export default {
  input: "src/main.ts",
  output: {
    sourcemap,
    file: "dist/bundle.js",
    format: "iife",
    name: "app"
  },
  plugins
};
