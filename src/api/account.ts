// Nhập các interface liên quan đến request (tạo, cập nhật, lọc tài khoản, địa chỉ, profile, đổi mật khẩu)
import {
  IAccountFilter,
  IAccountCreate,
  IAccountUpdate,
  IAccountStatusUpdate,
  IAddressCreate,
  IAddressUpdate,
  IProfileUpdate,
  IChangePassword,
} from "@/interface/request/account";

// Nhập các interface liên quan đến response (kết quả trả về từ server)
import {
  IAccountsResponse,
  IAccountResponse,
  IProfileResponse,
  IActionResponse
} from "@/interface/response/account";

// Nhập các hàm gọi API đã xây dựng sẵn
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// === Admin Account API ===

// Lấy danh sách tài khoản với bộ lọc (cho Admin)
export const getAllAccounts = async (params: IAccountFilter): Promise<IAccountsResponse> => {
  const res = await sendGet("/accounts", params); // Gửi yêu cầu GET kèm tham số lọc
  return res as IAccountsResponse; // Ép kiểu kết quả trả về
};

// Lấy thông tin tài khoản theo ID
export const getAccountById = async (accountId: string): Promise<IAccountResponse> => {
  const res = await sendGet(`/accounts/${accountId}`);
  return res as IAccountResponse;
};

// Tạo tài khoản mới (dành cho Admin)
export const createAccount = async (payload: IAccountCreate): Promise<IAccountResponse> => {
  const res = await sendPost("/accounts/register", payload); // Gửi POST đến endpoint đăng ký
  return res as IAccountResponse;
};

// Cập nhật thông tin tài khoản theo ID
export const updateAccount = async (accountId: string, payload: IAccountUpdate): Promise<IAccountResponse> => {
  const res = await sendPut(`/accounts/${accountId}`, payload);
  return res as IAccountResponse;
};

// Cập nhật trạng thái tài khoản (active/inactive, khóa, v.v.)
export const updateAccountStatus = async (accountId: string, payload: IAccountStatusUpdate): Promise<IAccountResponse> => {
  const res = await sendPut(`/accounts/${accountId}/status`, payload);
  return res as IAccountResponse;
};

// Xóa tài khoản theo ID
export const deleteAccount = async (accountId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/accounts/${accountId}`);
  return res as IActionResponse;
};

// === User Profile API ===

// Lấy thông tin hồ sơ của người dùng hiện tại
export const getProfile = async (): Promise<IProfileResponse> => {
  const res = await sendGet("/accounts/profile");
  return res as IProfileResponse;
};

// Cập nhật thông tin hồ sơ cá nhân
export const updateProfile = async (payload: IProfileUpdate): Promise<IProfileResponse> => {
  const res = await sendPut("/accounts/profile", payload);
  return res as IProfileResponse;
};

// Đổi mật khẩu tài khoản
export const changePassword = async (payload: IChangePassword): Promise<IActionResponse> => {
  const res = await sendPut("/accounts/profile/password", payload);
  return res as IActionResponse;
};

// === Address API ===

// Thêm địa chỉ mới cho người dùng
export const addAddress = async (payload: IAddressCreate): Promise<IProfileResponse> => {
  const res = await sendPost("/accounts/profile/addresses", payload);
  return res as IProfileResponse;
};

// Cập nhật địa chỉ theo ID
export const updateAddress = async (addressId: string, payload: IAddressUpdate): Promise<IProfileResponse> => {
  const res = await sendPut(`/accounts/profile/addresses/${addressId}`, payload);
  return res as IProfileResponse;
};

// Xóa địa chỉ theo ID
export const deleteAddress = async (addressId: string): Promise<IProfileResponse> => {
  const res = await sendDelete(`/accounts/profile/addresses/${addressId}`);
  return res as IProfileResponse;
};
