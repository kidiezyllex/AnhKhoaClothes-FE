// ===== Import các interface yêu cầu từ phía client (request) ===== //
import {
  IStatisticsFilter,             // Bộ lọc thống kê tổng quan
  IRevenueReportFilter,          // Bộ lọc báo cáo doanh thu
  ITopProductsFilter,            // Bộ lọc sản phẩm bán chạy
  IGenerateDailyStatistics       // Dữ liệu tạo thống kê hàng ngày
} from "@/interface/request/statistics";

// ===== Import các interface phản hồi từ phía server (response) ===== //
import {
  IStatisticsResponse,           // Phản hồi thống kê tổng quan
  IStatisticsDetailResponse,     // Phản hồi chi tiết một bản thống kê
  IRevenueReportResponse,        // Phản hồi báo cáo doanh thu
  ITopProductsResponse,          // Phản hồi danh sách sản phẩm bán chạy
  IGenerateDailyResponse         // Phản hồi khi tạo thống kê hàng ngày
} from "@/interface/response/statistics";

// ===== Import các hàm gửi request HTTP (axios wrapper) ===== //
import { sendGet, sendPost } from "./axios";

// ===== API lấy thống kê tổng quan theo bộ lọc (ví dụ: theo tháng, quý, năm,...) ===== //
export const getStatistics = async (params: IStatisticsFilter = {}): Promise<IStatisticsResponse> => {
  const res = await sendGet("/statistics", params);         // Gửi GET đến /statistics với tham số lọc
  return res as IStatisticsResponse;                        // Ép kiểu dữ liệu trả về
};

// ===== API lấy chi tiết một bản thống kê cụ thể theo ID ===== //
export const getStatisticsById = async (statisticsId: string): Promise<IStatisticsDetailResponse> => {
  const res = await sendGet(`/statistics/${statisticsId}`); // Gửi GET đến /statistics/:id
  return res as IStatisticsDetailResponse;                  // Trả về chi tiết thống kê
};

// ===== API lấy báo cáo doanh thu theo thời gian (ngày, tháng, năm,...) ===== //
export const getRevenueReport = async (params: IRevenueReportFilter): Promise<IRevenueReportResponse> => {
  const res = await sendGet("/statistics/revenue", params); // Gửi GET đến /statistics/revenue
  return res as IRevenueReportResponse;                     // Trả về báo cáo doanh thu
};

// ===== API lấy danh sách các sản phẩm bán chạy nhất ===== //
export const getTopProducts = async (params: ITopProductsFilter): Promise<ITopProductsResponse> => {
  const res = await sendGet("/statistics/top-products", params); // Gửi GET đến /statistics/top-products
  return res as ITopProductsResponse;                             // Trả về danh sách sản phẩm bán chạy
};

// ===== API tạo thống kê hàng ngày (dữ liệu do hệ thống tổng hợp mỗi ngày) ===== //
export const generateDailyStatistics = async (
  payload: IGenerateDailyStatistics
): Promise<IGenerateDailyResponse> => {
  const res = await sendPost("/statistics/generate-daily", payload); // Gửi POST đến /statistics/generate-daily
  return res as IGenerateDailyResponse;                              // Trả về phản hồi kết quả
};
