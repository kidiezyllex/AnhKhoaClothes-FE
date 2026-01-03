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

/**
 * Đăng ký tài khoản mới
 * @param payload - Dữ liệu đăng ký tài khoản (email, password, v.v.)
 * @returns Dữ liệu xác thực chứa token và thông tin người dùng
 */
export const register = async (payload: IRegister): Promise<IAuthResponse> => {
  const res = await sendPost("/auth/register", payload); // Gửi POST đến endpoint đăng ký
  return res as IAuthResponse; // Ép kiểu kết quả trả về
};

/**
 * Đăng nhập hệ thống
 * @param payload - Dữ liệu đăng nhập (email và password)
 * @returns Dữ liệu xác thực chứa token và thông tin người dùng
 */
export const login = async (payload: ISignIn): Promise<IAuthResponse> => {
  const res = await sendPost("/auth/login", payload); // Gửi POST đến endpoint đăng nhập
  return res as IAuthResponse;
};

/**
 * Đăng xuất khỏi hệ thống
 * @returns Trả về success và message từ server
 */
export const logout = async (): Promise<{success: boolean; message: string}> => {
  const res = await sendPost("/auth/logout", {}); // Gửi POST đến endpoint đăng xuất
  return res;
};

/**
 * Lấy thông tin người dùng hiện tại (dựa vào access token)
 * @returns Thông tin hồ sơ người dùng hiện tại
 */
export const getCurrentUser = async (): Promise<IProfileResponse> => {
  const res = await sendGet("/auth/me"); // Gửi GET đến endpoint lấy thông tin người dùng
  return res as IProfileResponse;
};

/**
 * Làm mới token khi hết hạn access token
 * @param payload - Dữ liệu chứa refreshToken hiện tại
 * @returns Cặp token mới (access token và refresh token)
 */
export const refreshToken = async (
  payload: { refreshToken: string }
): Promise<{ success: boolean; data: { token: string; refreshToken: string } }> => {
  const res = await sendPost("/auth/refresh-token", payload); // Gửi POST để làm mới token
  return res;
};
