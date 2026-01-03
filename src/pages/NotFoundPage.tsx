import React from 'react'

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Trang không tìm thấy</h2>
        <p className="text-gray-500 mb-8">Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
        <a 
          href="/" 
          className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Về trang chủ
        </a>
      </div>
    </div>
  )
}

export default NotFoundPage 