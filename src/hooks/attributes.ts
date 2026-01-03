import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";

import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getAllColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
  getAllSizes,
  getSizeById,
  createSize,
  updateSize,
  deleteSize
} from "@/api/attributes";

import {
  IBrandFilter, IBrandCreate, IBrandUpdate,
  ICategoryFilter, ICategoryCreate, ICategoryUpdate,
  IMaterialFilter, IMaterialCreate, IMaterialUpdate,
  IColorFilter, IColorCreate, IColorUpdate,
  ISizeFilter, ISizeCreate, ISizeUpdate
} from "@/interface/request/attributes";

import {
  IBrandResponse, IBrandsResponse,
  ICategoryResponse, ICategoriesResponse,
  IMaterialResponse, IMaterialsResponse,
  IColorResponse, IColorsResponse,
  ISizeResponse, ISizesResponse,
  IActionResponse
} from "@/interface/response/attributes";

// ======= Brand Hooks ======= //
export const useBrands = (params: IBrandFilter = {}): UseQueryResult<IBrandsResponse, Error> => {
  return useQuery<IBrandsResponse, Error>({
    queryKey: ["brands", params],
    queryFn: () => getAllBrands(params),
  });
};

export const useBrandDetail = (brandId: string): UseQueryResult<IBrandResponse, Error> => {
  return useQuery<IBrandResponse, Error>({
    queryKey: ["brand", brandId],
    queryFn: () => getBrandById(brandId),
    enabled: !!brandId,
  });
};

export const useCreateBrand = (): UseMutationResult<IBrandResponse, Error, IBrandCreate> => {
  return useMutation<IBrandResponse, Error, IBrandCreate>({
    mutationFn: (payload) => createBrand(payload),
  });
};

export const useUpdateBrand = (): UseMutationResult<
  IBrandResponse,
  Error,
  { brandId: string; payload: IBrandUpdate }
> => {
  return useMutation<IBrandResponse, Error, { brandId: string; payload: IBrandUpdate }>({
    mutationFn: ({ brandId, payload }) => updateBrand(brandId, payload),
  });
};

export const useDeleteBrand = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (brandId) => deleteBrand(brandId),
  });
};

// ======= Category Hooks ======= //
export const useCategories = (params: ICategoryFilter = {}): UseQueryResult<ICategoriesResponse, Error> => {
  return useQuery<ICategoriesResponse, Error>({
    queryKey: ["categories", params],
    queryFn: () => getAllCategories(params),
  });
};

export const useCategoryDetail = (categoryId: string): UseQueryResult<ICategoryResponse, Error> => {
  return useQuery<ICategoryResponse, Error>({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryById(categoryId),
    enabled: !!categoryId,
  });
};

export const useCreateCategory = (): UseMutationResult<ICategoryResponse, Error, ICategoryCreate> => {
  return useMutation<ICategoryResponse, Error, ICategoryCreate>({
    mutationFn: (payload) => createCategory(payload),
  });
};

export const useUpdateCategory = (): UseMutationResult<
  ICategoryResponse,
  Error,
  { categoryId: string; payload: ICategoryUpdate }
> => {
  return useMutation<ICategoryResponse, Error, { categoryId: string; payload: ICategoryUpdate }>({
    mutationFn: ({ categoryId, payload }) => updateCategory(categoryId, payload),
  });
};

export const useDeleteCategory = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (categoryId) => deleteCategory(categoryId),
  });
};

// ======= Material Hooks ======= //
export const useMaterials = (params: IMaterialFilter = {}): UseQueryResult<IMaterialsResponse, Error> => {
  return useQuery<IMaterialsResponse, Error>({
    queryKey: ["materials", params],
    queryFn: () => getAllMaterials(params),
  });
};

export const useMaterialDetail = (materialId: string): UseQueryResult<IMaterialResponse, Error> => {
  return useQuery<IMaterialResponse, Error>({
    queryKey: ["material", materialId],
    queryFn: () => getMaterialById(materialId),
    enabled: !!materialId,
  });
};

export const useCreateMaterial = (): UseMutationResult<IMaterialResponse, Error, IMaterialCreate> => {
  return useMutation<IMaterialResponse, Error, IMaterialCreate>({
    mutationFn: (payload) => createMaterial(payload),
  });
};

export const useUpdateMaterial = (): UseMutationResult<
  IMaterialResponse,
  Error,
  { materialId: string; payload: IMaterialUpdate }
> => {
  return useMutation<IMaterialResponse, Error, { materialId: string; payload: IMaterialUpdate }>({
    mutationFn: ({ materialId, payload }) => updateMaterial(materialId, payload),
  });
};

export const useDeleteMaterial = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (materialId) => deleteMaterial(materialId),
  });
};

// ======= Color Hooks ======= //
export const useColors = (params: IColorFilter = {}): UseQueryResult<IColorsResponse, Error> => {
  return useQuery<IColorsResponse, Error>({
    queryKey: ["colors", params],
    queryFn: () => getAllColors(params),
  });
};

export const useColorDetail = (colorId: string): UseQueryResult<IColorResponse, Error> => {
  return useQuery<IColorResponse, Error>({
    queryKey: ["color", colorId],
    queryFn: () => getColorById(colorId),
    enabled: !!colorId,
  });
};

export const useCreateColor = (): UseMutationResult<IColorResponse, Error, IColorCreate> => {
  return useMutation<IColorResponse, Error, IColorCreate>({
    mutationFn: (payload) => createColor(payload),
  });
};

export const useUpdateColor = (): UseMutationResult<
  IColorResponse,
  Error,
  { colorId: string; payload: IColorUpdate }
> => {
  return useMutation<IColorResponse, Error, { colorId: string; payload: IColorUpdate }>({
    mutationFn: ({ colorId, payload }) => updateColor(colorId, payload),
  });
};

export const useDeleteColor = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (colorId) => deleteColor(colorId),
  });
};

export const useSizes = (params: ISizeFilter = {}): UseQueryResult<ISizesResponse, Error> => {
  return useQuery<ISizesResponse, Error>({
    queryKey: ["sizes", params],
    queryFn: () => getAllSizes(params),
  });
};

export const useCreateSize = (): UseMutationResult<ISizeResponse, Error, ISizeCreate> => {
  return useMutation<ISizeResponse, Error, ISizeCreate>({
    mutationFn: (payload) => createSize(payload),
  });
};

export const useDeleteSize = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (sizeId) => deleteSize(sizeId),
  });
}; 