export interface IMonthlyStatisticsItem {
  month: number;
  year: number;
  revenue: number;
  orderCount: number;
}

export interface IStatisticsResponse {
  status: string;
  message: string;
  data: {
    data: IMonthlyStatisticsItem[];
  };
}

export interface IRevenueReport {
  totalRevenue: number;
  orderCount: number;
}

export interface IRevenueReportResponse {
  status: string;
  message: string;
  data: IRevenueReport;
}

export interface ITopProduct {
  id: number;
  name: string;
  sold: number;
}

export interface ITopProductsResponse {
  status: string;
  message: string;
  data: {
    products: ITopProduct[];
  };
}

// Keeping these for potential backward compatibility or other endpoints
export interface IStatisticsItem {
  id: string;
  date: string;
  type: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  totalOrders: number;
  totalRevenue: number;
  totalProfit: number;
}

export interface IProductSold {
  product: {
    id: string;
    name: string;
    code?: string;
    imageUrl?: string;
  };
  quantity: number;
  revenue: number;
}

export interface IVoucherUsed {
  voucher: {
    id: string;
    code: string;
    discount: number;
  };
  usageCount: number;
  totalDiscount: number;
}

export interface ICustomerCount {
  new: number;
  total: number;
}

export interface IStatisticsDetail extends IStatisticsItem {
  productsSold: IProductSold[];
  vouchersUsed: IVoucherUsed[];
  customerCount: ICustomerCount;
  createdAt: string;
  updatedAt: string;
}

export interface IRevenueSeries {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface IStatisticsDetailResponse {
  success: boolean;
  data: IStatisticsDetail;
}

export interface IGenerateDailyResponse {
  success: boolean;
  data: IStatisticsDetail;
}
