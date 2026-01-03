// ====== Import các interface cho Request ====== //
import {
  IPaymentFilter,           // Bộ lọc thanh toán (lọc theo trạng thái, ngày,...)
  IPaymentCreate,           // Dữ liệu tạo thanh toán mới
  IPaymentStatusUpdate      // Dữ liệu cập nhật trạng thái thanh toán
} from "@/interface/request/payment";

// ====== Import các interface cho Response ====== //
import {
  IPaymentsResponse,        // Response danh sách thanh toán
  IPaymentResponse,         // Response chi tiết thanh toán
  IActionResponse           // Response cho các hành động như xóa, cập nhật
} from "@/interface/response/payment";

// ====== Import các hàm gửi HTTP request ====== //
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// === Admin/Staff Payment API ===

// Lấy tất cả thanh toán (admin hoặc nhân viên), có thể lọc theo trạng thái, đơn hàng,...
export const getAllPayments = async (params: IPaymentFilter): Promise<IPaymentsResponse> => {
  const res = await sendGet("/payments", params); // Gửi GET đến /payments với query params
  return res as IPaymentsResponse;
};

// Lấy chi tiết thanh toán theo ID
export const getPaymentById = async (paymentId: string): Promise<IPaymentResponse> => {
  const res = await sendGet(`/payments/${paymentId}`); // Gửi GET đến /payments/:id
  return res as IPaymentResponse;
};

// Tạo thanh toán mới
export const createPayment = async (payload: IPaymentCreate): Promise<IPaymentResponse> => {
  const res = await sendPost("/payments", payload); // Gửi POST để tạo thanh toán mới
  return res as IPaymentResponse;
};

// Cập nhật trạng thái thanh toán (ví dụ: Đã thanh toán, Chờ xử lý,...)
export const updatePaymentStatus = async (
  paymentId: string,
  payload: IPaymentStatusUpdate
): Promise<IPaymentResponse> => {
  const res = await sendPut(`/payments/${paymentId}`, payload); // Gửi PUT để cập nhật
  return res as IPaymentResponse;
};

// Xóa thanh toán theo ID
export const deletePayment = async (paymentId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/payments/${paymentId}`); // Gửi DELETE đến /payments/:id
  return res as IActionResponse;
};

// === Order Payments API ===

// Lấy danh sách thanh toán của một đơn hàng cụ thể
export const getPaymentsByOrderId = async (orderId: string): Promise<IPaymentsResponse> => {
  const res = await sendGet(`/orders/${orderId}/payments`); // Gửi GET đến /orders/:id/payments
  return res as IPaymentsResponse;
};
