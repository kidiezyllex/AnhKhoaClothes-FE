import { useParams } from 'react-router-dom'
import OrderDetailPage from '@/app/admin/orders/[orderId]/page'

const AdminOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  
  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Chi tiết đơn hàng</h1>
        <p className="text-gray-600">ID đơn hàng không hợp lệ</p>
      </div>
    )
  }
  
  return <OrderDetailPage params={{ orderId }} />
}

export default AdminOrderDetailPage
