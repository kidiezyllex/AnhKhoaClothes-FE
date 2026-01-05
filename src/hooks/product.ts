import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFilterOptions,
  getProductById,
  searchProducts,
  updateProduct,
  updateProductImages,
  updateProductStatus,
  updateProductStock,
} from "@/api/product";
import {
  IProductCreate,
  IProductFilter,
  IProductImageUpdate,
  IProductSearchParams,
  IProductStatusUpdate,
  IProductStockUpdate,
  IProductUpdate,
} from "@/interface/request/product";
import {
  IActionResponse,
  IFilterOptionsResponse,
  IProductResponse,
  IProductsResponse,
} from "@/interface/response/product";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { useCategories, useColors, useSizes } from "./options";

export const useProducts = (
  params: IProductFilter = {}
): UseQueryResult<IProductsResponse, Error> => {
  return useQuery<IProductsResponse, Error>({
    queryKey: ["products", params],
    queryFn: () => getAllProducts(params),
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
  });
};

export const useProductDetail = (
  productId: string
): UseQueryResult<IProductResponse, Error> => {
  return useQuery<IProductResponse, Error>({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
  });
};

export const useCreateProduct = (): UseMutationResult<
  IProductResponse,
  Error,
  IProductCreate
> => {
  return useMutation<IProductResponse, Error, IProductCreate>({
    mutationFn: (payload) => createProduct(payload),
  });
};

export const useUpdateProduct = (): UseMutationResult<
  IProductResponse,
  Error,
  { productId: string; payload: IProductUpdate }
> => {
  return useMutation<
    IProductResponse,
    Error,
    { productId: string; payload: IProductUpdate }
  >({
    mutationFn: ({ productId, payload }) => updateProduct(productId, payload),
  });
};

export const useUpdateProductStatus = (): UseMutationResult<
  IProductResponse,
  Error,
  { productId: string; payload: IProductStatusUpdate }
> => {
  return useMutation<
    IProductResponse,
    Error,
    { productId: string; payload: IProductStatusUpdate }
  >({
    mutationFn: ({ productId, payload }) =>
      updateProductStatus(productId, payload),
  });
};

export const useUpdateProductStock = (): UseMutationResult<
  IProductResponse,
  Error,
  { productId: string; payload: IProductStockUpdate }
> => {
  return useMutation<
    IProductResponse,
    Error,
    { productId: string; payload: IProductStockUpdate }
  >({
    mutationFn: ({ productId, payload }) =>
      updateProductStock(productId, payload),
  });
};

export const useUpdateProductImages = (): UseMutationResult<
  IProductResponse,
  Error,
  { productId: string; payload: IProductImageUpdate }
> => {
  return useMutation<
    IProductResponse,
    Error,
    { productId: string; payload: IProductImageUpdate }
  >({
    mutationFn: ({ productId, payload }) =>
      updateProductImages(productId, payload),
  });
};

export const useDeleteProduct = (): UseMutationResult<
  IActionResponse,
  Error,
  string
> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (productId) => deleteProduct(productId),
  });
};

export const useSearchProducts = (
  params: IProductSearchParams
): UseQueryResult<IProductsResponse, Error> => {
  return useQuery<IProductsResponse, Error>({
    queryKey: ["searchProducts", params],
    queryFn: () => searchProducts(params),
    enabled:
      !!params.keyword ||
      !!params.categories ||
      !!params.color ||
      !!params.size ||
      !!params.minPrice ||
      !!params.maxPrice,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
  });
};

// Hook để lấy filter options (articleTypes, genders, baseColours, seasons, usages)
export const useFilterOptions = (): UseQueryResult<
  IFilterOptionsResponse,
  Error
> => {
  return useQuery<IFilterOptionsResponse, Error>({
    queryKey: ["filterOptions"],
    queryFn: () => getFilterOptions(),
    staleTime: 300000, // 5 minutes - data ít thay đổi
    gcTime: 600000, // 10 minutes
  });
};

// Re-export hooks from options.ts
export { useCategories, useColors, useSizes };
