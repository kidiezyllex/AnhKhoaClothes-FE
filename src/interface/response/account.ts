import { IAddress } from '../request/account';

export interface IPreferencePriceRange {
  min: number;
  max: number;
}

export interface IUserPreferences {
  priceRange: IPreferencePriceRange;
  style: string;
  colorPreferences: string[];
  brandPreferences: string[];
}

export interface IInteraction {
  product_id: number;
  interaction_type: string;
  timestamp: string;
}

export interface IAccount {
  id: string;
  email: string;
  name: string;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  height: number | null;
  weight: number | null;
  gender: string;
  age: number;
  phoneNumber: string | null;
  citizenId: string | null;
  birthday: string | null;
  role: string | 'CUSTOMER' | 'STAFF' | 'ADMIN';
  preferences?: IUserPreferences;
  favorites?: any[];
  user_embedding?: number[];
  content_profile?: any;
  interaction_history?: IInteraction[];
  outfit_history?: any[];
  created_at: string;
  updated_at: string;
  // Compatibility fields (optional, to avoid immediate breakage if used)
  fullName?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  avatar?: string;
  addresses?: IAddress[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IProfileData {
  user: IAccount;
}

export interface IProfileResponse {
  status: string;
  message: string;
  data: IProfileData;
}

export interface IAccountResponse {
  status: string;
  message: string;
  data: {
    user: IAccount;
  };
}

export interface IPagination {
  count: number;
  totalPages: number;
  currentPage: number;
}

export interface IAccountsData {
  accounts: IAccount[];
  pagination: IPagination;
}

export interface IAccountsResponse {
  status: string;
  message: string;
  data: IAccountsData;
}

export interface IActionResponse {
  status: string;
  message: string;
  data?: any;
} 