export interface IPersonalizedProduct {
  product_id: string;
  name: string;
  product?: {
    id?: string;
    productDisplayName?: string;
    name?: string;
    images?: string | string[];
    variants?: { price?: number; color?: string; size?: string; stock?: number }[];
    price?: number;
    sale?: number;
    rating?: number;
    gender?: string;
    baseColour?: string;
    articleType?: string;
    usage?: string;
    season?: string;
    masterCategory?: string;
    subCategory?: string;
  };
  priority_score: number;
}

export interface IOutfitProduct {
  product_id: string;
  category?: string;
  product?: {
    id?: string;
    productDisplayName?: string;
    name?: string;
    images?: string | string[];
    variants?: { price?: number }[];
    price?: number;
    sale?: number;
    articleType?: string;
    usage?: string;
    season?: string;
    masterCategory?: string;
    subCategory?: string;
  };
}

export interface IOutfitResult {
    outfit_number: number;
    score: number;
    products: IOutfitProduct[];
    style?: string;
    description?: string;
}

export interface IModelRecommendationResponse {
    personalized_products: IPersonalizedProduct[];
    outfits: IOutfitResult[];
    metadata?: {
        user_gender?: string;
    };
}
