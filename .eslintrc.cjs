module.exports = {
  root: true, // Chỉ định đây là file ESLint gốc (ESLint sẽ không tìm file .eslintrc ở thư mục cha)

  env: {
    browser: true,   // Hỗ trợ biến toàn cục của trình duyệt (window, document, etc.)
    es2020: true     // Sử dụng cú pháp ECMAScript 2020 trở lên
  },

  extends: [
    'eslint:recommended',               // Áp dụng các quy tắc mặc định được ESLint khuyến nghị
    '@typescript-eslint/recommended',  // Áp dụng quy tắc riêng cho TypeScript
    'plugin:react-hooks/recommended',  // Bắt buộc tuân theo quy tắc hooks của React (như useEffect phải đúng cú pháp)
  ],

  ignorePatterns: [
    'dist',             // Bỏ qua thư mục `dist` khi lint (do là file build)
    '.eslintrc.cjs'     // Không lint chính file cấu hình ESLint này
  ],

  parser: '@typescript-eslint/parser', // Sử dụng parser dành cho TypeScript

  plugins: [
    'react-refresh' // Plugin để tối ưu hot-reload trong React (hữu ích khi dùng Vite hoặc CRA)
  ],

  rules: {
    // Cảnh báo nếu component export không đúng cho HMR (hot module reload)
    'react-refresh/only-export-components': [
      'warn', // Mức độ cảnh báo
      { allowConstantExport: true } // Cho phép export dưới dạng const (const Component = () => ...)
    ],

    // Cảnh báo nếu biến được khai báo nhưng không dùng
    '@typescript-eslint/no-unused-vars': 'warn',

    // Tắt lỗi khi dùng `any` (hữu ích khi làm việc nhanh, prototyping)
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
