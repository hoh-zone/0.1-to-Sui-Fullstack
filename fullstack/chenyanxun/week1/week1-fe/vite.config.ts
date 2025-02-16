import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 8080,
    cors: true,
    proxy: {
      
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 设置别名
    }
  }
})
