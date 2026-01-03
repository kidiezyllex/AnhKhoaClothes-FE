"use client"

import { useState, useEffect } from "react"
 
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icon } from "@mdi/react"
import {
  mdiMagnify,
  mdiFilterOutline,
  mdiEye,
  mdiPencil,
  mdiFileExport,
  mdiPrinter,
  mdiCheck,
  mdiDelete,
} from "@mdi/js"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useOrders, useOrderDetail, useUpdateOrderStatus, useCancelOrder } from "@/hooks/order"
import type { IOrderFilter } from "@/interface/request/order"
import { useQueryClient } from "@tanstack/react-query"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import { autoTable } from "jspdf-autotable"
export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<IOrderFilter>({
    page: 1,
    limit: 10,
  })
  const [selectedTab, setSelectedTab] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isConfirmCancelDialogOpen, setIsConfirmCancelDialogOpen] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)
  const [statusToUpdate, setStatusToUpdate] = useState<string>("")
  const { data, isLoading, isError } = useOrders(filters)
  const { data: orderDetail } = useOrderDetail(selectedOrder || "")
  const updateOrderStatus = useUpdateOrderStatus()
  const cancelOrder = useCancelOrder()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }))
      } else {
        if (filters.search !== undefined) {
          const { search, ...rest } = filters
          setFilters({ ...rest, page: 1 })
        }
      }
    }, 500)

    return () => clearTimeout(debounce)
  }, [searchQuery])

  useEffect(() => {
    const newFilters: Partial<IOrderFilter> = { page: 1 }
    const today = new Date()
    const currentDay = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1))
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    startOfMonth.setHours(0, 0, 0, 0)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    endOfMonth.setHours(23, 59, 59, 999)

    today.setHours(0, 0, 0, 0)
    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999)

    if (selectedTab === "today") {
      newFilters.startDate = today.toISOString().split("T")[0]
      newFilters.endDate = endOfToday.toISOString().split("T")[0]
    } else if (selectedTab === "week") {
      newFilters.startDate = startOfWeek.toISOString().split("T")[0]
      newFilters.endDate = endOfWeek.toISOString().split("T")[0]
    } else if (selectedTab === "month") {
      newFilters.startDate = startOfMonth.toISOString().split("T")[0]
      newFilters.endDate = endOfMonth.toISOString().split("T")[0]
    } else {
      if (!dateRange?.from && !dateRange?.to) {
        const { startDate, endDate, ...restExisting } = filters
        setFilters((prev) => ({ ...restExisting, ...newFilters }))
        return
      }
    }

    if (selectedTab === "all" && dateRange?.from && dateRange?.to) {
      newFilters.startDate = dateRange.from.toISOString().split("T")[0]
      newFilters.endDate = dateRange.to.toISOString().split("T")[0]
    } else if (
      dateRange?.from &&
      dateRange?.to &&
      selectedTab !== "today" &&
      selectedTab !== "week" &&
      selectedTab !== "month"
    ) {
      newFilters.startDate = dateRange.from.toISOString().split("T")[0]
      newFilters.endDate = dateRange.to.toISOString().split("T")[0]
    }

    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [selectedTab, dateRange])

  const handleFilterChange = (key: keyof IOrderFilter, value: string | undefined) => {
    if (value === "" || value === "all") {
      const newFilters = { ...filters }
      delete newFilters[key]
      setFilters({ ...newFilters, page: 1 })
    } else {
      setFilters({ ...filters, [key]: value, page: 1 })
    }
  }

  const handleViewOrder = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  }

  const handleChangeStatus = async () => {
    if (!selectedOrder || !statusToUpdate) return

    try {
      await updateOrderStatus.mutateAsync(
        {
          orderId: selectedOrder,
          payload: { status: statusToUpdate as any },
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật trạng thái đơn hàng thành công")
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["order", selectedOrder] })
            setIsStatusDialogOpen(false)
          },
        },
      )
    } catch (error) {
      toast.error("Cập nhật trạng thái đơn hàng thất bại")
    }
  }

  const handleCancelOrder = async () => {
    if (!orderToCancel) return

    try {
      await cancelOrder.mutateAsync(orderToCancel, {
        onSuccess: () => {
          toast.success("Hủy đơn hàng thành công")
          queryClient.invalidateQueries({ queryKey: ["orders"] })
          setIsConfirmCancelDialogOpen(false)
          if (selectedOrder === orderToCancel) {
            queryClient.invalidateQueries({ queryKey: ["order", selectedOrder] })
          }
        },
      })
    } catch (error) {
      toast.error("Hủy đơn hàng thất bại")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi })
  }

  const handleChangePage = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  function handleExportExcel() {
    if (!data?.data?.orders || data.data.orders.length === 0) {
      toast.warn("Không có dữ liệu để xuất.")
      return
    }
    const ordersToExport = data.data.orders
    const dateStr = format(new Date(), "yyyyMMdd")
    let fileNamePrefix = "orders_list"
    if (ordersToExport.length === 1 && ordersToExport[0].code) {
      fileNamePrefix = ordersToExport[0].code
    }
    const fileName = `${fileNamePrefix}_${dateStr}.xlsx`

    const formattedOrders = ordersToExport.map((order) => ({
      "Mã đơn hàng": order.code,
      "Khách hàng": order.customer?.fullName || order.shippingName || "N/A",
      "Số điện thoại": order.customer?.phoneNumber || order.shippingPhoneNumber || "N/A",
      "Ngày tạo": formatDate(order.createdAt),
      "Tổng tiền": formatCurrency(order.total),
      "Trạng thái đơn hàng": order.orderStatus, // Consider mapping to readable status like in Badge
      "Trạng thái thanh toán": order.paymentStatus, // Consider mapping to readable status
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedOrders)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Đơn hàng")
    XLSX.writeFile(workbook, fileName)
    toast.success(`Đã xuất file ${fileName} thành công!`)
  }

  function handleExportPDF() {
    if (!data?.data?.orders || data.data.orders.length === 0) {
      toast.warn("Không có dữ liệu để xuất.")
      return
    }
    const ordersToExport = data.data.orders
    const dateStr = format(new Date(), "yyyyMMdd")
    let fileNamePrefix = "orders_list"
    if (ordersToExport.length === 1 && ordersToExport[0].code) {
      fileNamePrefix = ordersToExport[0].code
    }
    const fileName = `${fileNamePrefix}_${dateStr}.pdf`

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    })

    const getOrderStatusLabelLocal = (status: string): string => {
      switch (status) {
        case "CHO_XAC_NHAN":
          return "Chờ xác nhận"
        case "CHO_GIAO_HANG":
          return "Chờ giao hàng"
        case "DANG_VAN_CHUYEN":
          return "Đang vận chuyển"
        case "DA_GIAO_HANG":
          return "Đã giao hàng"
        case "HOAN_THANH":
          return "Hoàn thành"
        case "DA_HUY":
          return "Đã hủy"
        default:
          return status
      }
    }

    const getPaymentStatusLabelLocal = (status: string): string => {
      switch (status) {
        case "PENDING":
          return "Chưa thanh toán"
        case "PARTIAL_PAID":
          return "Thanh toán một phần"
        case "PAID":
          return "Đã thanh toán"
        default:
          return status
      }
    }

    doc.setFontSize(18)
    doc.text("Danh sách Đơn hàng", 14, 22)
    doc.setFontSize(11)
    doc.setTextColor(100)

    const tableColumn = ["Mã đơn hàng", "Khách hàng", "Ngày tạo", "Tổng tiền", "Trạng thái ĐH", "Trạng thái TT"]
    const tableRows = ordersToExport.map((order) => [
      order.code || "N/A",
      order.customer?.fullName || order.shippingName || "N/A",
      formatDate(order.createdAt),
      formatCurrency(order.total),
      getOrderStatusLabelLocal(order.orderStatus),
      getPaymentStatusLabelLocal(order.paymentStatus),
    ])

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      didDrawCell: (data) => {
      },
      styles: {
        font: doc.getFont().fontName,
        fontSize: 9,
        cellPadding: 3,
        overflow: "linebreak",
        halign: "left",
      },
      columnStyles: {
        3: { halign: "right" }, // Align price column to right
        4: { halign: "center" }, // Center status columns
        5: { halign: "center" },
      },
    })

    doc.save(fileName)
    toast.success(`Đã xuất file ${fileName} thành công!`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="mb-0 md:mb-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">Quản lý đơn hàng</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <TabsList className="h-9">
                <TabsTrigger
                  value="all"
                  className="px-4 text-maintext/70"
                  onClick={() => {
                    setDateRange(undefined)
                    setSelectedTab("all")
                  }}
                >
                  Tất cả
                </TabsTrigger>
                <TabsTrigger
                  value="today"
                  className="px-4 text-maintext/70"
                  onClick={() => {
                    setDateRange(undefined)
                    setSelectedTab("today")
                  }}
                >
                  Hôm nay
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  className="px-4 text-maintext/70"
                  onClick={() => {
                    setDateRange(undefined)
                    setSelectedTab("week")
                  }}
                >
                  Tuần này
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className="px-4 text-maintext/70"
                  onClick={() => {
                    setDateRange(undefined)
                    setSelectedTab("month")
                  }}
                >
                  Tháng này
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
              <div className="relative w-full md:w-96">
                <Icon
                  path={mdiMagnify}
                  size={0.7}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext"
                />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn, tên khách hàng, số điện thoại..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal text-primary",
                        !dateRange && "text-muted-foreground",
                      )}
                    > 
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span className="text-primary">Chọn khoảng thời gian</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="outline" className="flex items-center" onClick={() => setShowFilters(!showFilters)}>
                  <Icon path={mdiFilterOutline} size={0.7} className="mr-2" />
                  {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                </Button>
                <div className="flex flex-col sm:flex-row gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Icon path={mdiFileExport} size={0.7} className="mr-2" />
                Xuất dữ liệu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportExcel}>Xuất Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>Xuất PDF</DropdownMenuItem>
              <DropdownMenuItem>In danh sách</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 border-t pt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Trạng thái đơn hàng</label>
                      <Select
                        value={filters.orderStatus || "all"}
                        onValueChange={(value) => handleFilterChange("orderStatus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tất cả trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả trạng thái</SelectItem>
                          <SelectItem value="CHO_XAC_NHAN">Chờ xác nhận</SelectItem>
                          <SelectItem value="CHO_GIAO_HANG">Chờ giao hàng</SelectItem>
                          <SelectItem value="DANG_VAN_CHUYEN">Đang vận chuyển</SelectItem>
                          <SelectItem value="DA_GIAO_HANG">Đã giao hàng</SelectItem>
                          <SelectItem value="HOAN_THANH">Hoàn thành</SelectItem>
                          <SelectItem value="DA_HUY">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Trạng thái thanh toán</label>
                      <Select
                        value={filters.paymentStatus || "all"}
                        onValueChange={(value) => handleFilterChange("paymentStatus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tất cả trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả trạng thái</SelectItem>
                          <SelectItem value="PENDING">Chưa thanh toán</SelectItem>
                          <SelectItem value="PARTIAL_PAID">Thanh toán một phần</SelectItem>
                          <SelectItem value="PAID">Đã thanh toán</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Khách hàng</label>
                      <Input
                        type="text"
                        value={filters.customer || ""}
                        onChange={(e) => handleFilterChange("customer", e.target.value)}
                        placeholder="Tìm theo tên khách hàng"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <TabsContent value="all" className="mt-0">
              {renderOrdersList()}
            </TabsContent>
            <TabsContent value="today" className="mt-0">
              {renderOrdersList()}
            </TabsContent>
            <TabsContent value="week" className="mt-0">
              {renderOrdersList()}
            </TabsContent>
            <TabsContent value="month" className="mt-0">
              {renderOrdersList()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <OrderDetailDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        orderId={selectedOrder}
        orderDetail={orderDetail?.data}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        onUpdateStatus={(orderId, status) => {
          setSelectedOrder(orderId)
          setStatusToUpdate(status)
          setIsStatusDialogOpen(true)
        }}
        onCancelOrder={(orderId) => {
          setOrderToCancel(orderId)
          setIsConfirmCancelDialogOpen(true)
        }}
      />

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={statusToUpdate} onValueChange={setStatusToUpdate}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CHO_XAC_NHAN">Chờ xác nhận</SelectItem>
                <SelectItem value="CHO_GIAO_HANG">Chờ giao hàng</SelectItem>
                <SelectItem value="DANG_VAN_CHUYEN">Đang vận chuyển</SelectItem>
                <SelectItem value="DA_GIAO_HANG">Đã giao hàng</SelectItem>
                <SelectItem value="HOAN_THANH">Hoàn thành</SelectItem>
                <SelectItem value="DA_HUY">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleChangeStatus}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmCancelDialogOpen} onOpenChange={setIsConfirmCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmCancelDialogOpen(false)}>
              Không
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder}>
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  function renderOrdersList() {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-[6px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (isError) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu đơn hàng. Vui lòng thử lại sau.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["orders"] })}
          >
            Thử lại
          </Button>
        </div>
      )
    }

    if (!data?.data.orders || data.data.orders.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-maintext">Không tìm thấy đơn hàng nào.</p>
        </div>
      )
    }

    return (
      <>
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Mã đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
                <TableHead className="hidden lg:table-cell">Loại đơn hàng</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead className="hidden md:table-cell">Trạng thái đơn hàng</TableHead>
                <TableHead className="hidden md:table-cell">Trạng thái thanh toán</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer?.fullName || order.shippingName}</div>
                      <div className="text-sm text-maintext italic">{order.customer?.phoneNumber === "0000000000" ? "Chưa có SĐT" : order.customer?.phoneNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <OrderTypeBadge orderCode={order.code} />
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <OrderStatusBadge status={order.orderStatus} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleViewOrder(order.id)}>
                        <Icon path={mdiEye} size={0.7} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={order.orderStatus === "DA_HUY" || order.orderStatus === "HOAN_THANH"}
                        onClick={() => {
                          setOrderToCancel(order.id)
                          setIsConfirmCancelDialogOpen(true)
                        }}
                      >
                        <Icon path={mdiDelete} size={0.7} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.data.pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleChangePage(Math.max(1, data.data.pagination.currentPage - 1))}
                disabled={data.data.pagination.currentPage === 1}
              >
                Trước
              </Button>
              {Array.from({ length: data.data.pagination.totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === data.data.pagination.currentPage ||
                    Math.abs(page - data.data.pagination.currentPage) <= 1,
                )
                .reduce((acc: (number | string)[], page, idx, arr) => {
                  if (idx > 0 && page - arr[idx - 1] > 1) {
                    acc.push("...")
                  }
                  acc.push(page)
                  return acc
                }, [])
                .map((page, index) =>
                  page === "..." ? (
                    <Button key={`ellipsis-${index}`} variant="outline" size="sm" disabled>
                      ...
                    </Button>
                  ) : (
                    <Button
                      key={`page-${page}`}
                      variant={data.data.pagination.currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChangePage(page as number)}
                    >
                      {page}
                    </Button>
                  ),
                )}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleChangePage(Math.min(data.data.pagination.totalPages, data.data.pagination.currentPage + 1))
                }
                disabled={data.data.pagination.currentPage === data.data.pagination.totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </>
    )
  }
}

const OrderStatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "CHO_XAC_NHAN":
        return { label: "Chờ xác nhận", className: "!bg-amber-50 !text-amber-500 !border-amber-500" }
      case "CHO_GIAO_HANG":
        return { label: "Chờ giao hàng", className: "!bg-blue-50 !text-blue-500 !border-blue-500" }
      case "DANG_VAN_CHUYEN":
        return { label: "Đang vận chuyển", className: "!bg-orange-50 !text-orange-500 !border-orange-500" }
      case "DA_GIAO_HANG":
        return { label: "Đã giao hàng", className: "!bg-green-50 !text-green-500 !border-green-500" }
      case "HOAN_THANH":
        return { label: "Hoàn thành", className: "!bg-green-50 !text-green-500 !border-green-500" }
      case "DA_HUY":
        return { label: "Đã hủy", className: "!bg-red-50 !text-red-500 !border-red-500" }
      default:
        return { label: "Không xác định", className: "!bg-gray-50 !text-maintext !border-gray-500" }
    }
  }

  const config = getStatusConfig(status)

  return <Badge className={config.className}>{config.label}</Badge>
}

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Chưa thanh toán", className: "!bg-yellow-50 !text-yellow-500 !border-yellow-500" }
      case "PARTIAL_PAID":
        return { label: "Thanh toán một phần", className: "!bg-blue-50 !text-blue-500 !border-blue-500" }
      case "PAID":
        return { label: "Đã thanh toán", className: "!bg-green-50 !text-green-500 !border-green-500" }
      default:
        return { label: "Không xác định", className: "!bg-gray-50 !text-maintext !border-gray-500" }
    }
  }

  const config = getStatusConfig(status)

  return <Badge className={config.className}>{config.label}</Badge>
}

