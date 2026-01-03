// ===== Import các interface liên quan đến request ===== //
import {
  IReturnFilter,               // Bộ lọc trả hàng cho admin
  IReturnCreate,               // Dữ liệu tạo yêu cầu trả hàng
  IReturnUpdate,               // Dữ liệu cập nhật yêu cầu trả hàng
  IReturnStatusUpdate,         // Dữ liệu cập nhật trạng thái yêu cầu trả hàng
  IReturnSearchParams,         // Tham số tìm kiếm yêu cầu trả hàng
  IReturnStatsParams,          // Tham số thống kê trả hàng
  IReturnableOrdersParams,     // Tham số lấy danh sách đơn có thể trả hàng
  ICustomerReturnRequest,      // Dữ liệu khách hàng gửi yêu cầu trả hàng
  IMyReturnsParams             // Tham số lọc danh sách trả hàng của khách hàng
} from "@/interface/request/return";

// ===== Import các interface liên quan đến response ===== //
import {
  IReturnsResponse,             // Danh sách yêu cầu trả hàng
  IReturnResponse,              // Chi tiết một yêu cầu trả hàng
  IReturnSearchResponse,        // Kết quả tìm kiếm yêu cầu trả hàng
  IReturnStatsResponse,         // Kết quả thống kê trả hàng
  IActionResponse,              // Phản hồi từ hành động như xóa, huỷ
  IReturnableOrdersResponse     // Danh sách đơn hàng có thể trả
} from "@/interface/response/return";

// ===== Import các hàm gửi request HTTP ===== //
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// ======================== ADMIN RETURN API ======================== //

// Lấy tất cả yêu cầu trả hàng theo bộ lọc
export const getAllReturns = async (params: IReturnFilter): Promise<IReturnsResponse> => {
  const res = await sendGet("/returns", params);
  return res as IReturnsResponse;
};

// Lấy chi tiết yêu cầu trả hàng theo ID
export const getReturnById = async (returnId: string): Promise<IReturnResponse> => {
  const res = await sendGet(`/returns/${returnId}`);
  return res as IReturnResponse;
};

// Tạo yêu cầu trả hàng mới (dành cho admin)
export const createReturn = async (payload: IReturnCreate): Promise<IReturnResponse> => {
  const res = await sendPost("/returns", payload);
  return res as IReturnResponse;
};

// Cập nhật nội dung yêu cầu trả hàng (admin chỉnh sửa)
export const updateReturn = async (returnId: string, payload: IReturnUpdate): Promise<IReturnResponse> => {
  const res = await sendPut(`/returns/${returnId}`, payload);
  return res as IReturnResponse;
};

// Cập nhật trạng thái yêu cầu trả hàng (đang xử lý, hoàn thành, từ chối,...)
export const updateReturnStatus = async (returnId: string, payload: IReturnStatusUpdate): Promise<IReturnResponse> => {
  const res = await sendPut(`/returns/${returnId}/status`, payload);
  return res as IReturnResponse;
};

// Xóa yêu cầu trả hàng theo ID
export const deleteReturn = async (returnId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/returns/${returnId}`);
  return res as IActionResponse;
};

// Tìm kiếm yêu cầu trả hàng nâng cao (theo từ khóa, trạng thái,...)
export const searchReturn = async (params: IReturnSearchParams): Promise<IReturnSearchResponse> => {
  const res = await sendGet("/returns/search", params);
  return res as IReturnSearchResponse;
};

// Thống kê trả hàng (số lượng, trạng thái, thời gian,...)
export const getReturnStats = async (params: IReturnStatsParams): Promise<IReturnStatsResponse> => {
  const res = await sendGet("/returns/stats", params);
  return res as IReturnStatsResponse;
};

// ======================== CUSTOMER RETURN API ======================== //

// Lấy danh sách đơn hàng khách hàng có thể yêu cầu trả lại
export const getReturnableOrders = async (
  params: IReturnableOrdersParams = {}
): Promise<IReturnableOrdersResponse> => {
  const res = await sendGet("/returns/returnable-orders", params);
  return res as IReturnableOrdersResponse;
};

// Khách hàng gửi yêu cầu trả hàng
export const createReturnRequest = async (
  payload: ICustomerReturnRequest
): Promise<IReturnResponse> => {
  const res = await sendPost("/returns/request", payload);
  return res as IReturnResponse;
};

// Lấy danh sách các yêu cầu trả hàng đã gửi của người dùng
export const getMyReturns = async (
  params: IMyReturnsParams = {}
): Promise<IReturnsResponse> => {
  const res = await sendGet("/returns/my", params);
  return res as IReturnsResponse;
};

// Lấy chi tiết một yêu cầu trả hàng của người dùng
export const getMyReturnDetail = async (
  returnId: string
): Promise<IReturnResponse> => {
  const res = await sendGet(`/returns/my/${returnId}`);
  return res as IReturnResponse;
};

// Huỷ yêu cầu trả hàng của chính người dùng
export const cancelMyReturn = async (
  returnId: string
): Promise<IActionResponse> => {
  const res = await sendPut(`/returns/my/${returnId}/cancel`);
  return res as IActionResponse;
};
