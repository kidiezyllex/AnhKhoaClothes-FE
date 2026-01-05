import { IOutfitProduct } from "../request/outfit";

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
