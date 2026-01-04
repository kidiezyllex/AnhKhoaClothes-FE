// Import hàm defineConfig để định nghĩa cấu hình cho Vite
import { defineConfig } from 'vite'

// Import plugin React để hỗ trợ JSX, Fast Refresh,...
import react from '@vitejs/plugin-react'

// Import path để xử lý alias đường dẫn
import path from 'path'

// Xuất cấu hình Vite
export default defineConfig({
  // ⚙️ Cấu hình server dev
  server: {
    // Cổng chạy ứng dụng là 3000
    port: 3000,
    strictPort: true, // Nếu cổng 3000 bận thì báo lỗi thay vì tự chuyển cổng khác

    // Tắt polling nếu không dùng Docker/WSL cũ để giảm tải CPU
    watch: {
      usePolling: false, 
    },

    // Bật HMR (Hot Module Replacement)
    hmr: {
      overlay: true, // Hiển thị lỗi trên màn hình
    },

    // Cho phép tất cả các host truy cập
    allowedHosts: ['*'],
  },

  // 🔌 Thêm plugin vào Vite
  plugins: [
    // Kích hoạt plugin React (JSX, Fast Refresh,...)
    react(),
  ],

  //  Cấu hình resolve alias
  resolve: {
    alias: {
      // Khi import '@/' sẽ hiểu là './src'
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 🛠️ Cấu hình Build
  build: {
    target: 'esnext',
    minify: 'esbuild', // Dùng esbuild để build nhanh hơn
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Tách code (Code Splitting) thông minh hơn
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@mui/material', '@mui/icons-material', 'framer-motion'],
          'utils-vendor': ['axios', 'date-fns', 'lodash'],
        },
      },
    },
    // Tăng giới hạn cảnh báo chunk size (mặc định 500kb)
    chunkSizeWarningLimit: 1000, 
  },

  // ⚡ Tối ưu hóa dependencies (Pre-bundling)
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
  },

  // 🌐 Base path cho toàn bộ app khi build (mặc định '/')
  base: '/',
})
