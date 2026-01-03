import { useParams } from 'react-router-dom'
import EditProductPage from '@/app/admin/products/edit/[id]/page'

const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Sửa sản phẩm</h1>
        <p className="text-gray-600">ID sản phẩm không hợp lệ</p>
      </div>
    )
  }
  
  return <EditProductPage params={{ id }} />
}

export default AdminProductEditPage
