import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: process.env.npm_package_config_port },
  build: { sourcemap: true },
  plugins: [svelte()]
})
