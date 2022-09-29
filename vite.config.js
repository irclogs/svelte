import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import preprocess from "svelte-preprocess";

export default defineConfig({
  plugins: [svelte({ preprocess: preprocess() })],
  server: { port: process.env.npm_package_config_port },
  build: { sourcemap: true },
});
