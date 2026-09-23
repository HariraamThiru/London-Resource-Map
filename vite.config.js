import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from https://<username>.github.io/london-resource-map/,
// so every built asset path needs that prefix.
export default defineConfig({
  base: '/london-resource-map/',
  plugins: [react()],
})
