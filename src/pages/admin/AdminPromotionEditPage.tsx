import { useParams } from 'react-router-dom'
import EditPromotionPage from '@/app/admin/discounts/promotions/edit/[id]/page'

const AdminPromotionEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Sửa khuyến mãi</h1>
        <p className="text-gray-600">ID khuyến mãi không hợp lệ</p>
      </div>
    )
  }
  
  return <EditPromotionPage params={{ id }} />
}

export default AdminPromotionEditPage
