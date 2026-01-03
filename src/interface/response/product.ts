import { IProductVariant } from "../request/product";

export interface IBrand {
  id: string;
  name: string;
}

export interface ICategory {
  id: string;
  name: string;
}

export interface IMaterial {
  id: string;
  name: string;
}

export interface IColor {
  id: string;
  name: string;
  code: string;
}

export interface ISize {
  id: string;
  name?: string;
  code?: string;
  value: number;
}

export interface IProductImage {
  id: number;
  imageUrl: string;
}

export interface IPopulatedProductVariant {
  id: string;
  colorId: string;
  sizeId: string;
  color: IColor;
  size: ISize;
  price: number;
  stock: number;
  images: IProductImage[];
}

export interface IProduct {
  id: string | number;
  code: string;
  name: string;
  brand: string | IBrand;
  category: string | ICategory;
  material: string | IMaterial;
  description: string;
  weight: number;
  variants: IPopulatedProductVariant[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  price: number;
  // New fields from API
  gender?: string;
  masterCategory?: string;
  subCategory?: string;
  articleType?: string;
  baseColour?: string;
  season?: string;
  year?: number;
  usage?: string;
  productDisplayName?: string;
  images?: string[];
  rating?: number;
  sale?: number;
  reviews?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface IProductResponse {
  status: string;
  message: string;
  data: IProduct;
}

export interface IProductsResponse {
  status: string;
  message: string;
  data: {
    products: IProduct[];
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

export interface IActionResponse {
  status: string;
  message: string;
  data?: any;
}

export interface IPriceRange {
  min: number;
  max: number;
}

export interface IProductFiltersResponse {
  status: string;
  message: string;
  data: {
    brands: IBrand[];
    categories: ICategory[];
    materials: IMaterial[];
    colors: IColor[];
    sizes: ISize[];
    priceRange: IPriceRange;
  };
} 