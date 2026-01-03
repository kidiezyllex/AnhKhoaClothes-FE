export interface IProductFilter {
  page?: number;
  limit?: number;
  name?: string;
  brand?: string;
  brands?: string[] | string;
  category?: string;
  categories?: string[] | string;
  material?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
}

export interface IProductVariant {
  colorId: string;
  sizeId: string;
  price: number;
  stock?: number;
  images?: string[];
}

export interface IProductCreate {
  name: string;
  brand: string;
  category: string;
  material: string;
  description: string;
  weight: number;
  variants: IProductVariant[];
}

export interface IProductUpdate {
  name?: string;
  brand?: string;
  category?: string;
  material?: string;
  description?: string;
  weight?: number;
  variants?: IProductVariant[];
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface IProductStatusUpdate {
  status: 'ACTIVE' | 'INACTIVE';
}

export interface IVariantStockUpdate {
  variantId: string;
  stock: number;
}

export interface IProductStockUpdate {
  variantUpdates: IVariantStockUpdate[];
}

export interface IProductImageUpdate {
  variantId: string;
  images: string[];
}

export interface IProductSearchParams {
  keyword: string;
  brand?: string;
  brands?: string[] | string;
  category?: string;
  categories?: string[] | string;
  material?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
} 