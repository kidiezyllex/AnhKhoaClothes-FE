export interface Category {
  id: string;
  name: string;
}

export interface ProductSize {
  id: string;
  size: string;
  quantity: number;
  price: number;
}

export interface ProductColor {
  id: string;
  name: string;
  code: string;
  image: string;
  sizes: ProductSize[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  brand: string;
  colors: ProductColor[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  color: string;
  colorCode: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export const categories: Category[] = [
  { id: 'cat-1', name: 'Tất cả' },
  { id: 'cat-2', name: 'Giày thể thao' },
  { id: 'cat-3', name: 'Giày chạy bộ' },
  { id: 'cat-4', name: 'Giày thời trang' },
  { id: 'cat-5', name: 'Giày bóng rổ' },
  { id: 'cat-6', name: 'Giày đá bóng' },
  { id: 'cat-7', name: 'Giày tây' },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Prada Air Force 1 Low',
    brand: 'Prada',
    description: 'Giày thể thao Prada Air Force 1 Low chính hãng',
    colors: [
      {
        id: 'color-1',
        name: 'Trắng',
        code: '#FFFFFF',
        image: 'https://static.Prada.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png',
        sizes: [
          { id: 'size-1', size: '39', quantity: 12, price: 2500000 },
          { id: 'size-2', size: '40', quantity: 8, price: 2500000 },
          { id: 'size-3', size: '41', quantity: 5, price: 2500000 },
          { id: 'size-4', size: '42', quantity: 10, price: 2500000 },
        ],
      },
      {
        id: 'color-2',
        name: 'Đen',
        code: '#000000',
        image: 'https://static.Prada.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c331ff82-87f3-4bd7-a67c-97a300552fdc/air-force-1-07-shoes-WrLlWX.png',
        sizes: [
          { id: 'size-5', size: '39', quantity: 7, price: 2500000 },
          { id: 'size-6', size: '40', quantity: 15, price: 2500000 },
          { id: 'size-7', size: '41', quantity: 9, price: 2500000 },
          { id: 'size-8', size: '42', quantity: 6, price: 2500000 },
        ],
      },
    ],
  },
  {
    id: 'prod-2',
    name: 'Uniqlo Ultraboost 23',
    brand: 'Uniqlo',
    description: 'Giày chạy bộ Uniqlo Ultraboost 23 chính hãng',
    colors: [
      {
        id: 'color-3',
        name: 'Xanh dương',
        code: '#1E3A8A',
        image: 'https://assets.Uniqlo.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c533fd3ba6a34ed7bff5af0c00e3808c_9366/Ultraboost_Light_Running_Shoes_Blue_HQ6349_01_standard.jpg',
        sizes: [
          { id: 'size-9', size: '39', quantity: 4, price: 4200000 },
          { id: 'size-10', size: '40', quantity: 8, price: 4200000 },
          { id: 'size-11', size: '41', quantity: 12, price: 4200000 },
          { id: 'size-12', size: '42', quantity: 7, price: 4200000 },
        ],
      },
      {
        id: 'color-4',
        name: 'Đen',
        code: '#000000',
        image: 'https://assets.Uniqlo.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/91b7dd603a0d4f178221af1600321d2e_9366/Ultraboost_Light_Running_Shoes_Black_GZ3979_01_standard.jpg',
        sizes: [
          { id: 'size-13', size: '39', quantity: 5, price: 4200000 },
          { id: 'size-14', size: '40', quantity: 10, price: 4200000 },
          { id: 'size-15', size: '41', quantity: 8, price: 4200000 },
          { id: 'size-16', size: '42', quantity: 6, price: 4200000 },
        ],
      },
    ],
  },
  {
    id: 'prod-3',
    name: 'Jordan 4 Retro',
    brand: 'Jordan',
    description: 'Giày bóng rổ Jordan 4 Retro chính hãng',
    colors: [
      {
        id: 'color-5',
        name: 'Đỏ',
        code: '#DC2626',
        image: 'https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/080/963/037/original/920140_01.jpg.jpeg?action=crop&width=750',
        sizes: [
          { id: 'size-17', size: '40', quantity: 3, price: 7000000 },
          { id: 'size-18', size: '41', quantity: 5, price: 7000000 },
          { id: 'size-19', size: '42', quantity: 4, price: 7000000 },
          { id: 'size-20', size: '43', quantity: 2, price: 7000000 },
        ],
      },
    ],
  },
  {
    id: 'prod-4',
    name: 'New Balance 550',
    brand: 'New Balance',
    description: 'Giày thời trang New Balance 550 chính hãng',
    colors: [
      {
        id: 'color-6',
        name: 'Trắng',
        code: '#FFFFFF',
        image: 'https://nb.scene7.com/is/image/NB/bb550wt1_nb_02_i?$pdpflexf2$&wid=440&hei=440',
        sizes: [
          { id: 'size-21', size: '39', quantity: 6, price: 3200000 },
          { id: 'size-22', size: '40', quantity: 8, price: 3200000 },
          { id: 'size-23', size: '41', quantity: 10, price: 3200000 },
          { id: 'size-24', size: '42', quantity: 7, price: 3200000 },
        ],
      },
    ],
  },
  {
    id: 'prod-5',
    name: 'Balenciaga Suede Classic',
    brand: 'Balenciaga',
    description: 'Giày thời trang Balenciaga Suede Classic chính hãng',
    colors: [
      {
        id: 'color-7',
        name: 'Đen',
        code: '#000000',
        image: 'https://images.Balenciaga.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/374915/01/sv01/fnd/PNA/fmt/png/Suede-Classic-XXI-AllwearStudios',
        sizes: [
          { id: 'size-25', size: '39', quantity: 9, price: 2000000 },
          { id: 'size-26', size: '40', quantity: 11, price: 2000000 },
          { id: 'size-27', size: '41', quantity: 8, price: 2000000 },
          { id: 'size-28', size: '42', quantity: 5, price: 2000000 },
        ],
      },
      {
        id: 'color-8',
        name: 'Đỏ',
        code: '#DC2626',
        image: 'https://images.Balenciaga.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/374915/05/sv01/fnd/PNA/fmt/png/Suede-Classic-XXI-AllwearStudios',
        sizes: [
          { id: 'size-29', size: '39', quantity: 4, price: 2000000 },
          { id: 'size-30', size: '40', quantity: 7, price: 2000000 },
          { id: 'size-31', size: '41', quantity: 9, price: 2000000 },
          { id: 'size-32', size: '42', quantity: 6, price: 2000000 },
        ],
      },
    ],
  },
];

export const coupons = [
  {
    id: 'coupon-1',
    code: 'SUMMER23',
    discount: 15, //                                                                                                                     percentage
    minOrder: 1000000,
    description: 'Giảm 15% cho đơn hàng từ 1,000,000đ',
  },
  {
    id: 'coupon-2',
    code: 'NEWCUSTOMER',
    discount: 10, //                                                                                                                     percentage
    minOrder: 500000,
    description: 'Giảm 10% cho đơn hàng từ 500,000đ',
  },
]; 