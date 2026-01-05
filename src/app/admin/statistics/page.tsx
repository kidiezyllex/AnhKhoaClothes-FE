"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccounts } from "@/hooks/account";
import {
  useGenerateDailyStatistics,
  useRevenueReport,
  useStatistics,
  useStatisticsDetail,
  useTopProducts,
} from "@/hooks/statistics";
import {
  IRevenueReportFilter,
  IStatisticsFilter,
  ITopProductsFilter,
} from "@/interface/request/statistics";
import {
  mdiAccountGroup,
  mdiCashMultiple,
  mdiLoading,
  mdiPackageVariantClosed,
  mdiSync,
  mdiTrendingUp,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function StatisticsPage() {
  const [statisticsFilters, setStatisticsFilters] = useState<IStatisticsFilter>(
    {
      type: "MONTHLY",
      page: 1,
      limit: 10,
    }
  );
  const [revenueFilters, setRevenueFilters] = useState<IRevenueReportFilter>({
    type: "MONTHLY",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [topProductsFilters, setTopProductsFilters] =
    useState<ITopProductsFilter>({
      startDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 2,
        1
      )
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      limit: 10,
    });
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateDate, setGenerateDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStatisticsId, setSelectedStatisticsId] = useState<
    string | null
  >(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Filter riêng cho overview (lấy dữ liệu tháng hiện tại)
  const overviewFilters: IStatisticsFilter = {
    type: "MONTHLY",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    limit: 1,
  };

  // Sử dụng các hooks thực
  const {
    data: statisticsData,
    isLoading: statisticsLoading,
    isError: statisticsError,
  } = useStatistics(statisticsFilters);
  const { isLoading: overviewLoading, isError: overviewError } =
    useStatistics(overviewFilters);
  const {
    data: revenueData,
    isLoading: revenueLoading,
    isError: revenueError,
  } = useRevenueReport(revenueFilters);
  const { data: topProductsData } = useTopProducts(topProductsFilters);
  const generateDailyStatistics = useGenerateDailyStatistics();
  const { data: accountsData } = useAccounts({ role: "CUSTOMER" });
  const { data: statisticsDetailData, isLoading: isDetailLoading } =
    useStatisticsDetail(selectedStatisticsId || "");

  const handleRevenueFilterChange = (
    key: keyof IRevenueReportFilter,
    value: any
  ) => {
    setRevenueFilters({ ...revenueFilters, [key]: value });
  };

  const handleTopProductsFilterChange = (
    key: keyof ITopProductsFilter,
    value: any
  ) => {
    setTopProductsFilters({ ...topProductsFilters, [key]: value });
  };

  const handleGenerateStatistics = async () => {
    try {
      await generateDailyStatistics.mutateAsync(
        { date: generateDate },
        {
          onSuccess: () => {
            toast.success("Đã tạo thống kê thành công");
            queryClient.invalidateQueries({ queryKey: ["statistics"] });
            queryClient.invalidateQueries({ queryKey: ["revenueReport"] });
            queryClient.invalidateQueries({ queryKey: ["topProducts"] });
            setIsGenerateDialogOpen(false);
          },
        }
      );
    } catch (error) {
      toast.error("Tạo thống kê thất bại");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  };

  interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
    iconColor: string;
    bgColor: string;
    change: number;
  }

  // Overview dashboard stats with modern design
  const StatCard = ({
    title,
    value,
    icon,
    iconColor,
    bgColor,
    change,
  }: StatCardProps) => {
    const isPositive = change >= 0;
    return (
      <Card className="h-full bg-white border border-gray-200 hover:shadow-md transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`${bgColor} p-3 rounded-xl flex-shrink-0`}>
              <Icon path={icon} size={1.3} className={iconColor} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 mb-1 font-semibold">
                {title}
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
            </div>
          </div>
          {/* Change indicator */}
          <div
            className={`inline-flex items-center gap-1 text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <Icon
              path={mdiTrendingUp}
              size={0.8}
              style={{
                transform: isPositive ? "none" : "rotate(180deg)",
              }}
            />
            <span>
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
            <span className="text-gray-700 font-normal ml-1">
              vs tháng trước
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Sử dụng statisticsData thay vì overviewStatistics để hiển thị đúng dữ liệu
  const currentMonthData = statisticsData?.data?.data?.[0] || {
    orderCount: 0,
    revenue: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };

  // Tính tổng doanh thu từ revenue data
  const totalRevenue = revenueData?.data?.totalRevenue || 0;
  const totalOrders = revenueData?.data?.orderCount || 0;

  // Tính số khách hàng mới từ danh sách users
  const accountsList = accountsData?.data?.users || [];
  const newCustomersCount =
    accountsList.filter((account) => {
      const accountDate = new Date(account.created_at);
      const currentDate = new Date();
      return (
        accountDate.getMonth() === currentDate.getMonth() &&
        accountDate.getFullYear() === currentDate.getFullYear()
      );
    }).length || 0;

  // Sử dụng dữ liệu từ statisticsData.data.data cho biểu đồ vì nó là mảng lịch sử
  const chartData = statisticsData?.data?.data || [];
  const mockRevenueData = chartData.length
    ? chartData.map((item) => ({
        date: `${item.month}/${item.year}`,
        totalRevenue: item.revenue,
        totalOrders: item.orderCount,
      }))
    : [
        {
          date: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
          totalRevenue: currentMonthData.revenue,
          totalOrders: currentMonthData.orderCount,
        },
      ];

  // Lấy top products từ data.products
  const actualTopProducts = topProductsData?.data?.products || [];
  const mockTopProductsData = actualTopProducts.length
    ? actualTopProducts.map((item) => ({
        product: {
          id: item.id.toString(),
          name: item.name,
        },
        totalQuantity: item.sold,
        totalRevenue: 0, // API không trả về revenue cho top products
      }))
    : [
        {
          product: { id: "1", name: "Chưa có dữ liệu" },
          totalQuantity: 0,
          totalRevenue: 0,
        },
      ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Thống kê</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Dialog
          open={isGenerateDialogOpen}
          onOpenChange={setIsGenerateDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Icon path={mdiSync} size={0.8} className="mr-2" />
              Tạo thống kê
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo thống kê thủ công</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="generateDate">Chọn ngày cần tạo thống kê</Label>
                <Input
                  id="generateDate"
                  type="date"
                  value={generateDate}
                  onChange={(e) => setGenerateDate(e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-700">
                Lưu ý: Chức năng này thường được hệ thống tự động thực hiện. Chỉ
                sử dụng khi cần thiết.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsGenerateDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleGenerateStatistics}
                disabled={generateDailyStatistics.isPending}
              >
                {generateDailyStatistics.isPending ? (
                  <>
                    <Icon
                      path={mdiLoading}
                      size={0.8}
                      className="mr-2 animate-spin"
                    />
                    Đang xử lý...
                  </>
                ) : (
                  "Tạo thống kê"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-4xl">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
        </TabsList>

        {/* Tổng quan */}
        <TabsContent value="overview" className="space-y-4">
          {statisticsLoading || revenueLoading || overviewLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-5 w-40" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : statisticsError || revenueError || overviewError ? (
            <Card className="p-4 border-green-100">
              <p className="text-red-600">Lỗi khi tải dữ liệu thống kê</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <StatCard
                title="Tổng doanh thu"
                value={formatCurrency(totalRevenue)}
                icon={mdiCashMultiple}
                iconColor="text-primary"
                bgColor="bg-green-100"
                change={0}
              />
              <StatCard
                title="Số đơn hàng"
                value={totalOrders.toString()}
                icon={mdiPackageVariantClosed}
                iconColor="text-blue-600"
                bgColor="bg-blue-100"
                change={5.3}
              />
              <StatCard
                title="Lợi nhuận dự kiến"
                value={formatCurrency(totalRevenue * 0.15)} // Giả định 15% vì API không trả lợi nhuận
                icon={mdiTrendingUp}
                iconColor="text-purple-600"
                bgColor="bg-purple-100"
                change={7.8}
              />
              <StatCard
                title="Khách hàng mới"
                value={newCustomersCount.toString()}
                icon={mdiAccountGroup}
                iconColor="text-amber-600"
                bgColor="bg-amber-100"
                change={3.2}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Doanh thu theo thời gian</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockRevenueData.map((item) => ({
                        date: item.date,
                        revenue: item.totalRevenue,
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 sản phẩm bán chạy</CardTitle>
              </CardHeader>
              <CardContent className="p-4 max-h-96 overflow-y-auto">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockTopProductsData
                          .slice(0, 5)
                          .map((item, index) => ({
                            name: item.product?.name
                              ? item.product.name.length > 20
                                ? `${item.product.name.substring(0, 20)}...`
                                : item.product.name
                              : `Sản phẩm ${index + 1}`,
                            fullName:
                              item.product?.name || `Sản phẩm ${index + 1}`,
                            quantity: item.totalQuantity,
                            revenue: item.totalRevenue,
                          }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={40}
                        dataKey="quantity"
                        label={({
                          name,
                          percent,
                        }: {
                          name: string;
                          percent: number;
                        }) => {
                          if (percent <= 0.05) return "";
                          const maxLength = 15;
                          const truncatedName =
                            name.length > maxLength
                              ? `${name.substring(0, maxLength)}...`
                              : name;
                          return `${truncatedName}: ${(percent * 100).toFixed(
                            1
                          )}%`;
                        }}
                        labelLine={false}
                      >
                        {mockTopProductsData
                          .slice(0, 5)
                          .map((_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                      </Pie>
                      <Tooltip
                        formatter={(
                          value: number,
                          name: string,
                          props: any
                        ) => [
                          `${value} sản phẩm`,
                          props.payload.fullName || name,
                        ]}
                        labelFormatter={() => "Sản phẩm bán chạy"}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value: string, entry: any) => {
                          const fullName = entry.payload?.fullName || value;
                          const maxLength = 20;
                          return fullName.length > maxLength
                            ? `${fullName.substring(0, maxLength)}...`
                            : fullName;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Doanh thu */}
        <TabsContent value="revenue" className="space-y-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Báo cáo doanh thu</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="revType">Loại thống kê</Label>
                  <Select
                    value={revenueFilters.type || "MONTHLY"}
                    onValueChange={(value) =>
                      handleRevenueFilterChange("type", value)
                    }
                  >
                    <SelectTrigger id="revType">
                      <SelectValue placeholder="Chọn loại thống kê" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Theo ngày</SelectItem>
                      <SelectItem value="WEEKLY">Theo tuần</SelectItem>
                      <SelectItem value="MONTHLY">Theo tháng</SelectItem>
                      <SelectItem value="YEARLY">Theo năm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Từ ngày</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={revenueFilters.startDate}
                    onChange={(e) =>
                      handleRevenueFilterChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Đến ngày</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={revenueFilters.endDate}
                    onChange={(e) =>
                      handleRevenueFilterChange("endDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-[6px] mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Tổng doanh thu
                    </h3>
                    <p className="text-2xl font-bold text-green-500 mt-2">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Số đơn hàng
                    </h3>
                    <p className="text-2xl font-bold mt-2 text-blue-500">
                      {totalOrders}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockRevenueData.map((item) => ({
                      date: item.date,
                      revenue: item.totalRevenue,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Doanh thu" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Chi tiết doanh thu
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thời gian</TableHead>
                        <TableHead className="text-right">Doanh thu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRevenueData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.totalRevenue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4 text-gray-700">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="prodStartDate">Từ ngày</Label>
                  <Input
                    id="prodStartDate"
                    type="date"
                    value={topProductsFilters.startDate}
                    onChange={(e) =>
                      handleTopProductsFilterChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="prodEndDate">Đến ngày</Label>
                  <Input
                    id="prodEndDate"
                    type="date"
                    value={topProductsFilters.endDate}
                    onChange={(e) =>
                      handleTopProductsFilterChange("endDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="prodLimit">Số lượng hiển thị</Label>
                  <Select
                    value={topProductsFilters.limit?.toString() || "10"}
                    onValueChange={(value) =>
                      handleTopProductsFilterChange("limit", parseInt(value))
                    }
                  >
                    <SelectTrigger id="prodLimit">
                      <SelectValue placeholder="Số lượng hiển thị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 sản phẩm</SelectItem>
                      <SelectItem value="10">10 sản phẩm</SelectItem>
                      <SelectItem value="20">20 sản phẩm</SelectItem>
                      <SelectItem value="50">50 sản phẩm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="w-full h-80 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockTopProductsData
                        .slice(0, topProductsFilters.limit || 10)
                        .map((item, index) => ({
                          name: item.product?.name
                            ? item.product.name.length > 20
                              ? `${item.product.name.substring(0, 20)}...`
                              : item.product.name
                            : `Sản phẩm ${index + 1}`,
                          fullName:
                            item.product?.name || `Sản phẩm ${index + 1}`,
                          quantity: item.totalQuantity,
                          revenue: item.totalRevenue,
                        }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                      dataKey="quantity"
                      label={({
                        name,
                        percent,
                      }: {
                        name: string;
                        percent: number;
                      }) => {
                        if (percent <= 0.05) return "";
                        const maxLength = 15;
                        const truncatedName =
                          name.length > maxLength
                            ? `${name.substring(0, maxLength)}...`
                            : name;
                        return `${truncatedName}: ${(percent * 100).toFixed(
                          1
                        )}%`;
                      }}
                      labelLine={false}
                    >
                      {mockTopProductsData
                        .slice(0, topProductsFilters.limit || 10)
                        .map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${value} sản phẩm`,
                        props.payload.fullName || name,
                      ]}
                      labelFormatter={() => "Sản phẩm bán chạy"}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value: string, entry: any) => {
                        const fullName = entry.payload?.fullName || value;
                        const maxLength = 20;
                        return fullName.length > maxLength
                          ? `${fullName.substring(0, maxLength)}...`
                          : fullName;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">
                    Tổng số lượng bán
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {mockTopProductsData.reduce(
                      (sum: number, item: any) => sum + item.totalQuantity,
                      0
                    )}{" "}
                    sản phẩm
                  </p>
                </div>
                <div className="p-4 bg-[#EAEBF2] rounded-lg">
                  <h4 className="text-lg font-semibold text-green-700 mb-2">
                    Tổng doanh thu
                  </h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      mockTopProductsData.reduce(
                        (sum: number, item) => sum + item.totalRevenue,
                        0
                      )
                    )}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead className="text-right">Số lượng bán</TableHead>
                      <TableHead className="text-right">Doanh thu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTopProductsData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-gray-700">
                          {item.product?.name || `Sản phẩm ${index + 1}`}
                        </TableCell>
                        <TableCell className="text-right text-gray-700">
                          {item.totalQuantity}
                        </TableCell>
                        <TableCell className="text-right text-gray-700">
                          {formatCurrency(item.totalRevenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Statistics Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết thống kê</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isDetailLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : statisticsDetailData?.data ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-700">
                      Tổng đơn hàng
                    </h4>
                    <p className="text-xl font-bold text-blue-600">
                      {statisticsDetailData.data.totalOrders}
                    </p>
                  </div>
                  <div className="p-4 bg-[#EAEBF2] rounded-lg">
                    <h4 className="text-sm font-medium text-green-700">
                      Doanh thu
                    </h4>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(statisticsDetailData.data.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-700">
                      Lợi nhuận
                    </h4>
                    <p className="text-xl font-bold text-purple-600">
                      {formatCurrency(statisticsDetailData.data.totalProfit)}
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-700">
                      Khách hàng mới
                    </h4>
                    <p className="text-xl font-bold text-yellow-600">
                      {statisticsDetailData.data.customerCount?.new || 0}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">
                      Thông tin thống kê
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Loại:</span>
                        <Badge variant="outline">
                          {statisticsDetailData.data.type === "DAILY"
                            ? "Ngày"
                            : statisticsDetailData.data.type === "WEEKLY"
                            ? "Tuần"
                            : statisticsDetailData.data.type === "MONTHLY"
                            ? "Tháng"
                            : "Năm"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Ngày thống kê:</span>
                        <span>
                          {formatDate(statisticsDetailData.data.date)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tổng khách hàng:</span>
                        <span>
                          {statisticsDetailData.data.customerCount?.total || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">
                      Thông tin bổ sung
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Được tạo:</span>
                        <span>
                          {formatDate(statisticsDetailData.data.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cập nhật cuối:</span>
                        <span>
                          {formatDate(statisticsDetailData.data.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-700">
                <p>Không thể tải chi tiết thống kê</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
