// ====== Import các interface dùng cho Request ====== //
import {
  IOrderFilter,              // Bộ lọc đơn hàng (lọc theo trạng thái, ngày,...)
  IOrderCreate,              // Dữ liệu tạo đơn hàng mới
  IOrderUpdate,              // Dữ liệu cập nhật đơn hàng
  IOrderStatusUpdate,        // Dữ liệu cập nhật trạng thái đơn hàng
  IPOSOrderCreateRequest     // Dữ liệu tạo đơn hàng tại điểm bán (POS)
} from "@/interface/request/order";

// ====== Import các interface dùng cho Response ====== //
import {
  IOrdersResponse,           // Response danh sách đơn hàng
  IOrderResponse,            // Response chi tiết đơn hàng
  IActionResponse,           // Response cho các hành động như xóa, cập nhật
  IPOSOrderCreateResponse    // Response khi tạo đơn hàng POS
} from "@/interface/response/order";

// ====== Import các hàm gửi request HTTP ====== //
import { sendGet, sendPost, sendPut, sendPatch, sendDelete } from "./axios";

// === Admin Order API ===

// Lấy tất cả đơn hàng (dành cho admin), có thể lọc theo trạng thái, thời gian,...
export const getAllOrders = async (params: IOrderFilter): Promise<IOrdersResponse> => {
  const res = await sendGet("/orders", params); // Gửi GET đến /orders với query params
  return res as IOrdersResponse;
};

// Lấy chi tiết đơn hàng theo ID
export const getOrderById = async (orderId: string): Promise<IOrderResponse> => {
  const res = await sendGet(`/orders/${orderId}`); // Gửi GET đến /orders/:id
  return res as IOrderResponse;
};

// Tạo một đơn hàng mới
export const createOrder = async (payload: IOrderCreate): Promise<IOrderResponse> => {
  const res = await sendPost("/orders", payload); // Gửi POST đến /orders với dữ liệu đơn hàng
  return res as IOrderResponse;
};

// Cập nhật đơn hàng (thông tin người nhận, ghi chú,...)
export const updateOrder = async (
  orderId: string,
  payload: IOrderUpdate
): Promise<IOrderResponse> => {
  const res = await sendPut(`/orders/${orderId}`, payload); // Gửi PUT đến /orders/:id
  return res as IOrderResponse;
};

// Cập nhật trạng thái đơn hàng (đang xử lý, đã giao,...)
export const updateOrderStatus = async (
  orderId: string,
  payload: IOrderStatusUpdate
): Promise<IOrderResponse> => {
  const res = await sendPatch(`/orders/${orderId}/status`, payload); // PATCH đến /orders/:id/status
  return res as IOrderResponse;
};

// Hủy đơn hàng
export const cancelOrder = async (orderId: string): Promise<IOrderResponse> => {
  const res = await sendPatch(`/orders/${orderId}/cancel`); // PATCH đến /orders/:id/cancel
  return res as IOrderResponse;
};

// Lấy danh sách đơn hàng của một người dùng cụ thể (customer)
export const getOrdersByUser = async (
  userId: string,
  params: { orderStatus?: string; page?: number; limit?: number } = {}
): Promise<IOrdersResponse> => {
  const res = await sendGet(`/orders/user/${userId}`, params); // Gửi GET đến /orders/user/:userId với params
  return res as IOrdersResponse;
};

// Tạo đơn hàng tại điểm bán (POS - point of sale)
export const createPOSOrder = async (
  payload: IPOSOrderCreateRequest
): Promise<IPOSOrderCreateResponse> => {
  const res = await sendPost("/orders/pos", payload); // Gửi POST đến /orders/pos với dữ liệu
  return res as IPOSOrderCreateResponse;
};
