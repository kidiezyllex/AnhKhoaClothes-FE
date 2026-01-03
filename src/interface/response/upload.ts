import { IBaseResponse } from "./authentication";

export interface IUploadImageResponse {
  data: {
    url: string;
    publicId: string;
  };
  message: string;
  statusCode: number;
}

export interface IUploadImageResponseData {
  url: string;
  publicId: string;
}

export interface IUploadImageResponse extends IBaseResponse<IUploadImageResponseData> {}
