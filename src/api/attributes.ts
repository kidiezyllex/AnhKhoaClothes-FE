// ===== Import các interface dùng cho request ===== //
import {
  IBrandFilter, IBrandCreate, IBrandUpdate,
  ICategoryFilter, ICategoryCreate, ICategoryUpdate,
  IMaterialFilter, IMaterialCreate, IMaterialUpdate,
  IColorFilter, IColorCreate, IColorUpdate,
  ISizeFilter, ISizeCreate, ISizeUpdate
} from "@/interface/request/attributes";

// ===== Import các interface dùng cho response ===== //
import {
  IBrandResponse, IBrandsResponse,
  ICategoryResponse, ICategoriesResponse,
  IMaterialResponse, IMaterialsResponse,
  IColorResponse, IColorsResponse,
  ISizeResponse, ISizesResponse,
  IActionResponse
} from "@/interface/response/attributes";

// ===== Import các hàm gửi HTTP request ===== //
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// ======= Brand API ======= //

// Lấy danh sách thương hiệu, có thể lọc
export const getAllBrands = async (params: IBrandFilter = {}): Promise<IBrandsResponse> => {
  const res = await sendGet("/attributes/brands", params);
  return res as IBrandsResponse;
};

// Lấy thông tin một thương hiệu theo ID
export const getBrandById = async (brandId: string): Promise<IBrandResponse> => {
  const res = await sendGet(`/attributes/brands/${brandId}`);
  return res as IBrandResponse;
};

// Tạo mới thương hiệu
export const createBrand = async (payload: IBrandCreate): Promise<IBrandResponse> => {
  const res = await sendPost("/attributes/brands", payload);
  return res as IBrandResponse;
};

// Cập nhật thương hiệu theo ID
export const updateBrand = async (brandId: string, payload: IBrandUpdate): Promise<IBrandResponse> => {
  const res = await sendPut(`/attributes/brands/${brandId}`, payload);
  return res as IBrandResponse;
};

// Xóa thương hiệu theo ID
export const deleteBrand = async (brandId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/attributes/brands/${brandId}`);
  return res as IActionResponse;
};

// ======= Category API ======= //

// Lấy danh sách danh mục sản phẩm
export const getAllCategories = async (params: ICategoryFilter = {}): Promise<ICategoriesResponse> => {
  const res = await sendGet("/attributes/categories", params);
  return res as ICategoriesResponse;
};

// Lấy chi tiết danh mục theo ID
export const getCategoryById = async (categoryId: string): Promise<ICategoryResponse> => {
  const res = await sendGet(`/attributes/categories/${categoryId}`);
  return res as ICategoryResponse;
};

// Tạo danh mục mới
export const createCategory = async (payload: ICategoryCreate): Promise<ICategoryResponse> => {
  const res = await sendPost("/attributes/categories", payload);
  return res as ICategoryResponse;
};

// Cập nhật danh mục theo ID
export const updateCategory = async (categoryId: string, payload: ICategoryUpdate): Promise<ICategoryResponse> => {
  const res = await sendPut(`/attributes/categories/${categoryId}`, payload);
  return res as ICategoryResponse;
};

// Xóa danh mục theo ID
export const deleteCategory = async (categoryId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/attributes/categories/${categoryId}`);
  return res as IActionResponse;
};

// ======= Material API ======= //

// Lấy danh sách chất liệu sản phẩm
export const getAllMaterials = async (params: IMaterialFilter = {}): Promise<IMaterialsResponse> => {
  const res = await sendGet("/attributes/materials", params);
  return res as IMaterialsResponse;
};

// Lấy chi tiết chất liệu theo ID
export const getMaterialById = async (materialId: string): Promise<IMaterialResponse> => {
  const res = await sendGet(`/attributes/materials/${materialId}`);
  return res as IMaterialResponse;
};

// Tạo chất liệu mới
export const createMaterial = async (payload: IMaterialCreate): Promise<IMaterialResponse> => {
  const res = await sendPost("/attributes/materials", payload);
  return res as IMaterialResponse;
};

// Cập nhật chất liệu theo ID
export const updateMaterial = async (materialId: string, payload: IMaterialUpdate): Promise<IMaterialResponse> => {
  const res = await sendPut(`/attributes/materials/${materialId}`, payload);
  return res as IMaterialResponse;
};

// Xóa chất liệu theo ID
export const deleteMaterial = async (materialId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/attributes/materials/${materialId}`);
  return res as IActionResponse;
};

// ======= Color API ======= //

// Lấy danh sách màu sắc
export const getAllColors = async (params: IColorFilter = {}): Promise<IColorsResponse> => {
  const res = await sendGet("/attributes/colors", params);
  return res as IColorsResponse;
};

// Lấy chi tiết màu theo ID
export const getColorById = async (colorId: string): Promise<IColorResponse> => {
  const res = await sendGet(`/attributes/colors/${colorId}`);
  return res as IColorResponse;
};

// Tạo màu mới
export const createColor = async (payload: IColorCreate): Promise<IColorResponse> => {
  const res = await sendPost("/attributes/colors", payload);
  return res as IColorResponse;
};

// Cập nhật màu theo ID
export const updateColor = async (colorId: string, payload: IColorUpdate): Promise<IColorResponse> => {
  const res = await sendPut(`/attributes/colors/${colorId}`, payload);
  return res as IColorResponse;
};

// Xóa màu theo ID
export const deleteColor = async (colorId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/attributes/colors/${colorId}`);
  return res as IActionResponse;
};

// ======= Size API ======= //

// Lấy danh sách kích thước
export const getAllSizes = async (params: ISizeFilter = {}): Promise<ISizesResponse> => {
  const res = await sendGet("/attributes/sizes", params);
  return res as ISizesResponse;
};

// Lấy chi tiết kích thước theo ID
export const getSizeById = async (sizeId: string): Promise<ISizeResponse> => {
  const res = await sendGet(`/attributes/sizes/${sizeId}`);
  return res as ISizeResponse;
};

// Tạo kích thước mới
export const createSize = async (payload: ISizeCreate): Promise<ISizeResponse> => {
  const res = await sendPost("/attributes/sizes", payload);
  return res as ISizeResponse;
};

// Cập nhật kích thước theo ID
export const updateSize = async (sizeId: string, payload: ISizeUpdate): Promise<ISizeResponse> => {
  const res = await sendPut(`/attributes/sizes/${sizeId}`, payload);
  return res as ISizeResponse;
};

// Xóa kích thước theo ID
export const deleteSize = async (sizeId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/attributes/sizes/${sizeId}`);
  return res as IActionResponse;
};
