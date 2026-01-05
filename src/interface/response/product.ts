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
  stock: number;
  color: string; // Hex color code like "#000080"
  size: string; // Size code like "XL", "M", "S"
  price: number;
  images?: string[]; // Optional array of image URLs for this variant
}

export interface IProduct {
  id: number;
  gender?: string;
  masterCategory?: string;
  subCategory?: string;
  articleType?: string;
  baseColour?: string;
  season?: string;
  year?: number;
  usage?: string;
  productDisplayName?: string;
  images?: string[]; // Array of image URLs
  rating?: number;
  sale?: number;
  reviews?: any[];
  variants: IPopulatedProductVariant[];
  created_at?: string;
  updated_at?: string;
  category?: string | ICategory;
  name?: string;
  code?: string;
  weight?: number;
  description?: string;
  isNew?: boolean;
  status?: string;
  updatedAt?: string;
  createdAt?: string;
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
    // Direct pagination fields from API
    page?: number;
    pages?: number;
    perPage?: number;
    count?: number;
    // Alternative nested pagination object
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
    categories: ICategory[];
    colors: IColor[];
    sizes: ISize[];
    priceRange: IPriceRange;
  };
}

export interface IFilterOptionsResponse {
  success: boolean;
  message: string;
  data: {
    articleTypes: string[];
    genders: string[];
    baseColours: string[];
    seasons: string[];
    usages: string[];
  };
}
