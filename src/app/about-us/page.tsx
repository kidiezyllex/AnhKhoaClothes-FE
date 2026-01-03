// Kích hoạt chế độ Client Component trong Next.js 13+
// Giúp component có thể sử dụng hook như useState, useEffect,...
"use client"

// Import component AboutUsPage từ thư mục components
import AboutUsPage from '@/components/AboutUsPage'

// Import React để sử dụng JSX và các tính năng của React
import React from 'react'

// Định nghĩa một component React tên là `page` (đây là file page.tsx dùng cho routing)
function page() {
    // Trả về component AboutUsPage để hiển thị nội dung trang "Giới thiệu"
    return <AboutUsPage />
}

// Export mặc định component `page` để Next.js sử dụng cho routing
export default page
