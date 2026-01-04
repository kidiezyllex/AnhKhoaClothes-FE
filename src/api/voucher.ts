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

export const getAllVouchers = async (params: IVoucherFilter): Promise<IVouchersResponse> => {
  const res = await sendGet("/vouchers", params);
  return res as IVouchersResponse;
};

export const getVoucherById = async (voucherId: string): Promise<IVoucherResponse> => {
  const res = await sendGet(`/vouchers/${voucherId}`);
  return res as IVoucherResponse;
};

export const createVoucher = async (payload: IVoucherCreate): Promise<IVoucherResponse> => {
  const res = await sendPost("/vouchers", payload);
  return res as IVoucherResponse;
};

export const updateVoucher = async (voucherId: string, payload: IVoucherUpdate): Promise<IVoucherResponse> => {
  const res = await sendPut(`/vouchers/${voucherId}`, payload);
  return res as IVoucherResponse;
};

export const deleteVoucher = async (voucherId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/vouchers/${voucherId}`);
  return res as IActionResponse;
};

export const validateVoucher = async (payload: IVoucherValidate): Promise<IVoucherValidationResponse> => {
  const res = await sendPost("/vouchers/validate", payload);
  return res as IVoucherValidationResponse;
};

export const incrementVoucherUsage = async (voucherId: string): Promise<IVoucherResponse> => {
  const res = await sendPut(`/vouchers/${voucherId}/increment-usage`, {});
  return res as IVoucherResponse;
};

export const notifyVoucher = async (voucherId: string): Promise<INotificationResponse> => {
  const res = await sendPost(`/vouchers/${voucherId}/notify`, {});
  return res as INotificationResponse;
};

// ===== User Voucher API ===== //
export const getAvailableVouchersForUser = async (
  userId: string,
  params?: IUserVoucherParams
): Promise<IVouchersResponse> => {
  const res = await sendGet(`/vouchers/user/${userId}`, params);
  return res as IVouchersResponse;
};
