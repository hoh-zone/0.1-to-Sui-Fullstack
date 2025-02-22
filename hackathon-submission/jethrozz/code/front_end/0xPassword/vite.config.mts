import { defineConfig } from "vite";
import { viteStaticCopy } from 'vite-plugin-static-copy' // 需要先安装这个插件
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    port: 3000
  },
  plugins: [react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        content: 'src/content/content.ts',
        back: 'src/back/service_worker.ts'
      },
      output: {
        entryFileNames: '[name].js',
        format: 'es'
      }
    }
  }
})