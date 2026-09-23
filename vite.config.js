import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from https://<username>.github.io/London-Resource-Map/,
// so every built asset path needs that prefix. It must match the repo name exactly,
// capitals included, because GitHub Pages paths are case-sensitive.
export default defineConfig({
  base: '/London-Resource-Map/',
  plugins: [react()],
})
