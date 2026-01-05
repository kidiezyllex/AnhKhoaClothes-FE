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
