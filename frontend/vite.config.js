import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('react-router-dom')) {
            return 'router';
          }

          if (
            id.includes('/react/') ||
            id.includes('/react-dom/')
          ) {
            return 'react-vendor';
          }

          if (
            id.includes('@reduxjs/toolkit') ||
            id.includes('react-redux')
          ) {
            return 'redux';
          }

          if (id.includes('recharts')) {
            return 'charts';
          }

          if (
            id.includes('react-markdown') ||
            id.includes('react-syntax-highlighter') ||
            id.includes('remark-gfm')
          ) {
            return 'markdown';
          }

          if (id.includes('lucide-react')) {
            return 'icons';
          }

          if (
            id.includes('axios') ||
            id.includes('moment') ||
            id.includes('date-fns') ||
            id.includes('react-hot-toast') ||
            id.includes('react-datepicker') ||
            id.includes('emoji-picker-react')
          ) {
            return 'vendor';
          }
        },
      },
    },
  },
})
