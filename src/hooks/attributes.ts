import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";

import {
  createCategory,
  createColor,
  createSize,
  deleteCategory,
  deleteColor,
  deleteSize,
  getAllCategories,
  getAllColors,
  getAllSizes,
  getCategoryById,
  getColorById,
  updateCategory,
  updateColor,
} from "@/api/attributes";

import {
  ICategoryCreate,
  ICategoryFilter,
  ICategoryUpdate,
  IColorCreate,
  IColorFilter,
  IColorUpdate,
  ISizeCreate,
  ISizeFilter,
} from "@/interface/request/attributes";

import {
  IActionResponse,
  ICategoriesResponse,
  ICategoryResponse,
  IColorResponse,
  IColorsResponse,
  ISizeResponse,
  ISizesResponse,
} from "@/interface/response/attributes";

// ======= Category Hooks ======= //
export const useCategories = (
  params: ICategoryFilter = {}
): UseQueryResult<ICategoriesResponse, Error> => {
  return useQuery<ICategoriesResponse, Error>({
    queryKey: ["categories", params],
    queryFn: () => getAllCategories(params),
  });
};

export const useCategoryDetail = (
  categoryId: string
): UseQueryResult<ICategoryResponse, Error> => {
  return useQuery<ICategoryResponse, Error>({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryById(categoryId),
    enabled: !!categoryId,
  });
};

export const useCreateCategory = (): UseMutationResult<
  ICategoryResponse,
  Error,
  ICategoryCreate
> => {
  return useMutation<ICategoryResponse, Error, ICategoryCreate>({
    mutationFn: (payload) => createCategory(payload),
  });
};

export const useUpdateCategory = (): UseMutationResult<
  ICategoryResponse,
  Error,
  { categoryId: string; payload: ICategoryUpdate }
> => {
  return useMutation<
    ICategoryResponse,
    Error,
    { categoryId: string; payload: ICategoryUpdate }
  >({
    mutationFn: ({ categoryId, payload }) =>
      updateCategory(categoryId, payload),
  });
};

export const useDeleteCategory = (): UseMutationResult<
  IActionResponse,
  Error,
  string
> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (categoryId) => deleteCategory(categoryId),
  });
};

// ======= Color Hooks ======= //
export const useColors = (
  params: IColorFilter = {}
): UseQueryResult<IColorsResponse, Error> => {
  return useQuery<IColorsResponse, Error>({
    queryKey: ["colors", params],
    queryFn: () => getAllColors(params),
  });
};

export const useColorDetail = (
  colorId: string
): UseQueryResult<IColorResponse, Error> => {
  return useQuery<IColorResponse, Error>({
    queryKey: ["color", colorId],
    queryFn: () => getColorById(colorId),
    enabled: !!colorId,
  });
};

export const useCreateColor = (): UseMutationResult<
  IColorResponse,
  Error,
  IColorCreate
> => {
  return useMutation<IColorResponse, Error, IColorCreate>({
    mutationFn: (payload) => createColor(payload),
  });
};

export const useUpdateColor = (): UseMutationResult<
  IColorResponse,
  Error,
  { colorId: string; payload: IColorUpdate }
> => {
  return useMutation<
    IColorResponse,
    Error,
    { colorId: string; payload: IColorUpdate }
  >({
    mutationFn: ({ colorId, payload }) => updateColor(colorId, payload),
  });
};

export const useDeleteColor = (): UseMutationResult<
  IActionResponse,
  Error,
  string
> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (colorId) => deleteColor(colorId),
  });
};

// ======= Size Hooks ======= //
export const useSizes = (
  params: ISizeFilter = {}
): UseQueryResult<ISizesResponse, Error> => {
  return useQuery<ISizesResponse, Error>({
    queryKey: ["sizes", params],
    queryFn: () => getAllSizes(params),
  });
};

export const useCreateSize = (): UseMutationResult<
  ISizeResponse,
  Error,
  ISizeCreate
> => {
  return useMutation<ISizeResponse, Error, ISizeCreate>({
    mutationFn: (payload) => createSize(payload),
  });
};

export const useDeleteSize = (): UseMutationResult<
  IActionResponse,
  Error,
  string
> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (sizeId) => deleteSize(sizeId),
  });
};
