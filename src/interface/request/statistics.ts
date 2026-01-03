export interface IStatisticsFilter {
  type?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface IRevenueReportFilter {
  startDate: string;
  endDate: string;
  type?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}

export interface ITopProductsFilter {
  startDate: string;
  endDate: string;
  limit?: number;
}

export interface IGenerateDailyStatistics {
  date: string;
} 