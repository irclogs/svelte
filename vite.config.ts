import { defineConfig } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/*
 * Consult https://svelte.dev/docs#compile-time-svelte-preprocess
 * for more information about the svelte preprocessor
 */
const svelteConfig = {
  preprocess: vitePreprocess(),
  compilerOptions: {
    runes: true,
  },
};


/*
 * https://vitejs.dev/config/
 */
export default defineConfig({
  server: { port: parseInt(process.env.npm_package_config_port) },
  build: { sourcemap: true },
  plugins: [svelte(svelteConfig)],
});
