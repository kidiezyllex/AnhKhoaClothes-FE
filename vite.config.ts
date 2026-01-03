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

    // Theo dõi thay đổi file bằng polling (hữu ích khi chạy trên Docker, WSL,...)
    watch: {
      usePolling: true,
    },

    // Bật HMR (Hot Module Replacement) để tự động reload khi có thay đổi
    hmr: true,

    // Cho phép tất cả các host truy cập (phù hợp khi chạy LAN, Docker,...)
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

  // 🌐 Base path cho toàn bộ app khi build (mặc định '/')
  base: '/',
})
