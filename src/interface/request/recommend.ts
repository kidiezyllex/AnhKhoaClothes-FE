export interface IRecommendRequestBase {
	user_id: string;
	current_product_id: string;
	top_k_personal?: number; // 1 ≤ value ≤ 50, default: 5
	top_k_outfit?: number;   // 1 ≤ value ≤ 10, default: 4
}

export type IHybridRecommendRequest = IRecommendRequestBase;
