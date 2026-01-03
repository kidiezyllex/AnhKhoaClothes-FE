// Import kiểu Order nếu cần dùng (hiện tại không dùng trong file này)
import { Order } from '../OrdersPage/mockData';

// Định nghĩa các lý do hoàn trả hàng có thể
export type ReturnReason = 
  | 'wrong_size'        // Sai kích cỡ
  | 'wrong_item'        // Giao nhầm sản phẩm
  | 'damaged'           // Sản phẩm bị hỏng trong quá trình giao
  | 'defective'         // Sản phẩm bị lỗi kỹ thuật
  | 'changed_mind'      // Khách đổi ý không muốn mua nữa
  | 'other';            // Lý do khác

// Trạng thái xử lý yêu cầu hoàn trả
export type ReturnStatus = 
  | 'pending'           // Chờ xử lý
  | 'approved'          // Đã được chấp nhận
  | 'rejected'          // Bị từ chối
  | 'completed';        // Đã hoàn tất hoàn trả

// Thông tin về từng mặt hàng trong đơn hoàn trả
export interface ReturnItem {
  id: string;               // ID của mục hoàn trả
  orderItemId: string;      // ID của sản phẩm trong đơn hàng gốc
  productId: string;        // ID sản phẩm
  productName: string;      // Tên sản phẩm
  productImage: string;     // Hình ảnh sản phẩm
  sku: string;              // Mã SKU
  size: string;             // Kích cỡ
  color: string;            // Màu sắc
  price: number;            // Giá sản phẩm
  quantity: number;         // Số lượng đã đặt
  returnedQuantity: number; // Số lượng được trả
}

// Thông tin chi tiết của một đơn hoàn trả
export interface Return {
  id: string;                         // ID hoàn trả
  code: string;                       // Mã hoàn trả (hiển thị)
  orderId: string;                    // ID đơn hàng gốc
  orderCode: string;                 // Mã đơn hàng gốc
  customerId: string;                // ID khách hàng
  customerName: string;              // Tên khách hàng
  customerPhone: string;             // Số điện thoại
  customerEmail?: string;            // Email (có thể không có)
  items: ReturnItem[];               // Danh sách sản phẩm hoàn trả
  reason: ReturnReason;              // Lý do hoàn trả (enum)
  reasonDetail?: string;             // Mô tả chi tiết lý do (tùy chọn)
  status: ReturnStatus;              // Trạng thái hoàn trả
  refundAmount: number;              // Số tiền hoàn trả
  refundMethod: string;              // Hình thức hoàn tiền (banking, momo...)
  refundStatus: 'pending' | 'completed' | 'failed'; // Trạng thái hoàn tiền
  staffId?: string;                  // Nhân viên xử lý (tùy chọn)
  staffName?: string;                // Tên nhân viên xử lý
  createdAt: string;                 // Ngày tạo đơn hoàn trả
  updatedAt: string;                 // Ngày cập nhật cuối
  images?: string[];                 // Hình ảnh kèm theo (lỗi sản phẩm...)
}

// Hàm chuyển đổi mã lý do thành văn bản tiếng Việt
export const getReturnReasonText = (reason: ReturnReason): string => {
  switch (reason) {
    case 'wrong_size': return 'Sai kích cỡ';
    case 'wrong_item': return 'Sản phẩm không đúng';
    case 'damaged': return 'Sản phẩm bị hỏng';
    case 'defective': return 'Sản phẩm bị lỗi';
    case 'changed_mind': return 'Đổi ý';
    case 'other': return 'Lý do khác';
    default: return 'Không xác định';
  }
};

// Hàm chuyển đổi trạng thái hoàn trả thành văn bản tiếng Việt
export const getReturnStatusText = (status: ReturnStatus): string => {
  switch (status) {
    case 'pending': return 'Chờ xử lý';
    case 'approved': return 'Đã chấp nhận';
    case 'rejected': return 'Từ chối';
    case 'completed': return 'Đã hoàn thành';
    default: return 'Không xác định';
  }
};

