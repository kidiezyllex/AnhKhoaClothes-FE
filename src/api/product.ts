// ====== Import các interface cho Request ====== //
import {
  IProductFilter,             // Bộ lọc sản phẩm (cho admin/staff)
  IProductCreate,             // Dữ liệu tạo sản phẩm
  IProductUpdate,             // Dữ liệu cập nhật sản phẩm
  IProductStatusUpdate,       // Dữ liệu cập nhật trạng thái (hiện/ẩn)
  IProductStockUpdate,        // Dữ liệu cập nhật tồn kho
  IProductImageUpdate,        // Dữ liệu cập nhật ảnh sản phẩm
  IProductSearchParams        // Tham số tìm kiếm sản phẩm (cho khách)
} from "@/interface/request/product";

// ====== Import các interface cho Response ====== //
import {
  IProductsResponse,          // Response danh sách sản phẩm
  IProductResponse,           // Response chi tiết sản phẩm
  IActionResponse,            // Response cho hành động như xóa
  IProductFiltersResponse     // Response chứa các bộ lọc tìm kiếm (màu, size,...)
} from "@/interface/response/product";

// ====== Import các hàm gửi HTTP request ====== //
import { sendGet, sendPost, sendPut, sendPatch, sendDelete } from "./axios";

// Hàm phụ trợ: chuyển đổi các tham số có kiểu mảng thành chuỗi query string đúng định dạng
const convertParamsToQueryString = (params: any): any => {
  const formattedParams: any = {};

  for (const key in params) {
    if (params[key] !== undefined) {
      // Nếu là mảng thì nối thành chuỗi ngăn cách bằng dấu phẩy (`,`)
      if (Array.isArray(params[key])) {
        formattedParams[key] = params[key].join(',');
      } else {
        formattedParams[key] = params[key];
      }
    }
  }

  return formattedParams;
};

// === Admin/Staff Product API ===

// Lấy tất cả sản phẩm với bộ lọc (phân trang, danh mục, màu sắc,...)
export const getAllProducts = async (params: IProductFilter): Promise<IProductsResponse> => {
  const formattedParams = convertParamsToQueryString(params); // Định dạng lại query
  const res = await sendGet("/products", formattedParams); // Gửi GET đến /products
  return res as IProductsResponse;
};

// Lấy chi tiết một sản phẩm theo ID
export const getProductById = async (productId: string): Promise<IProductResponse> => {
  const res = await sendGet(`/products/${productId}`); // Gửi GET đến /products/:id
  return res as IProductResponse;
};

// Tạo sản phẩm mới
export const createProduct = async (payload: IProductCreate): Promise<IProductResponse> => {
  const res = await sendPost("/products", payload); // Gửi POST để tạo mới sản phẩm
  return res as IProductResponse;
};

// Cập nhật sản phẩm theo ID
export const updateProduct = async (
  productId: string,
  payload: IProductUpdate
): Promise<IProductResponse> => {
  const res = await sendPut(`/products/${productId}`, payload); // Gửi PUT đến /products/:id
  return res as IProductResponse;
};

// Cập nhật trạng thái hiển thị của sản phẩm (active/inactive)
export const updateProductStatus = async (
  productId: string,
  payload: IProductStatusUpdate
): Promise<IProductResponse> => {
  const res = await sendPatch(`/products/${productId}/status`, payload); // PATCH đến /products/:id/status
  return res as IProductResponse;
};

// Cập nhật tồn kho của sản phẩm
export const updateProductStock = async (
  productId: string,
  payload: IProductStockUpdate
): Promise<IProductResponse> => {
  const res = await sendPatch(`/products/${productId}/stock`, payload); // PATCH đến /products/:id/stock
  return res as IProductResponse;
};

// Cập nhật ảnh sản phẩm
export const updateProductImages = async (
  productId: string,
  payload: IProductImageUpdate
): Promise<IProductResponse> => {
  const res = await sendPatch(`/products/${productId}/images`, payload); // PATCH đến /products/:id/images
  return res as IProductResponse;
};

// Xóa sản phẩm theo ID
export const deleteProduct = async (productId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/products/${productId}`); // Gửi DELETE đến /products/:id
  return res as IActionResponse;
};

// === Public Product API (dành cho người dùng/khách hàng) ===

// Tìm kiếm sản phẩm với nhiều điều kiện (tên, danh mục, màu, size,...)
export const searchProducts = async (params: IProductSearchParams): Promise<IProductsResponse> => {
  const formattedParams = convertParamsToQueryString(params); // Format lại params
  const res = await sendGet("/products/search", formattedParams); // Gửi GET đến /products/search
  return res as IProductsResponse;
};

// Lấy tất cả bộ lọc sản phẩm (danh sách nhãn hiệu, màu, size, chất liệu,...)
export const getAllFilters = async (): Promise<IProductFiltersResponse> => {
  const res = await sendGet("/products/filters"); // Gửi GET đến /products/filters
  return res as IProductFiltersResponse;
};
