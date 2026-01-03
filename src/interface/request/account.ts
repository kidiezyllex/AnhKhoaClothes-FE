export interface IAccountFilter {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IAccountCreate {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: 'CUSTOMER' | 'STAFF' | 'ADMIN';
  gender?: 'male' | 'female' | 'other';
  birthday?: string | Date;
  citizenId?: string;
}

export interface IAccountUpdate {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: boolean;
  birthday?: string | Date;
  citizenId?: string;
  avatar?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface IAccountStatusUpdate {
  status: 'ACTIVE' | 'INACTIVE';
}

export interface IAddress {
  id?: string;
  name: string;
  phoneNumber: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  specificAddress: string;
  type: "Nhà riêng" | "Văn phòng";
  isDefault: boolean;
}

export interface IAddressCreate {
  name: string;
  phoneNumber: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  specificAddress: string;
  type: "Nhà riêng" | "Văn phòng";
  isDefault: boolean;
}

export interface IAddressUpdate extends Partial<IAddressCreate> {}

export interface IProfileUpdate {
  fullName?: string;
  phoneNumber?: string;
  gender?: 'Nam' | 'Nữ' | 'Khác';
  birthday?: string | Date;
  avatar?: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
} 