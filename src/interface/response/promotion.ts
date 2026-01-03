export interface IPromotionProduct {
  id: string;
  name: string;
  code: string;
  price: number;
  images?: string[];
}

export interface IPromotion {
  id: string;
  name: string;
  description?: string;
  discountValue: string | number;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  applyTo: 'ALL_PRODUCTS' | 'SPECIFIC_PRODUCTS' | string;
  startDate: string;
  endDate: string;
  productIds: string[];
  status: 'ACTIVE' | 'INACTIVE' | string;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
  products?: IPromotionProduct[] | string[];
}

export interface IPromotionResponse {
  status: string;
  message: string;
  data: IPromotion;
}

export interface IPromotionsResponse {
  status: string;
  message: string;
  data: {
    promotions: IPromotion[];
    page: number;
    pages: number;
    perPage: number;
    count: number;
    pagination?: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface IProductPromotionsResponse {
  status: string;
  message: string;
  data: Pick<IPromotion, 'id' | 'name' | 'discountValue' | 'discountType' | 'startDate' | 'endDate'>[];
}

export interface IActionResponse {
  status: string;
  message: string;
  data?: any;
} 