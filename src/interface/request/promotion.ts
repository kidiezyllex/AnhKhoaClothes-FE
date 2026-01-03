export interface IPromotionFilter {
  status?: 'ACTIVE' | 'INACTIVE' | string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface IPromotionCreate {
  name: string;
  description?: string;
  discountValue: string | number;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  applyTo: 'ALL_PRODUCTS' | 'SPECIFIC_PRODUCTS' | string;
  productIds?: string[];
  startDate: string | Date;
  endDate: string | Date;
  // Backward compatibility
  products?: string[];
}

export interface IPromotionUpdate {
  name?: string;
  description?: string;
  discountValue?: string | number;
  discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT';
  applyTo?: 'ALL_PRODUCTS' | 'SPECIFIC_PRODUCTS' | string;
  productIds?: string[];
  startDate?: string | Date;
  endDate?: string | Date;
  status?: 'ACTIVE' | 'INACTIVE' | string;
} 