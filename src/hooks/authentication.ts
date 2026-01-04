import {
  login,
  register,
} from "@/api/authentication";
import type {
  ISignIn,
  IRegister,
} from "@/interface/request/authentication";
import type {
  IAuthResponse,
} from "@/interface/response/authentication";
import {
  type UseMutationResult,
  useMutation,
} from "@tanstack/react-query";
import cookies from "js-cookie";
import { useChangePassword, useUpdateUserProfile } from './account';
export const useLogin = (): UseMutationResult<
  IAuthResponse,
  Error,
  ISignIn
> => {
  return useMutation<IAuthResponse, Error, ISignIn>({
    mutationFn: (params: ISignIn) => login(params),
    onSuccess: (result: IAuthResponse) => {
      if (result.status === "success" && result.data?.tokens?.access) {
        cookies.set("accessToken", result.data.tokens.access);
      }
      return result;
    },
  });
};

export const useRegister = (): UseMutationResult<
  IAuthResponse,
  Error,
  IRegister
> => {
  return useMutation<IAuthResponse, Error, IRegister>({
    mutationFn: (params: IRegister) => register(params),
  });
};

export { useChangePassword, useUpdateUserProfile as useUpdateProfile };
