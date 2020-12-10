import { terser } from "rollup-plugin-terser";
import babel from '@rollup/plugin-babel';


export const plugins = [
    babel({
      babelHelpers: 'runtime',
      plugins: ["@babel/plugin-transform-runtime"],
      extensions: [".js", ".ts", ".mjs", ".html", ".svelte"],
    }),

    terser()
]
