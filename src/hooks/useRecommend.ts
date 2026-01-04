import { useMutation } from "@tanstack/react-query";
import { sendPost } from "@/api/axios";
import { IHybridRecommendRequest } from "@/interface/request/recommend";
import { IModelRecommendationResponse } from "@/interface/response/recommend";

// Helpers to build URL - adjusted to not repeat /api/v1 if it's already in the base URL
const buildMlServiceUrl = (path: string) => path;

export const getHybridModelRecommendations = async (body: IHybridRecommendRequest): Promise<IModelRecommendationResponse> => {
	// Paths in sendPost/sendGet should be relative to baseURL (which usually already includes /api/v1)
	return await sendPost(buildMlServiceUrl(`/hybrid/recommend`), body);
};

export const useHybridModelRecommendations = () => {
	return useMutation<IModelRecommendationResponse, Error, IHybridRecommendRequest>({
		mutationFn: getHybridModelRecommendations,
	});
};
