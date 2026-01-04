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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/product";
import { useCreatePromotion } from "@/hooks/promotion";
import { IPromotionCreate } from "@/interface/request/promotion";
import { mdiArrowLeft, mdiInformation, mdiLoading } from "@mdi/js";
import { Icon } from "@mdi/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function CreatePromotionPage() {
  const navigate = useNavigate();
  const createPromotion = useCreatePromotion();
  const { data: productsData } = useProducts({ limit: 100, status: "ACTIVE" });

  const [formData, setFormData] = useState<IPromotionCreate>({
    name: "",
    description: "",
    discountValue: 0,
    discountType: "PERCENTAGE",
    applyTo: "ALL_PRODUCTS",
    productIds: [],
    startDate: "",
    endDate: "",
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [applyToAllProducts, setApplyToAllProducts] = useState(true);

  const handleInputChange = (field: keyof IPromotionCreate, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProductSelection = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleSelectAllProducts = (checked: boolean) => {
    setApplyToAllProducts(checked);
    if (checked) {
      setSelectedProducts([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên chiến dịch");
      return;
    }

    if (
      formData.discountType === "PERCENTAGE" &&
      (Number(formData.discountValue) <= 0 ||
        Number(formData.discountValue) > 100)
    ) {
      toast.error("Phần trăm giảm giá phải từ 1% đến 100%");
      return;
    }

    if (
      formData.discountType === "FIXED_AMOUNT" &&
      Number(formData.discountValue) <= 0
    ) {
      toast.error("Số tiền giảm giá phải lớn hơn 0");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc");
      return;
    }

    const now = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate <= now) {
      toast.error("Thời gian kết thúc phải sau thời điểm hiện tại");
      return;
    }

    if (startDate >= endDate) {
      toast.error("Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    const submitData: IPromotionCreate = {
      ...formData,
      applyTo: applyToAllProducts ? "ALL_PRODUCTS" : "SPECIFIC_PRODUCTS",
      productIds: applyToAllProducts ? [] : selectedProducts,
    };

    try {
      await createPromotion.mutateAsync(submitData, {
        onSuccess: () => {
          toast.success("Tạo chiến dịch khuyến mãi thành công");
          navigate("/admin/discounts/promotions");
        },
      });
    } catch (error) {
      toast.error("Tạo chiến dịch khuyến mãi thất bại");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
                Quản lý khuyến mãii
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/discounts/promotions">
                Chiến dịch khuyến mãi
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tạo mới</BreadcrumbPage>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Tạo chiến dịch khuyến mãi mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên chiến dịch *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nhập tên chiến dịch khuyến mãi"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discountType">Loại giảm giá</Label>
                      <Select
                        value={formData.discountType}
                        onValueChange={(value) =>
                          handleInputChange("discountType", value)
                        }
                      >
                        <SelectTrigger id="discountType">
                          <SelectValue placeholder="Chọn loại giảm giá" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENTAGE">
                            Phần trăm (%)
                          </SelectItem>
                          <SelectItem value="FIXED_AMOUNT">
                            Số tiền cố định (VND)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountValue">
                        {formData.discountType === "PERCENTAGE"
                          ? "Phần trăm giảm (%)"
                          : "Số tiền giảm (VND)"}{" "}
                        *
                      </Label>
                      <Input
                        id="discountValue"
                        type="number"
                        min="1"
                        value={formData.discountValue}
                        onChange={(e) =>
                          handleInputChange(
                            "discountValue",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder={
                          formData.discountType === "PERCENTAGE"
                            ? "Ví dụ: 10"
                            : "Ví dụ: 50000"
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Nhập mô tả cho chiến dịch khuyến mãi"
                  rows={3}
                />
              </div>

              {/* Thời gian */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Thời gian bắt đầu *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={
                      typeof formData.startDate === "string"
                        ? formData.startDate
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Thời gian kết thúc *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={
                      typeof formData.endDate === "string"
                        ? formData.endDate
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    min={
                      typeof formData.startDate === "string" &&
                      formData.startDate
                        ? formData.startDate
                        : new Date().toISOString().slice(0, 16)
                    }
                    required
                  />
                </div>
              </div>

              {/* Áp dụng sản phẩm */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Áp dụng cho sản phẩm
                </Label>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="applyToAll"
                    checked={applyToAllProducts}
                    onCheckedChange={handleSelectAllProducts}
                  />
                  <Label htmlFor="applyToAll" className="text-sm font-medium">
                    Áp dụng cho tất cả sản phẩm
                  </Label>
                </div>

                {!applyToAllProducts && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <div className="space-y-3">
                        {productsData?.data?.products?.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                          >
                            <Checkbox
                              id={`product-${product.id}`}
                              checked={selectedProducts.includes(
                                (product as any)?.id
                              )}
                              onCheckedChange={(checked) =>
                                handleProductSelection(
                                  (product as any)?.id,
                                  checked as boolean
                                )
                              }
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={`product-${product.id}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {product.name}
                              </Label>
                              <div className="text-xs text-gray-700">
                                Mã: {product.code} | Thương hiệu:{" "}
                                {typeof (product as any)?.brand === "string"
                                  ? (product as any)?.brand
                                  : (product as any)?.brand.name}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedProducts.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Đã chọn {selectedProducts.length} sản phẩm:
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedProducts.map((productId) => {
                            const product = productsData?.data?.products?.find(
                              (p) => p.id === productId
                            );
                            return product ? (
                              <Badge
                                key={productId}
                                variant="secondary"
                                className="text-xs"
                              >
                                {product.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Thông tin tóm tắt */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Icon
                      path={mdiInformation}
                      size={1}
                      className="text-blue-600 mt-0.5"
                    />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-900">
                        Tóm tắt chiến dịch
                      </h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p>
                          <strong>Tên:</strong> {formData.name || "Chưa nhập"}
                        </p>
                        <p>
                          <strong>Giảm giá:</strong>{" "}
                          {formData.discountType === "PERCENTAGE"
                            ? `${formData.discountValue}%`
                            : new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(Number(formData.discountValue))}
                        </p>
                        <p>
                          <strong>Thời gian:</strong>{" "}
                          {formData.startDate
                            ? new Date(formData.startDate).toLocaleString(
                                "vi-VN"
                              )
                            : "Chưa chọn"}{" "}
                          -{" "}
                          {formData.endDate
                            ? new Date(formData.endDate).toLocaleString("vi-VN")
                            : "Chưa chọn"}
                        </p>
                        <p>
                          <strong>Áp dụng:</strong>{" "}
                          {applyToAllProducts
                            ? "Tất cả sản phẩm"
                            : `${selectedProducts.length} sản phẩm được chọn`}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={createPromotion.isPending}
                  className="min-w-[120px]"
                >
                  {createPromotion.isPending ? (
                    <>
                      <Icon
                        path={mdiLoading}
                        size={0.8}
                        className="mr-2 animate-spin"
                      />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo chiến dịch"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
