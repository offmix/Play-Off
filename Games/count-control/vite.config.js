import { defineConfig } from 'vite'

export default defineConfig({
  server: { port: 3020 },
  preview: { port: 3020 },
  build: { outDir: 'dist' },
})
