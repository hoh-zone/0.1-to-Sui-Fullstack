import { defineConfig } from '@farmfe/core'
import farmJsPluginPostcss from '@farmfe/js-plugin-postcss'
import less from '@farmfe/js-plugin-less'
import path from 'path'

export default defineConfig({
  plugins: [
    '@farmfe/plugin-react',
    less(),
    farmJsPluginPostcss(),
  ],
  compilation: {
    resolve: {
      alias: {
        '/@/': path.join(process.cwd(), 'src')
      },
    },
    external: ['node:fs']
  },
});
