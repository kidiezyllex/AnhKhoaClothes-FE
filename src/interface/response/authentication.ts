import { IAddress } from "../request/account"

export interface IBaseResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface ITokens {
  refresh: string;
  access: string;
}

export interface IUserData {
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
  role: string;
  isAdmin: boolean;
}

export interface IAuthData {
  tokens: ITokens;
  user: IUserData;
}

export interface IAuthResponse {
  status: string;
  message: string;
  data: IAuthData;
}

export interface IProfileData {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  role: string
  avatar: string
}

export interface IProfileResponse extends IBaseResponse<IProfileData> {}

