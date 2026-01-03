import { useParams } from 'react-router-dom'
import EditOrderPage from '@/app/admin/orders/edit/[id]/page'

const AdminOrderEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Sửa đơn hàng</h1>
        <p className="text-gray-600">ID đơn hàng không hợp lệ</p>
      </div>
    )
  }
  
  return <EditOrderPage params={{ id }} />
}

export default AdminOrderEditPage
