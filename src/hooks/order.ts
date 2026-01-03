import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  cancelOrder,
  getOrdersByUser,
  createPOSOrder
} from "@/api/order";
import {
  IOrderFilter,
  IOrderCreate,
  IOrderUpdate,
  IOrderStatusUpdate,
  IPOSOrderCreateRequest
} from "@/interface/request/order";
import {
  IOrdersResponse,
  IOrderResponse,
  IPOSOrderCreateResponse
} from "@/interface/response/order";

export const useOrders = (params: IOrderFilter = {}): UseQueryResult<IOrdersResponse, Error> => {
  return useQuery<IOrdersResponse, Error>({
    queryKey: ["orders", params],
    queryFn: () => getAllOrders(params),
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
  });
};

export const useOrderDetail = (orderId: string): UseQueryResult<IOrderResponse, Error> => {
  return useQuery<IOrderResponse, Error>({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId, // Chỉ fetch khi có orderId
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
  });
};

export const useCreateOrder = (): UseMutationResult<IOrderResponse, Error, IOrderCreate> => {
  return useMutation<IOrderResponse, Error, IOrderCreate>({
    mutationFn: (payload) => createOrder(payload),
  });
};

export const useUpdateOrder = (): UseMutationResult<
  IOrderResponse,
  Error,
  { orderId: string; payload: IOrderUpdate }
> => {
  return useMutation<IOrderResponse, Error, { orderId: string; payload: IOrderUpdate }>({
    mutationFn: ({ orderId, payload }) => updateOrder(orderId, payload),
  });
};

export const useUpdateOrderStatus = (): UseMutationResult<
  IOrderResponse,
  Error,
  { orderId: string; payload: IOrderStatusUpdate }
> => {
  return useMutation<IOrderResponse, Error, { orderId: string; payload: IOrderStatusUpdate }>({
    mutationFn: ({ orderId, payload }) => updateOrderStatus(orderId, payload),
  });
};

export const useCancelOrder = (): UseMutationResult<IOrderResponse, Error, string> => {
  return useMutation<IOrderResponse, Error, string>({
    mutationFn: (orderId) => cancelOrder(orderId),
  });
};

export const useOrdersByUser = (
  userId: string,
  params: { orderStatus?: string; page?: number; limit?: number } = {}
): UseQueryResult<IOrdersResponse, Error> => {
  return useQuery<IOrdersResponse, Error>({
    queryKey: ["ordersByUser", userId, params],
    queryFn: () => getOrdersByUser(userId, params),
    enabled: !!userId,
    refetchInterval: 4000,
    refetchIntervalInBackground: true,
  });
};

export const useCreatePOSOrder = (): UseMutationResult<
  IPOSOrderCreateResponse,
  Error,
  IPOSOrderCreateRequest
> => {
  return useMutation<IPOSOrderCreateResponse, Error, IPOSOrderCreateRequest>({
    mutationFn: (payload) => createPOSOrder(payload),
  });
}; 