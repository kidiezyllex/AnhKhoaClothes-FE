import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { uploadImage, IUploadImageResponseData } from "@/api/upload";

export const useUploadImage = (): UseMutationResult<IUploadImageResponseData, Error, FormData> => {
  return useMutation<IUploadImageResponseData, Error, FormData>({
    mutationFn: (formData) => uploadImage(formData),
  });
}; 