export interface IProductFilter {
  page?: number;
  limit?: number;
  name?: string;
  category?: string;
  categories?: string[] | string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  articleType?: string;
  gender?: string;
  baseColour?: string;
  season?: string;
  usage?: string;
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
  category: string;
  description: string;
  weight: number;
  variants: IProductVariant[];
}

export interface IProductUpdate {
  name?: string;
  category?: string;
  description?: string;
  weight?: number;
  variants?: IProductVariant[];
  status?: "ACTIVE" | "INACTIVE";
}

export interface IProductStatusUpdate {
  status: "ACTIVE" | "INACTIVE";
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
  category?: string;
  categories?: string[] | string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  articleType?: string;
  gender?: string;
  baseColour?: string;
  season?: string;
  usage?: string;
}
