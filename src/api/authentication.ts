// ===== Import các interface cho request (gửi lên server) ===== //
import {
  ISignIn,          // Interface cho đăng nhập
  IRegister         // Interface cho đăng ký
} from "@/interface/request/authentication";

// ===== Import các interface cho response (trả về từ server) ===== //
import {
  IAuthResponse,     // Kết quả trả về khi đăng nhập / đăng ký
  IProfileResponse   // Kết quả trả về khi lấy thông tin người dùng
} from "@/interface/response/authentication";

// ===== Import các hàm gọi HTTP đã xây dựng ===== //
import { sendGet, sendPost } from "./axios";

// ======= AUTH API ======= //

export const register = async (payload: IRegister): Promise<IAuthResponse> => {
  const res = await sendPost("/auth/register", payload); // Gửi POST đến endpoint đăng ký
  return res as IAuthResponse; // Ép kiểu kết quả trả về
};

export const login = async (payload: ISignIn): Promise<IAuthResponse> => {
  const res = await sendPost("/auth/login", payload); // Gửi POST đến endpoint đăng nhập
  return res as IAuthResponse;
};

export const logout = async (): Promise<{success: boolean; message: string}> => {
  const res = await sendPost("/auth/logout", {}); // Gửi POST đến endpoint đăng xuất
  return res;
};

export const getCurrentUser = async (): Promise<IProfileResponse> => {
  const res = await sendGet("/auth/me"); // Gửi GET đến endpoint lấy thông tin người dùng
  return res as IProfileResponse;
};

export const refreshToken = async (
  payload: { refreshToken: string }
): Promise<{ success: boolean; data: { token: string; refreshToken: string } }> => {
  const res = await sendPost("/auth/refresh-token", payload); // Gửi POST để làm mới token
  return res;
};
