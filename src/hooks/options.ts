import { sendGet } from "@/api/axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

// Định nghĩa các interface cho response
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

// API functions
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

// Hooks
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
