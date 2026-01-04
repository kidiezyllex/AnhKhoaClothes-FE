"use client";

import { useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateVoucher } from "@/hooks/voucher";
import { IVoucherCreate } from "@/interface/request/voucher";
import { mdiArrowLeft, mdiLoading } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialVoucher: IVoucherCreate = {
  code: "",
  name: "",
  discountType: "PERCENTAGE",
  discountValue: 0,
  quantity: 1,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    .toISOString()
    .split("T")[0],
  minOrderValue: 0,
  maxDiscount: undefined,
  status: "ACTIVE",
};

export default function CreateVoucherPage() {
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState<IVoucherCreate>(initialVoucher);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createVoucher = useCreateVoucher();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;

    if (type === "number") {
      parsedValue = value === "" ? 0 : parseFloat(value);
    }

    setVoucher({ ...voucher, [name]: parsedValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setVoucher({ ...voucher, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleDateChange = (name: string, value: string) => {
    setVoucher({ ...voucher, [name]: value });

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!voucher.code.trim()) {
      newErrors.code = "Mã voucher không được để trống";
    } else if (!/^[A-Z0-9_-]{3,20}$/.test(voucher.code)) {
      newErrors.code =
        "Mã voucher chỉ bao gồm chữ hoa, số, gạch dưới và gạch ngang (3-20 ký tự)";
    }

    if (!voucher.name.trim()) {
      newErrors.name = "Tên voucher không được để trống";
    }

    if (voucher.discountValue <= 0) {
      newErrors.discountValue = "Giá trị voucher phải lớn hơn 0";
    }

    if (voucher.discountType === "PERCENTAGE" && voucher.discountValue > 100) {
      newErrors.discountValue = "Phần trăm giảm giá không được vượt quá 100%";
    }

    if (voucher.quantity <= 0) {
      newErrors.quantity = "Số lượng voucher phải lớn hơn 0";
    }

    if (!voucher.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được để trống";
    }

    if (!voucher.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống";
    }

    if (
      voucher.startDate &&
      voucher.endDate &&
      new Date(voucher.startDate) > new Date(voucher.endDate)
    ) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if ((voucher.minOrderValue ?? 0) < 0) {
      newErrors.minOrderValue = "Giá trị đơn hàng tối thiểu không được âm";
    }

    if (
      voucher.discountType === "PERCENTAGE" &&
      voucher.maxDiscount !== undefined &&
      voucher.maxDiscount <= 0
    ) {
      newErrors.maxDiscount = "Giảm giá tối đa phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await createVoucher.mutateAsync(voucher, {
        onSuccess: (response) => {
          toast.success(response.message || "Tạo mã giảm giá thành công");
          navigate("/admin/discounts/vouchers");
        },
        onError: (error: any) => {
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else if (error?.message) {
            toast.error(error.message);
          } else {
            toast.error("Tạo mã giảm giá thất bại");
          }
        },
      });
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Tạo mã giảm giá thất bại");
      }
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
              <BreadcrumbLink href="/admin/discounts">
                Quản lý khuyến mãi
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/discounts/vouchers">
                Mã giảm giá
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Thêm mã giảm giá mới</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <Icon path={mdiArrowLeft} size={0.8} />
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin mã giảm giá</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">
                  Mã voucher <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="code"
                    name="code"
                    value={voucher.code}
                    onChange={handleInputChange}
                    placeholder="VD: SUMMER2026"
                    className={errors.code ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => {
                      function randomVoucherCode() {
                        const letters = Array.from({ length: 4 }, () =>
                          String.fromCharCode(
                            65 + Math.floor(Math.random() * 26)
                          )
                        ).join("");
                        const now = new Date();
                        let day, month;
                        do {
                          day = Math.floor(Math.random() * 31) + 1;
                          month = Math.floor(Math.random() * 12) + 1;
                        } while (
                          month < now.getMonth() + 1 ||
                          (month === now.getMonth() + 1 && day <= now.getDate())
                        );
                        const dayStr = day.toString().padStart(2, "0");
                        const monthStr = month.toString().padStart(2, "0");
                        return `${letters}${dayStr}${monthStr}`;
                      }
                      const code = randomVoucherCode();
                      setVoucher({ ...voucher, code, name: `Voucher ${code}` });
                      if (errors.code) setErrors({ ...errors, code: "" });
                    }}
                  >
                    Random voucher
                  </Button>
                </div>
                {errors.code && (
                  <p className="text-red-500 text-sm">{errors.code}</p>
                )}
                <p className="text-xs text-gray-700">
                  Mã voucher chỉ bao gồm chữ hoa, số, gạch dưới và gạch ngang
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên voucher <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={voucher.name}
                  onChange={handleInputChange}
                  placeholder="VD: Đợt khuyến mãi mùa hè 2026"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">
                  Loại voucher <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={voucher.discountType}
                  onValueChange={(value) =>
                    handleSelectChange("discountType", value)
                  }
                >
                  <SelectTrigger
                    id="discountType"
                    className={errors.discountType ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn loại voucher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">
                      Số tiền cố định (VNĐ)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.discountType && (
                  <p className="text-red-500 text-sm">{errors.discountType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Giá trị <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    min={0}
                    value={voucher.discountValue}
                    onChange={handleInputChange}
                    className={`${
                      errors.discountValue ? "border-red-500" : ""
                    } ${
                      voucher.discountType === "PERCENTAGE"
                        ? "rounded-r-none"
                        : ""
                    }`}
                  />
                  {voucher.discountType === "PERCENTAGE" && (
                    <div className="bg-gray-100 border border-l-0 px-3 py-2 rounded-r-md">
                      %
                    </div>
                  )}
                  {voucher.discountType === "FIXED_AMOUNT" && (
                    <div className="bg-gray-100 border border-l-0 px-3 py-2 rounded-r-md">
                      VNĐ
                    </div>
                  )}
                </div>
                {errors.discountValue && (
                  <p className="text-red-500 text-sm">{errors.discountValue}</p>
                )}
                <p className="text-xs text-gray-700">
                  {voucher.discountType === "PERCENTAGE"
                    ? "Phần trăm giảm giá (0-100%)"
                    : "Số tiền giảm giá cố định"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Số lượng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={1}
                  value={voucher.quantity}
                  onChange={handleInputChange}
                  className={errors.quantity ? "border-red-500" : ""}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">{errors.quantity}</p>
                )}
                <p className="text-xs text-gray-700">
                  Tổng số voucher có thể sử dụng
                </p>
              </div>

              {voucher.discountType === "PERCENTAGE" && (
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Giảm giá tối đa</Label>
                  <div className="flex items-center">
                    <Input
                      id="maxDiscount"
                      name="maxDiscount"
                      type="number"
                      min={0}
                      value={
                        voucher.maxDiscount === undefined
                          ? ""
                          : voucher.maxDiscount
                      }
                      onChange={handleInputChange}
                      className={`${
                        errors.maxDiscount ? "border-red-500" : ""
                      } rounded-r-none`}
                    />
                    <div className="bg-gray-100 border border-l-0 px-3 py-2 rounded-r-md">
                      VNĐ
                    </div>
                  </div>
                  {errors.maxDiscount && (
                    <p className="text-red-500 text-sm">{errors.maxDiscount}</p>
                  )}
                  <p className="text-xs text-gray-700">
                    Giới hạn số tiền giảm tối đa (để trống nếu không giới hạn)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="minOrderValue">
                  Giá trị đơn hàng tối thiểu
                </Label>
                <div className="flex items-center">
                  <Input
                    id="minOrderValue"
                    name="minOrderValue"
                    type="number"
                    min={0}
                    value={voucher.minOrderValue}
                    onChange={handleInputChange}
                    className={`${
                      errors.minOrderValue ? "border-red-500" : ""
                    } rounded-r-none`}
                  />
                  <div className="bg-gray-100 border border-l-0 px-3 py-2 rounded-r-md">
                    VNĐ
                  </div>
                </div>
                {errors.minOrderValue && (
                  <p className="text-red-500 text-sm">{errors.minOrderValue}</p>
                )}
                <p className="text-xs text-gray-700">
                  Giá trị đơn hàng tối thiểu để áp dụng voucher (0 = không giới
                  hạn)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={
                    typeof voucher.startDate === "string"
                      ? voucher.startDate
                      : voucher.startDate.toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                  className={errors.startDate ? "border-red-500" : ""}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={
                    typeof voucher.endDate === "string"
                      ? voucher.endDate
                      : voucher.endDate.toISOString().split("T")[0]
                  }
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  className={errors.endDate ? "border-red-500" : ""}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm">{errors.endDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={voucher.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger
                    id="status"
                    className={errors.status ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                    <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-sm">{errors.status}</p>
                )}
                <p className="text-xs text-gray-700">
                  Trạng thái của voucher (người dùng chỉ có thể sử dụng voucher
                  đang hoạt động)
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-4 py-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={createVoucher.isPending}
            >
              Hủy
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVoucher(initialVoucher)}
                disabled={createVoucher.isPending}
              >
                Đặt lại
              </Button>
              <Button type="submit" disabled={createVoucher.isPending}>
                {createVoucher.isPending ? (
                  <>
                    <Icon
                      path={mdiLoading}
                      size={0.8}
                      className="mr-2 animate-spin"
                    />
                    Đang xử lý...
                  </>
                ) : (
                  "Tạo mã giảm giá"
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