// Dữ liệu mẫu (mock data) cho các đơn hoàn trả
export const mockReturns: Return[] = [
  {
    id: '1',
    code: 'RTN-2023-00001',
    orderId: '1',
    orderCode: 'HD2023-00001',
    customerId: 'cus-1',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0987654321',
    customerEmail: 'an.nguyen@example.com',
    items: [
      {
        id: 'ritem-1',
        orderItemId: 'item-1',
        productId: 'prod-1',
        productName: 'Prada Air Force 1',
        productImage: '/images/products/Prada-af1-white.jpg',
        sku: 'NK-AF1-WT-42',
        size: '42',
        color: 'Trắng',
        price: 2200000,
        quantity: 1,
        returnedQuantity: 1,
      },
    ],
    reason: 'wrong_size',
    reasonDetail: 'Giày quá chật, cần đổi size lớn hơn',
    status: 'completed',
    refundAmount: 2200000,
    refundMethod: 'banking',
    refundStatus: 'completed',
    staffId: 'staff-1',
    staffName: 'Trần Văn Minh',
    createdAt: '2023-10-18T09:15:30Z',
    updatedAt: '2023-10-19T14:30:45Z',
  },
  {
    id: '2',
    code: 'RTN-2023-00002',
    orderId: '3',
    orderCode: 'HD2023-00003',
    customerId: 'cus-3',
    customerName: 'Lê Minh Cường',
    customerPhone: '0967890123',
    customerEmail: 'cuong.le@example.com',
    items: [
      {
        id: 'ritem-2',
        orderItemId: 'item-5',
        productId: 'prod-6',
        productName: 'Chanel Chuck Taylor',
        productImage: '/images/products/Chanel-chuck-low-black.jpg',
        sku: 'CV-CT-BK-43',
        size: '43',
        color: 'Đen',
        price: 1400000,
        quantity: 1,
        returnedQuantity: 1,
      },
    ],
    reason: 'defective',
    reasonDetail: 'Đế giày bị bong sau 2 ngày sử dụng',
    status: 'approved',
    refundAmount: 1400000,
    refundMethod: 'momo',
    refundStatus: 'pending',
    staffId: 'staff-2',
    staffName: 'Nguyễn Thị Hương',
    createdAt: '2023-10-23T10:20:15Z',
    updatedAt: '2023-10-24T11:15:30Z',
    images: [
      '/images/returns/defect-sole-1.jpg',
      '/images/returns/defect-sole-2.jpg',
    ],
  },
  {
    id: '3',
    code: 'RTN-2023-00003',
    orderId: '6',
    orderCode: 'HD2023-00006',
    customerId: 'cus-1',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0987654321',
    customerEmail: 'an.nguyen@example.com',
    items: [
      {
        id: 'ritem-3',
        orderItemId: 'item-9',
        productId: 'prod-7',
        productName: 'New Balance 574',
        productImage: '/images/products/newbalance-574-grey.jpg',
        sku: 'NB-574-GY-43',
        size: '43',
        color: 'Xám',
        price: 2200000,
        quantity: 1,
        returnedQuantity: 1,
      },
    ],
    reason: 'wrong_size',
    reasonDetail: 'Size quá lớn, cần đổi size nhỏ hơn',
    status: 'completed',
    refundAmount: 2200000,
    refundMethod: 'momo',
    refundStatus: 'completed',
    staffId: 'staff-1',
    staffName: 'Trần Văn Minh',
    createdAt: '2023-10-28T15:40:22Z',
    updatedAt: '2023-10-30T09:20:15Z',
  },
  {
    id: '4',
    code: 'RTN-2023-00004',
    orderId: '4',
    orderCode: 'HD2023-00004',
    customerId: 'cus-4',
    customerName: 'Phạm Thị Dung',
    customerPhone: '0923456789',
    customerEmail: 'dung.pham@example.com',
    items: [
      {
        id: 'ritem-4',
        orderItemId: 'item-6',
        productId: 'prod-4',
        productName: 'Louis Vuitton Old Skool',
        productImage: '/images/products/louis vuitton-old-skool-black.jpg',
        sku: 'VN-OS-BK-38',
        size: '38',
        color: 'Đen',
        price: 1800000,
        quantity: 1,
        returnedQuantity: 1,
      },
    ],
    reason: 'changed_mind',
    reasonDetail: 'Không thích thiết kế khi nhận hàng',
    status: 'rejected',
    refundAmount: 0,
    refundMethod: 'banking',
    refundStatus: 'failed',
    staffId: 'staff-3',
    staffName: 'Lê Văn Đức',
    createdAt: '2023-10-22T09:30:00Z',
    updatedAt: '2023-10-23T14:15:30Z',
  },
  {
    id: '5',
    code: 'RTN-2023-00005',
    orderId: '9',
    orderCode: 'HD2023-00009',
    customerId: 'cus-8',
    customerName: 'Vũ Đức Minh',
    customerPhone: '0912345987',
    customerEmail: 'minh.vu@example.com',
    items: [
      {
        id: 'ritem-5',
        orderItemId: 'item-12',
        productId: 'prod-12',
        productName: 'Uniqlo NMD',
        productImage: '/images/products/Uniqlo-nmd-black.jpg',
        sku: 'AD-NMD-BK-44',
        size: '44',
        color: 'Đen',
        price: 2900000,
        quantity: 1,
        returnedQuantity: 1,
      },
      {
        id: 'ritem-6',
        orderItemId: 'item-13',
        productId: 'prod-13',
        productName: 'Uniqlo Cap',
        productImage: '/images/products/Uniqlo-cap-black.jpg',
        sku: 'AD-CAP-BK-M',
        size: 'M',
        color: 'Đen',
        price: 400000,
        quantity: 1,
        returnedQuantity: 1,
      },
    ],
    reason: 'wrong_item',
    reasonDetail: 'Nhận được màu giày khác với đơn hàng',
    status: 'pending',
    refundAmount: 3300000,
    refundMethod: 'banking',
    refundStatus: 'pending',
    createdAt: '2023-11-02T11:45:30Z',
    updatedAt: '2023-11-02T11:45:30Z',
    images: [
      '/images/returns/wrong-color-1.jpg',
      '/images/returns/wrong-color-2.jpg',
    ],
  },
];
