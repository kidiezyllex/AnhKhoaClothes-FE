// Common attribute properties
interface IAttributeBase {
  id: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// Brand interfaces
export interface IBrand extends IAttributeBase {
  name: string;
}

export interface IBrandResponse {
  success: boolean;
  message: string;
  data: IBrand;
}

export interface IBrandsResponse {
  success: boolean;
  message: string;
  data: IBrand[];
}

// Category interfaces
export interface ICategory extends IAttributeBase {
  name: string;
}

export interface ICategoryResponse {
  success: boolean;
  message: string;
  data: ICategory;
}

export interface ICategoriesResponse {
  status: string;
  message: string;
  data: {
    categories: string[] | ICategory[];
    count?: number;
  };
}

// Material interfaces
export interface IMaterial extends IAttributeBase {
  name: string;
}

export interface IMaterialResponse {
  success: boolean;
  message: string;
  data: IMaterial;
}

export interface IMaterialsResponse {
  success: boolean;
  message: string;
  data: IMaterial[];
}

// Color interfaces
export interface IColor {
  id: string;
  name: string;
  hex_code: string;
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface IColorResponse {
  status: string;
  message: string;
  data: IColor;
}

export interface IColorsResponse {
  status: string;
  message: string;
  data: {
    colors: IColor[];
    count: number;
  };
}

// Size interfaces
export interface ISize {
  id: string;
  name: string;
  code: string;
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface ISizeResponse {
  status: string;
  message: string;
  data: ISize;
}

export interface ISizesResponse {
  status: string;
  message: string;
  data: {
    sizes: ISize[];
    count: number;
  };
}

// Action response interface
export interface IActionResponse {
  success: boolean;
  message: string;
  data?: any;
} 