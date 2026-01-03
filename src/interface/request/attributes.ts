// Brand interfaces
export interface IBrandFilter {
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface IBrandCreate {
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface IBrandUpdate {
  name?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Category interfaces
export interface ICategoryFilter {
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ICategoryCreate {
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ICategoryUpdate {
  name?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Material interfaces
export interface IMaterialFilter {
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface IMaterialCreate {
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface IMaterialUpdate {
  name?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Color interfaces
export interface IColorFilter {
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface IColorCreate {
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface IColorUpdate {
  name?: string;
  code?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Size interfaces
export interface ISizeFilter {
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ISizeCreate {
  value: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ISizeUpdate {
  value?: number;
  status?: 'ACTIVE' | 'INACTIVE';
} 