import {
  useQuery,
  useMutation,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getStatistics,
  getStatisticsById,
  getRevenueReport,
  getTopProducts,
  generateDailyStatistics
} from "@/api/statistics";
import {
  IStatisticsFilter,
  IRevenueReportFilter,
  ITopProductsFilter,
  IGenerateDailyStatistics
} from "@/interface/request/statistics";
import {
  IStatisticsResponse,
  IStatisticsDetailResponse,
  IRevenueReportResponse,
  ITopProductsResponse,
  IGenerateDailyResponse
} from "@/interface/response/statistics";

export const useStatistics = (params: IStatisticsFilter = {}): UseQueryResult<IStatisticsResponse, Error> => {
  return useQuery<IStatisticsResponse, Error>({
    queryKey: ["statistics", params],
    queryFn: () => getStatistics(params),
  });
};

export const useStatisticsDetail = (statisticsId: string): UseQueryResult<IStatisticsDetailResponse, Error> => {
  return useQuery<IStatisticsDetailResponse, Error>({
    queryKey: ["statistics", statisticsId],
    queryFn: () => getStatisticsById(statisticsId),
    enabled: !!statisticsId, // Only fetch when statisticsId is available
  });
};

export const useRevenueReport = (params: IRevenueReportFilter): UseQueryResult<IRevenueReportResponse, Error> => {
  return useQuery<IRevenueReportResponse, Error>({
    queryKey: ["revenueReport", params],
    queryFn: () => getRevenueReport(params),
    enabled: !!params.startDate && !!params.endDate, // Only fetch when required dates are available
  });
};

export const useTopProducts = (params: ITopProductsFilter): UseQueryResult<ITopProductsResponse, Error> => {
  return useQuery<ITopProductsResponse, Error>({
    queryKey: ["topProducts", params],
    queryFn: () => getTopProducts(params),
    enabled: !!params.startDate && !!params.endDate, // Only fetch when required dates are available
  });
};

export const useGenerateDailyStatistics = (): UseMutationResult<IGenerateDailyResponse, Error, IGenerateDailyStatistics> => {
  return useMutation<IGenerateDailyResponse, Error, IGenerateDailyStatistics>({
    mutationFn: (payload) => generateDailyStatistics(payload),
  });
}; 