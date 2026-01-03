// ===== Import các interface yêu cầu từ phía client ===== //
import {
  IVoucherFilter,        // Bộ lọc để tìm kiếm voucher
  IVoucherCreate,        // Interface để tạo mới voucher
  IVoucherUpdate,        // Interface để cập nhật voucher
  IVoucherValidate,      // Interface để kiểm tra tính hợp lệ của voucher
  IUserVoucherParams     // Tham số để lọc voucher theo người dùng
} from "@/interface/request/voucher";

// ===== Import các interface phản hồi từ server ===== //
import {
  IVouchersResponse,             // Danh sách voucher trả về
  IVoucherResponse,              // Một voucher đơn lẻ trả về
  IVoucherValidationResponse,    // Kết quả xác thực voucher
  INotificationResponse,         // Kết quả gửi thông báo
  IActionResponse                // Kết quả thực hiện một hành động
} from "@/interface/response/voucher";

// ===== Import các hàm gọi API sử dụng axios ===== //
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// ===== Admin Voucher API ===== //

/**
 * Lấy danh sách tất cả các voucher có thể áp dụng bộ lọc
 * @param params - IVoucherFilter
 * @returns IVouchersResponse
 */
export const getAllVouchers = async (params: IVoucherFilter): Promise<IVouchersResponse> => {
  const res = await sendGet("/vouchers", params);
  return res as IVouchersResponse;
};

/**
 * Lấy chi tiết một voucher theo ID
 * @param voucherId - string
 * @returns IVoucherResponse
 */
export const getVoucherById = async (voucherId: string): Promise<IVoucherResponse> => {
  const res = await sendGet(`/vouchers/${voucherId}`);
  return res as IVoucherResponse;
};

/**
 * Tạo một voucher mới
 * @param payload - IVoucherCreate
 * @returns IVoucherResponse
 */
export const createVoucher = async (payload: IVoucherCreate): Promise<IVoucherResponse> => {
  const res = await sendPost("/vouchers", payload);
  return res as IVoucherResponse;
};

/**
 * Cập nhật thông tin voucher theo ID
 * @param voucherId - string
 * @param payload - IVoucherUpdate
 * @returns IVoucherResponse
 */
export const updateVoucher = async (voucherId: string, payload: IVoucherUpdate): Promise<IVoucherResponse> => {
  const res = await sendPut(`/vouchers/${voucherId}`, payload);
  return res as IVoucherResponse;
};

/**
 * Xóa voucher theo ID
 * @param voucherId - string
 * @returns IActionResponse
 */
export const deleteVoucher = async (voucherId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/vouchers/${voucherId}`);
  return res as IActionResponse;
};

/**
 * Kiểm tra tính hợp lệ của mã giảm giá (voucher)
 * @param payload - IVoucherValidate
 * @returns IVoucherValidationResponse
 */
export const validateVoucher = async (payload: IVoucherValidate): Promise<IVoucherValidationResponse> => {
  const res = await sendPost("/vouchers/validate", payload);
  return res as IVoucherValidationResponse;
};

/**
 * Tăng số lần sử dụng của voucher (sau khi người dùng sử dụng)
 * @param voucherId - string
 * @returns IVoucherResponse
 */
export const incrementVoucherUsage = async (voucherId: string): Promise<IVoucherResponse> => {
  const res = await sendPut(`/vouchers/${voucherId}/increment-usage`, {});
  return res as IVoucherResponse;
};

/**
 * Gửi thông báo đến người dùng về voucher (ví dụ khi có khuyến mãi mới)
 * @param voucherId - string
 * @returns INotificationResponse
 */
export const notifyVoucher = async (voucherId: string): Promise<INotificationResponse> => {
  const res = await sendPost(`/vouchers/${voucherId}/notify`, {});
  return res as INotificationResponse;
};

// ===== User Voucher API ===== //

/**
 * Lấy danh sách voucher mà người dùng có thể sử dụng
 * @param userId - string
 * @param params - IUserVoucherParams (tùy chọn)
 * @returns IVouchersResponse
 */
export const getAvailableVouchersForUser = async (
  userId: string,
  params?: IUserVoucherParams
): Promise<IVouchersResponse> => {
  const res = await sendGet(`/vouchers/user/${userId}`, params);
  return res as IVouchersResponse;
};
