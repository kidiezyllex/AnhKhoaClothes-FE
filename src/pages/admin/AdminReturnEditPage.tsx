import { useParams } from 'react-router-dom'
import EditReturnPage from '@/app/admin/returns/edit/[id]/page'

const AdminReturnEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Sửa trả hàng</h1>
        <p className="text-gray-600">ID trả hàng không hợp lệ</p>
      </div>
    )
  }
  
  return <EditReturnPage params={{ id }} />
}

export default AdminReturnEditPage
