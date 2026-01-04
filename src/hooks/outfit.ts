import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Interfaces
export interface IOutfitProduct {
  product_id: string;
  name: string;
  category: string;
  price: number;
  sale: number;
  images: string[];
}

export interface ISaveOutfitRequest {
  name: string;
  products: IOutfitProduct[];
  totalPrice: number;
  compatibilityScore: number;
  gender: string;
}

export interface IOutfit {
  _id: string;
  name: string;
  products: IOutfitProduct[];
  totalPrice: number;
  compatibilityScore: number;
  gender: string;
  timestamp: string;
}

export interface ISaveOutfitResponse {
  success: boolean;
  message: string;
  data: {
    outfit: IOutfit;
    user_id: string;
    total_outfits: number;
  };
}

export interface IGetOutfitsResponse {
  success: boolean;
  message: string;
  data: {
    outfits: IOutfit[];
    user_id: string;
    total_outfits: number;
  };
}

export interface IDeleteOutfitResponse {
  success: boolean;
  message: string;
  data: {
    outfits: IOutfit[];
    user_id: string;
    total_outfits: number;
  };
}

// API Functions
const saveOutfit = async (userId: string, body: ISaveOutfitRequest): Promise<ISaveOutfitResponse> => {
  const response = await axios.post(`${API_BASE_URL}/api/v1/accounts/${userId}/outfits`, body);
  return response.data;
};

const getOutfits = async (userId: string): Promise<IGetOutfitsResponse> => {
  const response = await axios.get(`${API_BASE_URL}/api/v1/accounts/${userId}/outfits`);
  return response.data;
};

const deleteOutfit = async (userId: string, outfitId: string): Promise<IDeleteOutfitResponse> => {
  const response = await axios.delete(`${API_BASE_URL}/api/v1/accounts/${userId}/outfits/${outfitId}`);
  return response.data;
};

// Hooks
export const useSaveOutfit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, body }: { userId: string; body: ISaveOutfitRequest }) =>
      saveOutfit(userId, body),
    onSuccess: (data, variables) => {
      // Invalidate and refetch outfits list
      queryClient.invalidateQueries({ queryKey: ["outfits", variables.userId] });
    },
  });
};

export const useGetOutfits = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["outfits", userId],
    queryFn: () => getOutfits(userId),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDeleteOutfit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, outfitId }: { userId: string; outfitId: string }) =>
      deleteOutfit(userId, outfitId),
    onSuccess: (data, variables) => {
      // Invalidate and refetch outfits list
      queryClient.invalidateQueries({ queryKey: ["outfits", variables.userId] });
    },
  });
};
