// ====== Import các interface cho Request ====== //
import {
  IPromotionFilter,         // Bộ lọc khuyến mãi (lọc theo trạng thái, thời gian,...)
  IPromotionCreate,         // Dữ liệu tạo khuyến mãi
  IPromotionUpdate          // Dữ liệu cập nhật khuyến mãi
} from "@/interface/request/promotion";

// ====== Import các interface cho Response ====== //
import {
  IPromotionsResponse,          // Response danh sách khuyến mãi
  IPromotionResponse,           // Response chi tiết khuyến mãi
  IProductPromotionsResponse,   // Response khuyến mãi áp dụng cho một sản phẩm cụ thể
  IActionResponse               // Response cho các hành động như xóa
} from "@/interface/response/promotion";

// ====== Import các hàm gửi HTTP request ====== //
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// Lấy danh sách tất cả khuyến mãi (có thể lọc theo trạng thái, ngày,...)
export const getAllPromotions = async (params: IPromotionFilter): Promise<IPromotionsResponse> => {
  const res = await sendGet("/promotions", params); // Gửi GET đến /promotions với query params
  return res as IPromotionsResponse;
};

// Lấy thông tin chi tiết khuyến mãi theo ID
export const getPromotionById = async (promotionId: string): Promise<IPromotionResponse> => {
  const res = await sendGet(`/promotions/${promotionId}`); // Gửi GET đến /promotions/:id
  return res as IPromotionResponse;
};

// Tạo mới khuyến mãi
export const createPromotion = async (payload: IPromotionCreate): Promise<IPromotionResponse> => {
  const res = await sendPost("/promotions", payload); // Gửi POST đến /promotions với dữ liệu khuyến mãi
  return res as IPromotionResponse;
};

// Cập nhật khuyến mãi theo ID
export const updatePromotion = async (
  promotionId: string,
  payload: IPromotionUpdate
): Promise<IPromotionResponse> => {
  const res = await sendPut(`/promotions/${promotionId}`, payload); // Gửi PUT đến /promotions/:id
  return res as IPromotionResponse;
};

// Xóa khuyến mãi theo ID
export const deletePromotion = async (promotionId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/promotions/${promotionId}`); // Gửi DELETE đến /promotions/:id
  return res as IActionResponse;
};

// Lấy danh sách các khuyến mãi đang áp dụng cho một sản phẩm cụ thể
export const getProductPromotions = async (productId: string): Promise<IProductPromotionsResponse> => {
  const res = await sendGet(`/promotions/product/${productId}`); // Gửi GET đến /promotions/product/:productId
  return res as IProductPromotionsResponse;
};

// Lấy tất cả khuyến mãi đang hoạt động (active)
export const getActivePromotions = async (): Promise<IPromotionsResponse> => {
  const res = await sendGet("/promotions/active"); // Gửi GET đến /promotions/active
  return res as IPromotionsResponse;
};
