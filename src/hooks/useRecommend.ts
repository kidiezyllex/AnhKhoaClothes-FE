import { useMutation } from "@tanstack/react-query";
import { sendPost } from "@/api/axios";
import { IHybridRecommendRequest } from "@/interface/request/recommend";
import { IModelRecommendationResponse } from "@/interface/response/recommend";

// Helper to build URL - assuming relative path for now as per project structure
const buildMlServiceUrl = (path: string) => path;

export const getHybridModelRecommendations = async (body: IHybridRecommendRequest): Promise<IModelRecommendationResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/v1/hybrid/recommend/`), body);
};

export const useHybridModelRecommendations = () => {
	return useMutation<IModelRecommendationResponse, Error, IHybridRecommendRequest>({
		mutationFn: getHybridModelRecommendations,
	});
};
