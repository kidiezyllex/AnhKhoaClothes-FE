export interface IRecommendRequestBase {
	user_id: string;
	current_product_id: string;
	alpha?: number;          // Default usually 0.5
	top_k_personalized?: number; // Replaces top_k_personal
	top_k_outfit?: number;
}

export type IHybridRecommendRequest = IRecommendRequestBase;
