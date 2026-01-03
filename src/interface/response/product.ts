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
  _id: string;
  id: number;
  stock: number;
  color: string;
  size: string;
  price: number;
  images: string[];
}

export interface IProduct {
  id: number;
  gender: string;
  masterCategory: string;
  subCategory: string;
  articleType: string;
  baseColour: string;
  season: string;
  year: number;
  usage: string;
  productDisplayName: string;
  images: string[];
  rating: number;
  sale: number;
  reviews: any[];
  variants: IPopulatedProductVariant[];
  created_at: string;
  updated_at: string;
  brand?: string | IBrand;
  category?: string | ICategory;
  material?: string | IMaterial;
  name?: string;
  code?: string;
  weight?: number;
  description?: string;
  isNew?: boolean;
}

export interface IProductResponse {
  status: string;
  message: string;
  data: {
    product: IProduct;
    variants?: IPopulatedProductVariant[]; // Optional if variants are separate
  };
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