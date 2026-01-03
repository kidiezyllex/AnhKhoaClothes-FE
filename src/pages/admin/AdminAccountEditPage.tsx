import { useParams } from 'react-router-dom'
import EditAccountPage from '@/app/admin/accounts/edit/[id]/page'

const AdminAccountEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  
  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Sửa tài khoản</h1>
        <p className="text-gray-600">ID tài khoản không hợp lệ</p>
      </div>
    )
  }
  
  return <EditAccountPage params={{ id }} />
}

export default AdminAccountEditPage
