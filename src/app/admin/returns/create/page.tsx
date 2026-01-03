"use client";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCreateReturn } from "@/hooks/return";
import { IReturnCreate } from "@/interface/request/return";
import { toast } from "react-toastify";
import { Icon } from "@mdi/react";
import {
  mdiArrowLeft,
  mdiPlus,
  mdiMinus,
  mdiAccountSearch,
  mdiPackageVariant,
} from "@mdi/js";
interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface Order {
  id: string;
  code: string;
  totalAmount: number;
  createdAt: string;
  status: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    code: string;
    images: string[];
  };
  variant: {
    colorId: string;
    sizeId: string;
    color?: { name: string };
    size?: { name: string };
  };
  quantity: number;
  price: number;
}

interface SelectedItem {
  product: string;
  variant: {
    colorId: string;
    sizeId: string;
  };
  quantity: number;
  maxQuantity: number;
  price: number;
  reason: string;
}

export default function CreateReturnPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createReturn = useCreateReturn();
  const navigate = useNavigate();

  const mockCustomers: Customer[] = [
    {
      id: "1",
      fullName: "Nguyễn Văn A",
      email: "a@example.com",
      phoneNumber: "0123456789",
    },
    {
      id: "2",
      fullName: "Trần Thị B",
      email: "b@example.com",
      phoneNumber: "0987654321",
    },
  ];

  const mockOrders: Order[] = [
    {
      id: "1",
      code: "ORD001",
      totalAmount: 1500000,
      createdAt: "2026-01-15T10:00:00Z",
      status: "HOAN_THANH",
      items: [
        {
          id: "1",
          product: {
            id: "p1",
            name: "Giày thể thao Prada",
            code: "Prada001",
            images: ["/placeholder.jpg"],
          },
          variant: {
            colorId: "red",
            sizeId: "42",
            color: { name: "Đỏ" },
            size: { name: "42" },
          },
          quantity: 2,
          price: 750000,
        },
      ],
    },
  ];

  useEffect(() => {
    // Mock customer search
    if (customerSearch.trim()) {
      const filtered = mockCustomers.filter(
        (customer) =>
          customer.fullName
            .toLowerCase()
            .includes(customerSearch.toLowerCase()) ||
          customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
          customer.phoneNumber.includes(customerSearch)
      );
      setCustomers(filtered);
    } else {
      setCustomers([]);
    }
  }, [customerSearch]);

  useEffect(() => {
    // Mock order loading
    if (selectedCustomer) {
      setOrders(mockOrders);
    } else {
      setOrders([]);
    }
  }, [selectedCustomer]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSelectedOrder(null);
    setSelectedItems([]);
    setCustomerSearch("");
    setCustomers([]);
  };

  const handleOrderSelect = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    setSelectedOrder(order || null);
    setSelectedItems([]);
  };

  const handleItemSelect = (item: OrderItem, checked: boolean) => {
    if (checked) {
      const newItem: SelectedItem = {
        product: item.product.id,
        variant: item.variant,
        quantity: 1,
        maxQuantity: item.quantity,
        price: item.price,
        reason: "",
      };
      setSelectedItems((prev) => [...prev, newItem]);
    } else {
      setSelectedItems((prev) =>
        prev.filter(
          (selected) =>
            !(
              selected.product === item.product.id &&
              selected.variant.colorId === item.variant.colorId &&
              selected.variant.sizeId === item.variant.sizeId
            )
        )
      );
    }
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    setSelectedItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: Math.max(1, Math.min(newQuantity, item.maxQuantity)),
            }
          : item
      )
    );
  };

  const handleReasonChange = (index: number, reason: string) => {
    setSelectedItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, reason } : item))
    );
  };

  const isItemSelected = (item: OrderItem) => {
    return selectedItems.some(
      (selected) =>
        selected.product === item.product.id &&
        selected.variant.colorId === item.variant.colorId &&
        selected.variant.sizeId === item.variant.sizeId
    );
  };

  const getTotalRefund = () => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || !selectedOrder || selectedItems.length === 0) {
      toast.error("Vui lòng chọn khách hàng, đơn hàng và sản phẩm cần trả");
      return;
    }

    const hasEmptyReason = selectedItems.some((item) => !item.reason.trim());
    if (hasEmptyReason) {
      toast.error("Vui lòng nhập lý do trả hàng cho tất cả sản phẩm");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: IReturnCreate = {
        originalOrder: selectedOrder.id,
        customer: selectedCustomer.id,
        items: selectedItems.map((item) => ({
          product: item.product,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
          reason: item.reason,
        })),
        totalRefund: getTotalRefund(),
      };

      await createReturn.mutateAsync(payload);
      toast.success("Tạo yêu cầu trả hàng thành công");
      navigate("/admin/returns");
    } catch (error) {
      toast.error("Tạo yêu cầu trả hàng thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <BreadcrumbLink href="/admin/returns">
                Quản lý trả hàng
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tạo yêu cầu trả hàng mới</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <a href="/admin/returns" className="mr-2">
          <Button variant="outline">
            <Icon path={mdiArrowLeft} size={0.7} className="mr-2" />
            Quay lại
          </Button>
        </a>
      </div>

      {/* Customer Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon path={mdiAccountSearch} size={1} />
            Chọn khách hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCustomer ? (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <h3 className="font-semibold">{selectedCustomer.fullName}</h3>
                <p className="text-sm text-maintext">
                  {selectedCustomer.email}
                </p>
                <p className="text-sm text-maintext">
                  {selectedCustomer.phoneNumber}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedCustomer(null)}
              >
                Thay đổi
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Tìm khách hàng theo tên, email hoặc số điện thoại..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>

              {customers.length > 0 && (
                <div className="border rounded-lg max-h-60 overflow-y-auto">
                  {customers.map((customer) => (
                    <div
                      key={customer.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      <h4 className="font-medium">{customer.fullName}</h4>
                      <p className="text-sm text-maintext">{customer.email}</p>
                      <p className="text-sm text-maintext">
                        {customer.phoneNumber}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Selection */}
      {selectedCustomer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon path={mdiPackageVariant} size={1} />
              Chọn đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedOrder ? (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <h3 className="font-semibold">#{selectedOrder.code}</h3>
                  <p className="text-sm text-maintext">
                    Ngày đặt: {formatDate(selectedOrder.createdAt)}
                  </p>
                  <p className="text-sm text-maintext">
                    Tổng tiền: {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-600 border-green-200 mt-1"
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                >
                  Thay đổi
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Select onValueChange={handleOrderSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn hàng đã hoàn thành..." />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        <div className="flex flex-col">
                          <span>#{order.code}</span>
                          <span className="text-sm text-maintext">
                            {formatDate(order.createdAt)} -{" "}
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Product Selection */}
      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Chọn sản phẩm cần trả</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={isItemSelected(item)}
                      onCheckedChange={(checked) =>
                        handleItemSelect(item, checked as boolean)
                      }
                    />
                    <img
                      src={item.product.images[0] || "/placeholder.jpg"}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-maintext">
                        SKU: {item.product.code}
                      </p>
                      <p className="text-sm text-maintext">
                        {item.variant.color?.name} - {item.variant.size?.name}
                      </p>
                      <p className="text-sm text-maintext">
                        Đã mua: {item.quantity} | Giá:{" "}
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  {isItemSelected(item) && (
                    <div className="mt-4 space-y-3 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Số lượng trả:
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const selectedIndex = selectedItems.findIndex(
                                  (selected) =>
                                    selected.product === item.product.id &&
                                    selected.variant.colorId ===
                                      item.variant.colorId &&
                                    selected.variant.sizeId ===
                                      item.variant.sizeId
                                );
                                if (selectedIndex !== -1) {
                                  handleQuantityChange(
                                    selectedIndex,
                                    selectedItems[selectedIndex].quantity - 1
                                  );
                                }
                              }}
                            >
                              <Icon path={mdiMinus} size={0.7} />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              max={item.quantity}
                              value={
                                selectedItems.find(
                                  (selected) =>
                                    selected.product === item.product.id &&
                                    selected.variant.colorId ===
                                      item.variant.colorId &&
                                    selected.variant.sizeId ===
                                      item.variant.sizeId
                                )?.quantity || 1
                              }
                              onChange={(e) => {
                                const selectedIndex = selectedItems.findIndex(
                                  (selected) =>
                                    selected.product === item.product.id &&
                                    selected.variant.colorId ===
                                      item.variant.colorId &&
                                    selected.variant.sizeId ===
                                      item.variant.sizeId
                                );
                                if (selectedIndex !== -1) {
                                  handleQuantityChange(
                                    selectedIndex,
                                    parseInt(e.target.value) || 1
                                  );
                                }
                              }}
                              className="w-20 text-center"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const selectedIndex = selectedItems.findIndex(
                                  (selected) =>
                                    selected.product === item.product.id &&
                                    selected.variant.colorId ===
                                      item.variant.colorId &&
                                    selected.variant.sizeId ===
                                      item.variant.sizeId
                                );
                                if (selectedIndex !== -1) {
                                  handleQuantityChange(
                                    selectedIndex,
                                    selectedItems[selectedIndex].quantity + 1
                                  );
                                }
                              }}
                            >
                              <Icon path={mdiPlus} size={0.7} />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Lý do trả hàng *
                        </label>
                        <Textarea
                          placeholder="Nhập lý do trả hàng..."
                          value={
                            selectedItems.find(
                              (selected) =>
                                selected.product === item.product.id &&
                                selected.variant.colorId ===
                                  item.variant.colorId &&
                                selected.variant.sizeId === item.variant.sizeId
                            )?.reason || ""
                          }
                          onChange={(e) => {
                            const selectedIndex = selectedItems.findIndex(
                              (selected) =>
                                selected.product === item.product.id &&
                                selected.variant.colorId ===
                                  item.variant.colorId &&
                                selected.variant.sizeId === item.variant.sizeId
                            );
                            if (selectedIndex !== -1) {
                              handleReasonChange(selectedIndex, e.target.value);
                            }
                          }}
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {selectedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt yêu cầu trả hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.map((item, index) => {
                  const orderItem = selectedOrder?.items.find(
                    (oi) =>
                      oi.product.id === item.product &&
                      oi.variant.colorId === item.variant.colorId &&
                      oi.variant.sizeId === item.variant.sizeId
                  );

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {orderItem?.product.name}
                          </p>
                          <p className="text-sm text-maintext">
                            {orderItem?.variant.color?.name} -{" "}
                            {orderItem?.variant.size?.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Tổng tiền hoàn trả:</span>
                <span className="text-primary">
                  {formatCurrency(getTotalRefund())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <a href="/admin/returns">
          <Button variant="outline" disabled={isSubmitting}>
            Hủy
          </Button>
        </a>
        <Button
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            !selectedCustomer ||
            !selectedOrder ||
            selectedItems.length === 0
          }
        >
          {isSubmitting ? "Đang tạo..." : "Tạo yêu cầu trả hàng"}
        </Button>
      </div>
    </div>
  );
}