const OrderTypeBadge = ({ orderCode }: { orderCode: string }) => {
  const getOrderType = (code: string) => {
    if (code && code.includes("POS")) {
      return { label: "Tại quầy", className: "!bg-purple-50 !text-purple-500 !border-purple-500" }
    } else if (code && code.includes("DH")) {
      return { label: "Online", className: "!bg-cyan-50 !text-cyan-500 !border-cyan-500" }
    } else {
      return { label: "Không xác định", className: "!bg-gray-50 !text-maintext !border-gray-500" }
    }
  }

  const config = getOrderType(orderCode)

  return <Badge className={config.className}>{config.label}</Badge>
}

type OrderDetailDialogProps = {
  isOpen: boolean
  onClose: () => void
  orderId: string | null
  orderDetail: any
  formatCurrency: (amount: number) => string
  formatDate: (dateString: string) => string
  onUpdateStatus: (orderId: string, status: string) => void
  onCancelOrder: (orderId: string) => void
}

const OrderDetailDialog = ({
  isOpen,
  onClose,
  orderId,
  orderDetail,
  formatCurrency,
  formatDate,
  onUpdateStatus,
  onCancelOrder,
}: OrderDetailDialogProps) => {
  if (!orderId || !orderDetail) return null

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "CASH":
        return "Tiền mặt"
      case "BANK_TRANSFER":
        return "Chuyển khoản ngân hàng"
      case "COD":
        return "Thanh toán khi nhận hàng"
      case "MIXED":
        return "Thanh toán nhiều phương thức"
      default:
        return "Không xác định"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Chi tiết đơn hàng: {orderDetail.orderNumber}</span>
            <div className="flex space-x-2">
              <a href={`/admin/orders/edit/${orderId}`}>
                <Button variant="outline" size="sm">
                  <Icon path={mdiPencil} size={0.7} className="mr-2" />
                  Chỉnh sửa
                </Button>
              </a>
              <Button variant="outline" size="sm">
                <Icon path={mdiPrinter} size={0.7} className="mr-2" />
                In đơn
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-maintext">Thông tin đơn hàng</h3>
                <div className="mt-2 rounded-[6px] border p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-maintext">Mã đơn hàng:</span>
                    <span className="text-sm font-medium">{orderDetail.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-maintext">Ngày tạo:</span>
                    <span className="text-sm font-medium">{formatDate(orderDetail.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-maintext">Trạng thái đơn hàng:</span>
                    <OrderStatusBadge status={orderDetail.orderStatus} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-maintext">Trạng thái thanh toán:</span>
                    <PaymentStatusBadge status={orderDetail.paymentStatus} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-maintext">Phương thức thanh toán:</span>
                    <span className="text-sm font-medium">{getPaymentMethodName(orderDetail.paymentMethod)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-maintext">Thông tin khách hàng</h3>
                <div className="mt-2 rounded-[6px] border p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-maintext">Tên khách hàng:</span>
                    <span className="text-sm font-medium">{orderDetail.customer?.fullName}</span>
                  </div>
                  {orderDetail.customer?.email && (
                    <div className="flex justify-between">
                      <span className="text-sm text-maintext">Email:</span>
                      <span className="text-sm font-medium">{orderDetail.customer.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-maintext">Số điện thoại:</span>
                    <span className="text-sm font-medium">{orderDetail.customer?.phoneNumber}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-maintext">Địa chỉ giao hàng</h3>
                <div className="mt-2 rounded-[6px] border p-4">
                  {orderDetail.shippingAddress ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{orderDetail.shippingAddress.name}</p>
                      <p className="text-sm">{orderDetail.shippingAddress.phoneNumber}</p>
                      <p className="text-sm">
                        {orderDetail.shippingAddress.specificAddress}, {orderDetail.shippingAddress.wardName},{" "}
                        {orderDetail.shippingAddress.districtName}, {orderDetail.shippingAddress.provinceName}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-maintext">Không có thông tin địa chỉ giao hàng</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-maintext">Sản phẩm đã đặt</h3>
                <div className="mt-2 rounded-[6px]">
                  <div className="max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead className="text-right">Đơn giá</TableHead>
                          <TableHead className="text-right">SL</TableHead>
                          <TableHead className="text-right">Tổng</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderDetail.items.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {item.product && item.product.imageUrl && (
                                  <div className="w-10 h-10 rounded border overflow-hidden bg-gray-100">
                                    <img
                                      src={item.product.imageUrl}
                                      alt={item.product.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium text-sm">{item.product?.name}</div>
                                  <div className="text-xs text-maintext">
                                    {item.variant?.colorName &&
                                      item.variant?.sizeName &&
                                      `${item.variant.colorName} / ${item.variant.sizeName}`}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-maintext">Tổng tiền</h3>
                <div className="mt-2 rounded-[6px] border p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-maintext">Tổng tiền hàng:</span>
                    <span className="text-sm font-medium">{formatCurrency(orderDetail.subTotal)}</span>
                  </div>
                  {orderDetail.voucher && (
                    <div className="flex justify-between">
                      <span className="text-sm text-maintext">Mã giảm giá ({orderDetail.voucher.code}):</span>
                      <span className="text-sm font-medium text-red-500">-{formatCurrency(orderDetail.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Tổng thanh toán:</span>
                    <span className="text-base font-bold">{formatCurrency(orderDetail.total)}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="w-full"
                    disabled={["DA_HUY", "HOAN_THANH"].includes(orderDetail.orderStatus)}
                    onClick={() => onUpdateStatus(orderId, orderDetail.orderStatus)}
                  >
                    Cập nhật trạng thái
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={["DA_HUY", "HOAN_THANH"].includes(orderDetail.orderStatus)}
                    onClick={() => onCancelOrder(orderId)}
                  >
                    Hủy đơn hàng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
