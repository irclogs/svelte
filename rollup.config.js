import json from "@rollup/plugin-json";
import css from "rollup-plugin-css-only";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import replace from '@rollup/plugin-replace';
import svelte from "rollup-plugin-svelte";
import autoPreprocess from 'svelte-preprocess';
import { plugins as prodPlugins } from './rollup.prod.config.js';

const isProduction = process.env.NODE_ENV == "production";

const plugins = [
  replace({
    values: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
      __buildDate__: () => JSON.stringify(new Date()),
    },
    preventAssignment: true,
  }),
  svelte({
    compilerOptions: { dev: !isProduction },
    extensions: [".svelte"],
    preprocess: autoPreprocess(),
  }),
  typescript({ sourceMap: false }),
  css({ output: "bundle.css" }),
  json({
    exclude: "node_modules/**",
    preferConst: true,
  }),

  resolve({ browser: true, dedupe: ["svelte"] }),
  commonjs(),
];

if (isProduction) {
  plugins.push(...prodPlugins);
}

export default {
  input: "src/main.ts",
  output: {
    sourcemap: true,
    file: "dist/bundle.js",
    format: "iife",
    name: "app"
  },
  plugins
};
