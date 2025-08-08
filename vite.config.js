import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose env for client; Vite automatically injects import.meta.env.VITE_*
  define: {
    'process.env': {}
  }
})
