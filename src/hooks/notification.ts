import {
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  createNotification,
} from "@/api/notification";
import {
  INotificationCreate,
} from "@/interface/request/notification";
import {
  INotificationResponse,
} from "@/interface/response/notification";

export const useCreateNotification = (): UseMutationResult<INotificationResponse, Error, INotificationCreate> => {
  return useMutation<INotificationResponse, Error, INotificationCreate>({
    mutationFn: (payload) => createNotification(payload),
  });
};