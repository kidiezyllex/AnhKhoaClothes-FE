import {
  getAllAccounts,
  getAccountById,
  updateAccount,
  updateAccountStatus,
  deleteAccount,
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress
} from "@/api/account";
import type {
  IAccountFilter,
  IAccountUpdate,
  IAccountStatusUpdate,
  IAddressCreate,
  IAddressUpdate,
  IProfileUpdate,
  IChangePassword
} from "@/interface/request/account";
import type {
  IAccountsResponse,
  IAccountResponse,
  IProfileResponse,
  IActionResponse
} from "@/interface/response/account";
import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
  useQueryClient
} from "@tanstack/react-query";

/**
 * Hook lấy danh sách tài khoản
 */
export const useAccounts = (
  params: IAccountFilter = {}
): UseQueryResult<IAccountsResponse, Error> => {
  return useQuery<IAccountsResponse, Error>({
    queryKey: ["accounts", params],
    queryFn: () => getAllAccounts(params)
  });
};

/**
 * Hook lấy chi tiết tài khoản
 */
export const useAccount = (
  accountId: string
): UseQueryResult<IAccountResponse, Error> => {
  return useQuery<IAccountResponse, Error>({
    queryKey: ["account", accountId],
    queryFn: () => getAccountById(accountId),
    enabled: !!accountId
  });
};

/**
 * Hook cập nhật tài khoản
 */
export const useUpdateAccount = (
  accountId: string
): UseMutationResult<IAccountResponse, Error, IAccountUpdate> => {
  return useMutation<IAccountResponse, Error, IAccountUpdate>({
    mutationFn: (data: IAccountUpdate) => updateAccount(accountId, data)
  });
};

/**
 * Hook cập nhật trạng thái tài khoản
 */
export const useUpdateAccountStatus = (
  accountId: string
): UseMutationResult<IAccountResponse, Error, IAccountStatusUpdate> => {
  return useMutation<IAccountResponse, Error, IAccountStatusUpdate>({
    mutationFn: (data: IAccountStatusUpdate) => updateAccountStatus(accountId, data)
  });
};

/**
 * Hook xóa tài khoản
 */
export const useDeleteAccount = (): UseMutationResult<
  IActionResponse,
  Error,
  string
> => {
  return useMutation<IActionResponse, Error, string>({
    mutationFn: (accountId: string) => deleteAccount(accountId)
  });
};

/**
 * Hook lấy hồ sơ người dùng
 */
export const useUserProfile = (): UseQueryResult<IProfileResponse, Error> => {
  return useQuery<IProfileResponse, Error>({
    queryKey: ["userProfile"],
    queryFn: () => getProfile()
  });
};

/**
 * Hook cập nhật hồ sơ người dùng
 */
export const useUpdateUserProfile = (): UseMutationResult<
  IProfileResponse,
  Error,
  IProfileUpdate
> => {
  const queryClient = useQueryClient();
  return useMutation<IProfileResponse, Error, IProfileUpdate>({
    mutationFn: (data: IProfileUpdate) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

/**
 * Hook đổi mật khẩu
 */
export const useChangePassword = (): UseMutationResult<
  IActionResponse,
  Error,
  IChangePassword
> => {
  return useMutation<IActionResponse, Error, IChangePassword>({
    mutationFn: (data: IChangePassword) => changePassword(data)
  });
};

/**
 * Hook thêm địa chỉ mới
 */
export const useAddAddress = (): UseMutationResult<
  IProfileResponse,
  Error,
  IAddressCreate
> => {
  return useMutation<IProfileResponse, Error, IAddressCreate>({
    mutationFn: (data: IAddressCreate) => addAddress(data)
  });
};

/**
 * Hook cập nhật địa chỉ
 */
export const useUpdateAddress = (): UseMutationResult<
  IProfileResponse,
  Error,
  { addressId: string; data: IAddressUpdate }
> => {
  return useMutation<
    IProfileResponse,
    Error,
    { addressId: string; data: IAddressUpdate }
  >({
    mutationFn: ({ addressId, data }) => updateAddress(addressId, data)
  });
};

/**
 * Hook xóa địa chỉ
 */
export const useDeleteAddress = (): UseMutationResult<
  IProfileResponse,
  Error,
  string
> => {
  return useMutation<IProfileResponse, Error, string>({
    mutationFn: (addressId: string) => deleteAddress(addressId)
  });
}; 