import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from "remark-gfm"
import gemoji from 'remark-gemoji'
import { compression } from 'vite-plugin-compression2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm, gemoji],
      rehypePlugins: [],
    }),
    react(),
//    compression()
  ],
})
