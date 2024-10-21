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
export default defineConfig(({mode}) => {
  return {
    server: { port: parseInt(process.env.npm_package_config_port) },
    build: { sourcemap: true },
    plugins: [svelte(svelteConfig)],
    define: {
      "__APP_RELEASE_VERSION__": JSON.stringify(version()),
    }
  }
});

function version() {
  const t = new Date();
  const date = t.toISOString().split('T')[0]; // YYYY-MM-DD
  return `v${date}`;
}
