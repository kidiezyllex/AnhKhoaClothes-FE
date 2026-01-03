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
  success: boolean;
  message: string;
  data: ICategory[];
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
export interface IColor extends IAttributeBase {
  name: string;
  code: string;
}

export interface IColorResponse {
  success: boolean;
  message: string;
  data: IColor;
}

export interface IColorsResponse {
  success: boolean;
  message: string;
  data: IColor[];
}

// Size interfaces
export interface ISize extends IAttributeBase {
  value: number;
}

export interface ISizeResponse {
  success: boolean;
  message: string;
  data: ISize;
}

export interface ISizesResponse {
  success: boolean;
  message: string;
  data: ISize[];
}

// Action response interface
export interface IActionResponse {
  success: boolean;
  message: string;
  data?: any;
} 