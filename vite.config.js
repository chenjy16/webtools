import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('Loaded environment variables:', Object.keys(env))
  
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        }
      }
    },
    define: {
      // 确保环境变量能被正确注入
      'import.meta.env.VITE_HUGGINGFACE_API_KEY': JSON.stringify(env.VITE_HUGGINGFACE_API_KEY || ''),
      'process.env': JSON.stringify({}),
      '__require.resolve': '"function(path) { return path; }"',
      'global': 'window'
    }
  }
})
