import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
  incrementVoucherUsage,
  notifyVoucher,
  getAvailableVouchersForUser
} from "@/api/voucher";
import {
  IVoucherFilter,
  IVoucherCreate,
  IVoucherUpdate,
  IVoucherValidate,
  IUserVoucherParams
} from "@/interface/request/voucher";
import {
  IVouchersResponse,
  IVoucherResponse,
  IVoucherValidationResponse,
  INotificationResponse,
  IActionResponse
} from "@/interface/response/voucher";

export const useVouchers = (params: IVoucherFilter = {}): UseQueryResult<IVouchersResponse, Error> => {
  return useQuery<IVouchersResponse, Error>({
    queryKey: ["vouchers", params],
    queryFn: () => getAllVouchers(params),
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
  });
};

export const useVoucherDetail = (voucherId: string): UseQueryResult<IVoucherResponse, Error> => {
  return useQuery<IVoucherResponse, Error>({
    queryKey: ["voucher", voucherId],
    queryFn: () => getVoucherById(voucherId),
    enabled: !!voucherId, // Chỉ fetch khi có voucherId
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
  });
};

export const useCreateVoucher = (): UseMutationResult<IVoucherResponse, Error, IVoucherCreate> => {
  return useMutation<IVoucherResponse, Error, IVoucherCreate>({
    mutationFn: (payload) => createVoucher(payload),
  });
};

export const useUpdateVoucher = (): UseMutationResult<
  IVoucherResponse,
  Error,
  { voucherId: string; payload: IVoucherUpdate }
> => {
  return useMutation<IVoucherResponse, Error, { voucherId: string; payload: IVoucherUpdate }>({
    mutationFn: ({ voucherId, payload }) => updateVoucher(voucherId, payload),
  });
};

export const useDeleteVoucher = (): UseMutationResult<IActionResponse, Error, string> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (voucherId) => deleteVoucher(voucherId),
  });
};

export const useValidateVoucher = (): UseMutationResult<IVoucherValidationResponse, Error, IVoucherValidate> => {
  return useMutation<IVoucherValidationResponse, Error, IVoucherValidate>({
    mutationFn: (payload) => validateVoucher(payload),
  });
};

export const useIncrementVoucherUsage = (): UseMutationResult<IVoucherResponse, Error, string> => {
  return useMutation<IVoucherResponse, Error, string>({
    mutationFn: (voucherId) => incrementVoucherUsage(voucherId),
  });
};

export const useNotifyVoucher = (): UseMutationResult<INotificationResponse, Error, string> => {
  return useMutation<INotificationResponse, Error, string>({
    mutationFn: (voucherId) => notifyVoucher(voucherId),
  });
};

// === User Voucher Hooks ===
export const useAvailableVouchersForUser = (
  userId: string,
  params: IUserVoucherParams = {}
): UseQueryResult<IVouchersResponse, Error> => {
  return useQuery<IVouchersResponse, Error>({
    queryKey: ["availableVouchers", userId, params],
    queryFn: () => getAvailableVouchersForUser(userId, params),
    enabled: !!userId, // Only fetch if userId is present
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
  });
}; 