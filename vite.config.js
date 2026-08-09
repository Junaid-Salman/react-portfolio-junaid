import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), '')
    if (!env.VITE_WEB3FORMS_ACCESS_KEY) {
      throw new Error(
        'VITE_WEB3FORMS_ACCESS_KEY is not set. Add it to .env (see .env.example) or your deployment environment before building.'
      )
    }
  }

  return {
    plugins: [react()],
  }
})
