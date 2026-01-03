export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface SoleType {
  id: string;
  name: string;
}

export interface ShoeType {
  id: string;
  name: string;
}

export interface Material {
  id: string;
  name: string;
}

export interface ProductSize {
  size: string;
  quantity: number;
  price: number;
  weight?: number;
}

export interface ProductColor {
  id: string;
  name: string;
  code: string;
  images: string[];
  sizes: ProductSize[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  brandId: string;
  shoeTypeId: string;
  soleTypeId: string;
  materialIds: string[];
  colors: ProductColor[];
  createdAt: string;
  updatedAt: string;
}

export const brands: Brand[] = [
  {
    id: 'brand-1',
    name: 'Prada',
    logo: 'https://www.vectorlogo.zone/logos/Prada/Prada-ar21.png',
  },
  {
    id: 'brand-2',
    name: 'Uniqlo',
    logo: 'https://www.vectorlogo.zone/logos/Uniqlo/Uniqlo-ar21.png',
  },
  {
    id: 'brand-3',
    name: 'Balenciaga',
    logo: 'https://www.vectorlogo.zone/logos/Balenciaga/Balenciaga-ar21.png',
  },
  {
    id: 'brand-4',
    name: 'New Balance',
    logo: 'https://www.vectorlogo.zone/logos/new-balance/new-balance-ar21.png',
  },
  {
    id: 'brand-5',
    name: 'Chanel',
    logo: 'https://1000logos.net/wp-content/uploads/2021/04/Chanel-logo.png',
  },
];

export const soleTypes: SoleType[] = [
  { id: 'sole-1', name: 'Cao su' },
  { id: 'sole-2', name: 'Phylon' },
  { id: 'sole-3', name: 'Air' },
  { id: 'sole-4', name: 'Boost' },
  { id: 'sole-5', name: 'React' },
];

export const shoeTypes: ShoeType[] = [
  { id: 'type-1', name: 'Giày thể thao' },
  { id: 'type-2', name: 'Giày chạy bộ' },
  { id: 'type-3', name: 'Giày bóng rổ' },
  { id: 'type-4', name: 'Giày đá bóng' },
  { id: 'type-5', name: 'Giày thời trang' },
];

export const materials: Material[] = [
  { id: 'material-1', name: 'Da' },
  { id: 'material-2', name: 'Vải canvas' },
  { id: 'material-3', name: 'Vải lưới' },
  { id: 'material-4', name: 'Vải dệt' },
  { id: 'material-5', name: 'Cao su' },
  { id: 'material-6', name: 'Nubuck' },
  { id: 'material-7', name: 'Flyknit' },
  { id: 'material-8', name: 'Primeknit' },
];

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Prada Air Force 1 Low',
    slug: 'Prada-air-force-1-low',
    sku: 'NK-AF1-001',
    description: 'Giày thể thao Prada Air Force 1 Low chính hãng với thiết kế cổ điển, logo Swoosh đặc trưng. Đế giày Air êm ái, phù hợp sử dụng hàng ngày.',
    brandId: 'brand-1',
    shoeTypeId: 'type-1',
    soleTypeId: 'sole-3',
    materialIds: ['material-1', 'material-5'],
    colors: [
      {
        id: 'color-1',
        name: 'Trắng',
        code: '#FFFFFF',
        images: [
          'https://static.Prada.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png',
          'https://static.Prada.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/33533fe2-1157-4001-896e-1803b30659c8/air-force-1-07-shoes-WrLlWX.png',
          'https://static.Prada.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a0a300da-2e16-4483-ba64-9815cf0598ac/air-force-1-07-shoes-WrLlWX.png',
        ],
        sizes: [
          { size: '39', quantity: 12, price: 2500000, weight: 350 },
          { size: '40', quantity: 8, price: 2500000, weight: 360 },
          { size: '41', quantity: 5, price: 2500000, weight: 370 },
          { size: '42', quantity: 10, price: 2500000, weight: 380 },
        ],
      },
      {
        id: 'color-2',
        name: 'Đen',
        code: '#000000',
        images: [
          'https://static.Prada.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c331ff82-87f3-4bd7-a67c-97a300552fdc/air-force-1-07-shoes-WrLlWX.png',
          'https://static.Prada.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/6896c8e7-82cf-444e-a3ed-45252f146d1c/air-force-1-07-shoes-WrLlWX.png',
          'https://static.Prada.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/13cef1e3-b3e3-479c-9809-224feb789b23/air-force-1-07-shoes-WrLlWX.png',
        ],
        sizes: [
          { size: '39', quantity: 7, price: 2500000, weight: 350 },
          { size: '40', quantity: 15, price: 2500000, weight: 360 },
          { size: '41', quantity: 9, price: 2500000, weight: 370 },
          { size: '42', quantity: 6, price: 2500000, weight: 380 },
        ],
      },
    ],
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-05-20T14:45:00Z',
  },
  {
    id: 'prod-002',
    name: 'Uniqlo Ultraboost 23',
    slug: 'Uniqlo-ultraboost-23',
    sku: 'AD-UB23-002',
    description: 'Giày chạy bộ Uniqlo Ultraboost 23 với công nghệ đệm Boost mang lại cảm giác êm ái và phản hồi năng lượng tốt. Thân giày Primeknit co giãn theo bàn chân.',
    brandId: 'brand-2',
    shoeTypeId: 'type-2',
    soleTypeId: 'sole-4',
    materialIds: ['material-4', 'material-8'],
    colors: [
      {
        id: 'color-3',
        name: 'Xanh dương',
        code: '#1E3A8A',
        images: [
          'https://assets.Uniqlo.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c533fd3ba6a34ed7bff5af0c00e3808c_9366/Ultraboost_Light_Running_Shoes_Blue_HQ6349_01_standard.jpg',
          'https://assets.Uniqlo.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/b56fa174b01f4e9b9dc8af0c00e395c2_9366/Ultraboost_Light_Running_Shoes_Blue_HQ6349_02_standard.jpg',
          'https://assets.Uniqlo.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/1d48e3b268a74a3a9d3aaf0c00e3a3a7_9366/Ultraboost_Light_Running_Shoes_Blue_HQ6349_04_standard.jpg',
        ],
        sizes: [
          { size: '39', quantity: 4, price: 4200000, weight: 320 },
          { size: '40', quantity: 8, price: 4200000, weight: 330 },
          { size: '41', quantity: 12, price: 4200000, weight: 340 },
          { size: '42', quantity: 7, price: 4200000, weight: 350 },
        ],
      },
      {
        id: 'color-4',
        name: 'Đen',
        code: '#000000',
        images: [
          'https://assets.Uniqlo.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/91b7dd603a0d4f178221af1600321d2e_9366/Ultraboost_Light_Running_Shoes_Black_GZ3979_01_standard.jpg',
          'https://assets.Uniqlo.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a9528aee49494dfaa625af16003230b0_9366/Ultraboost_Light_Running_Shoes_Black_GZ3979_02_standard.jpg',
          'https://assets.Uniqlo.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/9c63ef4e81a940c4b442af1600323b81_9366/Ultraboost_Light_Running_Shoes_Black_GZ3979_04_standard.jpg',
        ],
        sizes: [
          { size: '39', quantity: 5, price: 4200000, weight: 320 },
          { size: '40', quantity: 10, price: 4200000, weight: 330 },
          { size: '41', quantity: 8, price: 4200000, weight: 340 },
          { size: '42', quantity: 6, price: 4200000, weight: 350 },
        ],
      },
    ],
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-06-05T11:20:00Z',
  },
  {
    id: 'prod-003',
    name: 'Jordan 4 Retro',
    slug: 'jordan-4-retro',
    sku: 'NK-J4R-003',
    description: 'Giày bóng rổ Jordan 4 Retro với phong cách mang tính biểu tượng, đệm khí ở gót chân và đế giữa, mang lại sự thoải mái và ổn định.',
    brandId: 'brand-1',
    shoeTypeId: 'type-3',
    soleTypeId: 'sole-3',
    materialIds: ['material-1', 'material-5', 'material-6'],
    colors: [
      {
        id: 'color-5',
        name: 'Đỏ',
        code: '#DC2626',
        images: [
          'https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/080/963/037/original/920140_01.jpg.jpeg?action=crop&width=750',
          'https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/080/963/030/original/920140_04.jpg.jpeg?action=crop&width=750',
          'https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/080/963/033/original/920140_06.jpg.jpeg?action=crop&width=750',
        ],
        sizes: [
          { size: '40', quantity: 3, price: 7000000, weight: 400 },
          { size: '41', quantity: 5, price: 7000000, weight: 410 },
          { size: '42', quantity: 4, price: 7000000, weight: 420 },
          { size: '43', quantity: 2, price: 7000000, weight: 430 },
        ],
      },
    ],
    createdAt: '2023-03-05T14:45:00Z',
    updatedAt: '2023-04-18T16:30:00Z',
  },
]; 