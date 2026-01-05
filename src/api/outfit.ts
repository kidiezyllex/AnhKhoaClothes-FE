import { ISaveOutfitRequest } from "@/interface/request/outfit";
import {
  IDeleteOutfitResponse,
  IGetOutfitsResponse,
  ISaveOutfitResponse,
} from "@/interface/response/outfit";
import { sendDelete, sendGet, sendPost } from "./axios";

export const saveOutfit = (
  userId: string,
  body: ISaveOutfitRequest
): Promise<ISaveOutfitResponse> => {
  return sendPost(`/accounts/${userId}/outfits`, body);
};

export const getOutfits = (userId: string): Promise<IGetOutfitsResponse> => {
  return sendGet(`/accounts/${userId}/outfits`);
};

export const deleteOutfit = (
  userId: string,
  outfitId: string
): Promise<IDeleteOutfitResponse> => {
  return sendDelete(`/accounts/${userId}/outfits/${outfitId}`);
};
