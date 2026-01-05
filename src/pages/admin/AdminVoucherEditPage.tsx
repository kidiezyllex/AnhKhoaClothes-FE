import EditVoucherPage from "@/app/admin/discounts/vouchers/edit/[id]/page";
import { useParams } from "react-router-dom";

const AdminVoucherEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Sửa voucher</h1>
        <p className="text-gray-700">ID voucher không hợp lệ</p>
      </div>
    );
  }

  return <EditVoucherPage params={{ id }} />;
};

export default AdminVoucherEditPage;
