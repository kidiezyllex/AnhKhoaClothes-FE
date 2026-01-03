import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { sendGet } from "@/api/axios";

// Định nghĩa các interface cho response
interface IBrandsResponse {
  success: boolean;
  message: string;
  data: {
    brands: Array<{
      id: string;
      name: string;
    }>;
  };
}

interface ICategoriesResponse {
  success: boolean;
  message: string;
  data: {
    categories: Array<{
      id: string;
      name: string;
    }>;
  };
}

interface IColorsResponse {
  success: boolean;
  message: string;
  data: {
    colors: Array<{
      id: string;
      name: string;
      code: string;
    }>;
  };
}

interface ISizesResponse {
  success: boolean;
  message: string;
  data: {
    sizes: Array<{
      id: string;
      name: string;
    }>;
  };
}

interface IMaterialsResponse {
  success: boolean;
  message: string;
  data: {
    materials: Array<{
      id: string;
      name: string;
    }>;
  };
}

// API functions
const getBrands = async (): Promise<IBrandsResponse> => {
  const res = await sendGet("/brands");
  return res as IBrandsResponse;
};

const getCategories = async (): Promise<ICategoriesResponse> => {
  const res = await sendGet("/categories");
  return res as ICategoriesResponse;
};

const getColors = async (): Promise<IColorsResponse> => {
  const res = await sendGet("/colors");
  return res as IColorsResponse;
};

const getSizes = async (): Promise<ISizesResponse> => {
  const res = await sendGet("/sizes");
  return res as ISizesResponse;
};

const getMaterials = async (): Promise<IMaterialsResponse> => {
  const res = await sendGet("/materials");
  return res as IMaterialsResponse;
};

// Hooks
export const useBrands = (): UseQueryResult<IBrandsResponse, Error> => {
  return useQuery<IBrandsResponse, Error>({
    queryKey: ["brands"],
    queryFn: () => getBrands(),
  });
};

export const useCategories = (): UseQueryResult<ICategoriesResponse, Error> => {
  return useQuery<ICategoriesResponse, Error>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
};

export const useColors = (): UseQueryResult<IColorsResponse, Error> => {
  return useQuery<IColorsResponse, Error>({
    queryKey: ["colors"],
    queryFn: () => getColors(),
  });
};

export const useSizes = (): UseQueryResult<ISizesResponse, Error> => {
  return useQuery<ISizesResponse, Error>({
    queryKey: ["sizes"],
    queryFn: () => getSizes(),
  });
};

export const useMaterials = (): UseQueryResult<IMaterialsResponse, Error> => {
  return useQuery<IMaterialsResponse, Error>({
    queryKey: ["materials"],
    queryFn: () => getMaterials(),
  });
}; 