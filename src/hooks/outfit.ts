import { deleteOutfit, getOutfits, saveOutfit } from "@/api/outfit";
import { ISaveOutfitRequest } from "@/interface/request/outfit";
import {
  IDeleteOutfitResponse,
  IGetOutfitsResponse,
  ISaveOutfitResponse,
} from "@/interface/response/outfit";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

export const useSaveOutfit = (): UseMutationResult<
  ISaveOutfitResponse,
  Error,
  { userId: string; body: ISaveOutfitRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, body }) => saveOutfit(userId, body),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch outfits list
      queryClient.invalidateQueries({
        queryKey: ["outfits", variables.userId],
      });
    },
  });
};

export const useGetOutfits = (
  userId: string,
  enabled: boolean = true
): UseQueryResult<IGetOutfitsResponse, Error> => {
  return useQuery({
    queryKey: ["outfits", userId],
    queryFn: () => getOutfits(userId),
    enabled: enabled && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDeleteOutfit = (): UseMutationResult<
  IDeleteOutfitResponse,
  Error,
  { userId: string; outfitId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, outfitId }) => deleteOutfit(userId, outfitId),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch outfits list
      queryClient.invalidateQueries({
        queryKey: ["outfits", variables.userId],
      });
    },
  });
};
