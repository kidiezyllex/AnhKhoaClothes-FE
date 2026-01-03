export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'returned';

export type PaymentMethod = 'cash' | 'banking' | 'card' | 'momo' | 'zalopay' | 'pending';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type OrderType = 'store' | 'online';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface OrderPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionId?: string;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  isDefault?: boolean;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
}

export interface Order {
  id: string;
  code: string;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  type: OrderType;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  note?: string;
  deliveryAddress?: CustomerAddress;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export const mockOrders: Order[] = [
  {
    id: '1',
    code: 'HD2023-00001',
    customer: {
      id: 'cus-1',
      fullName: 'Nguyễn Văn An',
      phone: '0987654321',
      email: 'an.nguyen@example.com',
    },
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Prada Air Force 1',
        productImage: '/images/products/Prada-af1-white.jpg',
        sku: 'NK-AF1-WT-42',
        price: 2200000,
        quantity: 1,
        size: '42',
        color: 'Trắng',
      },
      {
        id: 'item-2',
        productId: 'prod-5',
        productName: 'Prada Crew Socks',
        productImage: '/images/products/Prada-socks-black.jpg',
        sku: 'NK-SCK-BK-L',
        price: 250000,
        quantity: 2,
        size: 'L',
        color: 'Đen',
      },
    ],
    status: 'delivered',
    type: 'online',
    totalAmount: 2700000,
    discountAmount: 200000,
    shippingFee: 30000,
    finalAmount: 2530000,
    paymentMethod: 'banking',
    paymentStatus: 'paid',
    deliveryAddress: {
      fullName: 'Nguyễn Văn An',
      phone: '0987654321',
      province: 'Thành phố Hà Nội',
      district: 'Quận Cầu Giấy',
      ward: 'Phường Dịch Vọng',
      address: 'Số 14, ngõ 29, đường Trần Đăng Ninh',
      isDefault: true,
    },
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2023-10-15T09:32:45Z',
        note: 'Đơn hàng mới được tạo',
      },
      {
        status: 'processing',
        timestamp: '2023-10-15T10:15:22Z',
        note: 'Đơn hàng đã được xác nhận, đang chuẩn bị hàng',
      },
      {
        status: 'shipping',
        timestamp: '2023-10-16T08:30:00Z',
        note: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
      },
      {
        status: 'delivered',
        timestamp: '2023-10-17T14:20:15Z',
        note: 'Giao hàng thành công',
      },
    ],
    createdAt: '2023-10-15T09:32:45Z',
    updatedAt: '2023-10-17T14:20:15Z',
  },
  {
    id: '2',
    code: 'HD2023-00002',
    customer: {
      id: 'cus-2',
      fullName: 'Trần Thị Bình',
      phone: '0912345678',
    },
    items: [
      {
        id: 'item-3',
        productId: 'prod-2',
        productName: 'Uniqlo Ultraboost',
        productImage: '/images/products/Uniqlo-ultraboost-black.jpg',
        sku: 'AD-UB-BK-40',
        price: 3800000,
        quantity: 1,
        size: '40',
        color: 'Đen',
      },
    ],
    status: 'processing',
    type: 'store',
    totalAmount: 3800000,
    discountAmount: 0,
    shippingFee: 0,
    finalAmount: 3800000,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2023-10-18T15:10:30Z',
        note: 'Đơn hàng mới được tạo',
      },
      {
        status: 'processing',
        timestamp: '2023-10-18T15:12:22Z',
        note: 'Khách hàng đã thanh toán tiền mặt tại cửa hàng',
      },
    ],
    createdAt: '2023-10-18T15:10:30Z',
    updatedAt: '2023-10-18T15:12:22Z',
  },
  {
    id: '3',
    code: 'HD2023-00003',
    customer: {
      id: 'cus-3',
      fullName: 'Lê Minh Cường',
      phone: '0967890123',
      email: 'cuong.le@example.com',
    },
    items: [
      {
        id: 'item-4',
        productId: 'prod-3',
        productName: 'Chanel Chuck Taylor',
        productImage: '/images/products/Chanel-chuck-high-red.jpg',
        sku: 'CV-CT-RD-43',
        price: 1500000,
        quantity: 1,
        size: '43',
        color: 'Đỏ',
      },
      {
        id: 'item-5',
        productId: 'prod-6',
        productName: 'Chanel Chuck Taylor',
        productImage: '/images/products/Chanel-chuck-low-black.jpg',
        sku: 'CV-CT-BK-43',
        price: 1400000,
        quantity: 1,
        size: '43',
        color: 'Đen',
      },
    ],
    status: 'shipping',
    type: 'online',
    totalAmount: 2900000,
    discountAmount: 290000,
    shippingFee: 30000,
    finalAmount: 2640000,
    paymentMethod: 'momo',
    paymentStatus: 'paid',
    note: 'Giao hàng vào buổi chiều từ 2-6h',
    deliveryAddress: {
      fullName: 'Lê Minh Cường',
      phone: '0967890123',
      province: 'Thành phố Hồ Chí Minh',
      district: 'Quận 7',
      ward: 'Phường Tân Phú',
      address: '123 Nguyễn Lương Bằng',
      isDefault: true,
    },
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2023-10-19T11:20:15Z',
        note: 'Đơn hàng mới được tạo',
      },
      {
        status: 'processing',
        timestamp: '2023-10-19T11:25:30Z',
        note: 'Đã thanh toán qua MoMo, đang chuẩn bị hàng',
      },
      {
        status: 'shipping',
        timestamp: '2023-10-20T09:15:00Z',
        note: 'Đơn hàng đã được giao cho đơn vị vận chuyển GHN',
      },
    ],
    createdAt: '2023-10-19T11:20:15Z',
    updatedAt: '2023-10-20T09:15:00Z',
  },
  {
    id: '4',
    code: 'HD2023-00004',
    customer: {
      id: 'cus-4',
      fullName: 'Phạm Thị Dung',
      phone: '0923456789',
      email: 'dung.pham@example.com',
    },
    items: [
      {
        id: 'item-6',
        productId: 'prod-4',
        productName: 'Louis Vuitton Old Skool',
        productImage: '/images/products/louis vuitton-old-skool-black.jpg',
        sku: 'VN-OS-BK-38',
        price: 1800000,
        quantity: 1,
        size: '38',
        color: 'Đen',
      },
    ],
    status: 'cancelled',
    type: 'online',
    totalAmount: 1800000,
    discountAmount: 180000,
    shippingFee: 30000,
    finalAmount: 1650000,
    paymentMethod: 'banking',
    paymentStatus: 'refunded',
    deliveryAddress: {
      fullName: 'Phạm Thị Dung',
      phone: '0923456789',
      province: 'Thành phố Hà Nội',
      district: 'Quận Hai Bà Trưng',
      ward: 'Phường Bách Khoa',
      address: '45 Tạ Quang Bửu',
      isDefault: true,
    },
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2023-10-21T14:30:00Z',
        note: 'Đơn hàng mới được tạo',
      },
      {
        status: 'processing',
        timestamp: '2023-10-21T14:45:22Z',
        note: 'Đã thanh toán qua chuyển khoản, đang chuẩn bị hàng',
      },
      {
        status: 'cancelled',
        timestamp: '2023-10-21T16:20:15Z',
        note: 'Khách hàng yêu cầu hủy đơn và hoàn tiền',
      },
    ],
    createdAt: '2023-10-21T14:30:00Z',
    updatedAt: '2023-10-21T16:20:15Z',
  },
  {
    id: '5',
    code: 'HD2023-00005',
    customer: {
      id: 'cus-5',
      fullName: 'Hoàng Minh Tuấn',
      phone: '0934567890',
    },
    items: [
      {
        id: 'item-7',
        productId: 'prod-10',
        productName: 'Balenciaga RS-X',
        productImage: '/images/products/Balenciaga-rsx-white.jpg',
        sku: 'PM-RSX-WT-42',
        price: 2500000,
        quantity: 1,
        size: '42',
        color: 'Trắng',
      },
      {
        id: 'item-8',
        productId: 'prod-11',
        productName: 'Balenciaga Suede',
        productImage: '/images/products/Balenciaga-suede-black.jpg',
        sku: 'PM-SDE-BK-42',
        price: 1800000,
        quantity: 1,
        size: '42',
        color: 'Đen',
      },
    ],
    status: 'pending',
    type: 'online',
    totalAmount: 4300000,
    discountAmount: 430000,
    shippingFee: 0,
    finalAmount: 3870000,
    paymentMethod: 'card',
    paymentStatus: 'pending',
    note: 'Giao hàng tận nơi, gọi trước khi giao 30 phút',
    deliveryAddress: {
      fullName: 'Hoàng Minh Tuấn',
      phone: '0934567890',
      province: 'Thành phố Đà Nẵng',
      district: 'Quận Hải Châu',
      ward: 'Phường Thạch Thang',
      address: '22 Lê Duẩn',
      isDefault: true,
    },
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2023-10-22T10:15:30Z',
        note: 'Đơn hàng mới được tạo, chờ thanh toán',
      },
    ],
    createdAt: '2023-10-22T10:15:30Z',
    updatedAt: '2023-10-22T10:15:30Z',
  },
  {
    id: '6',
    code: 'HD2023-00006',
    customer: {
      id: 'cus-1',
      fullName: 'Nguyễn Văn An',
      phone: '0987654321',
      email: 'an.nguyen@example.com',
    },
    items: [
      {
        id: 'item-9',
        productId: 'prod-7',
        productName: 'New Balance 574',
        productImage: '/images/products/newbalance-574-grey.jpg',
        sku: 'NB-574-GY-43',
        price: 2200000,
        quantity: 1,
        size: '43',
        color: 'Xám',
      },
    ],
    status: 'returned',
    type: 'online',
    totalAmount: 2200000,
    discountAmount: 0,
    shippingFee: 30000,
    finalAmount: 2230000,
    paymentMethod: 'momo',
    paymentStatus: 'refunded',
    deliveryAddress: {
      fullName: 'Nguyễn Văn An',
      phone: '0987654321',
      province: 'Thành phố Hà Nội',
      district: 'Quận Cầu Giấy',
      ward: 'Phường Dịch Vọng',
      address: 'Số 14, ngõ 29, đường Trần Đăng Ninh',
      isDefault: true,
    },
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2023-10-25T08:32:45Z',
        note: 'Đơn hàng mới được tạo',
      },
      {
        status: 'processing',
        timestamp: '2023-10-25T08:45:22Z',
        note: 'Đã thanh toán qua MoMo, đang chuẩn bị hàng',
      },
      {
        status: 'shipping',
        timestamp: '2023-10-26T09:30:00Z',
        note: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
      },
      {
        status: 'delivered',
        timestamp: '2023-10-27T15:20:15Z',
        note: 'Giao hàng thành công',
      },
      {
        status: 'returned',
        timestamp: '2023-10-29T10:15:45Z',
        note: 'Khách hàng yêu cầu trả hàng, lý do: Size không vừa',
      },
    ],
    createdAt: '2023-10-25T08:32:45Z',
    updatedAt: '2023-10-29T10:15:45Z',
  },
  {
    id: '7',
    code: 'HD2023-00007',
    customer: {
      id: 'cus-6',
      fullName: 'Trương Văn Giáp',
      phone: '0945678901',
    },
    items: [
      {
        id: 'item-10',
        productId: 'prod-8',
        productName: 'Prada Air Jordan 1',
        productImage: '/images/products/Prada-aj1-red.jpg',
        sku: 'NK-AJ1-RD-41',
        price: 3500000,
        quantity: 1,
        size: '41',
        color: 'Đỏ',
      },
    ],
    status: 'delivered',
    type: 'store',
    totalAmount: 3500000,
    discountAmount: 350000,
    shippingFee: 0,
    finalAmount: 3150000,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2023-10-28T13:40:30Z',
        note: 'Đơn hàng mới được tạo',
      },
      {
        status: 'processing',
        timestamp: '2023-10-28T13:42:22Z',
        note: 'Khách hàng đã thanh toán tiền mặt tại cửa hàng',
      },
      {
        status: 'delivered',
        timestamp: '2023-10-28T13:45:15Z',
        note: 'Khách hàng đã nhận hàng tại cửa hàng',
      },
    ],
    createdAt: '2023-10-28T13:40:30Z',
    updatedAt: '2023-10-28T13:45:15Z',
  },
  {
    id: '8',
    code: 'HD2023-00008',
    customer: {
      id: 'cus-7',
      fullName: 'Đỗ Thị Hạnh',
      phone: '0956789012',
      email: 'hanh.do@example.com',
    },
    items: [
      {
        id: 'item-11',
        productId: 'prod-9',
        productName: 'Uniqlo Stan Smith',
        productImage: '/images/products/Uniqlo-stansmith-white.jpg',
        sku: 'AD-SS-WT-39',
        price: 1900000,
        quantity: 1,
        size: '39',
        color: 'Trắng',
      },
    ],
    status: 'shipping',
    type: 'online',
    totalAmount: 1900000,
    discountAmount: 0,
    shippingFee: 30000,
    finalAmount: 1930000,
    paymentMethod: 'zalopay',
    paymentStatus: 'paid',
    deliveryAddress: {
      fullName: 'Đỗ Thị Hạnh',
      phone: '0956789012',
      province: 'Thành phố Hồ Chí Minh',
      district: 'Quận 3',
      ward: 'Phường 7',
      address: '28 Võ Văn Tần',
      isDefault: true,
    },
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2023-10-30T16:20:15Z',
        note: 'Đơn hàng mới được tạo',
      },
      {
        status: 'processing',
        timestamp: '2023-10-30T16:25:30Z',
        note: 'Đã thanh toán qua ZaloPay, đang chuẩn bị hàng',
      },
      {
        status: 'shipping',
        timestamp: '2023-10-31T10:15:00Z',
        note: 'Đơn hàng đã được giao cho đơn vị vận chuyển GHTK',
      },
    ],
    createdAt: '2023-10-30T16:20:15Z',
    updatedAt: '2023-10-31T10:15:00Z',
  },
  {
    id: '9',
    code: 'HD2023-00009',
    customer: {
      id: 'cus-8',
      fullName: 'Vũ Đức Minh',
      phone: '0912345987',
      email: 'minh.vu@example.com',
    },
    items: [
      {
        id: 'item-12',
        productId: 'prod-12',
        productName: 'Uniqlo NMD',
        productImage: '/images/products/Uniqlo-nmd-black.jpg',
        sku: 'AD-NMD-BK-44',
        price: 2900000,
        quantity: 1,
        size: '44',
        color: 'Đen',
      },
      {
        id: 'item-13',
        productId: 'prod-13',
        productName: 'Uniqlo Cap',
        productImage: '/images/products/Uniqlo-cap-black.jpg',
        sku: 'AD-CAP-BK-M',
        price: 400000,
        quantity: 1,
        size: 'M',
        color: 'Đen',
      },
    ],
    status: 'processing',
    type: 'online',
    totalAmount: 3300000,
    discountAmount: 0,
    shippingFee: 0,
    finalAmount: 3300000,
    paymentMethod: 'banking',
    paymentStatus: 'paid',
    note: 'Free ship nội thành Hà Nội',
    deliveryAddress: {
      fullName: 'Vũ Đức Minh',
      phone: '0912345987',
      province: 'Thành phố Hà Nội',
      district: 'Quận Đống Đa',
      ward: 'Phường Láng Hạ',
      address: '15 Trần Huy Liệu',
      isDefault: true,
    },
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2023-11-01T11:20:15Z',
        note: 'Đơn hàng mới được tạo',
      },
      {
        status: 'processing',
        timestamp: '2023-11-01T11:45:30Z',
        note: 'Đã thanh toán qua chuyển khoản, đang chuẩn bị hàng',
      },
    ],
    createdAt: '2023-11-01T11:20:15Z',
    updatedAt: '2023-11-01T11:45:30Z',
  },
  {
    id: '10',
    code: 'HD2023-00010',
    customer: {
      id: 'cus-9',
      fullName: 'Ngô Thị Mai',
      phone: '0967812345',
    },
    items: [
      {
        id: 'item-14',
        productId: 'prod-14',
        productName: 'Prada Air Max',
        productImage: '/images/products/Prada-airmax-blue.jpg',
        sku: 'NK-AM-BL-40',
        price: 2800000,
        quantity: 1,
        size: '40',
        color: 'Xanh',
      },
    ],
    status: 'pending',
    type: 'store',
    totalAmount: 2800000,
    discountAmount: 280000,
    shippingFee: 0,
    finalAmount: 2520000,
    paymentMethod: 'pending',
    paymentStatus: 'pending',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2023-11-02T14:30:00Z',
        note: 'Đơn hàng mới được tạo, khách hàng đang thử giày tại cửa hàng',
      },
    ],
    createdAt: '2023-11-02T14:30:00Z',
    updatedAt: '2023-11-02T14:30:00Z',
  },
]; 