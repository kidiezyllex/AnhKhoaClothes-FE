"use client";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCartStore } from "@/stores/useCartStore";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { checkImageUrl } from "@/lib/utils";
import { formatPrice } from "@/utils/formatters";
import { useCreateOrder } from "@/hooks/order";
import { useUser } from "@/context/useUserContext";
import { useCreateNotification } from "@/hooks/notification";
import { useUserProfile } from "@/hooks/account";
import VNPayModal from "@/components/VNPayPayment/VNPayModal";
import SuccessModal from "@/components/OrderSuccess/SuccessModal";
import React from "react";
import { getSizeLabel } from "@/utils/sizeMapping";

const shippingFormSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  ward: z.string().min(1, "Vui lòng chọn phường/xã"),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"]),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;

interface Province {
  code: number;
  name: string;
  districts?: District[];
}

interface District {
  code: number;
  name: string;
  province_code: number;
  wards?: Ward[];
}

interface Ward {
  code: number;
  name: string;
  district_code: number;
}

export default function ShippingPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    items,
    clearCart,
    appliedVoucher,
    voucherDiscount,
    removeVoucher,
    subtotal: storeSubtotal,
    tax: storeTax,
    shipping: storeShipping,
    total: storeTotal,
  } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showVNPayModal, setShowVNPayModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [vnpayOrderData, setVnpayOrderData] = useState<any>(null);

  // Location data states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedWardName, setSelectedWardName] = useState("");

  const createOrderMutation = useCreateOrder();
  const createNotificationMutation = useCreateNotification();
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      province: "",
      district: "",
      ward: "",
      paymentMethod: "COD",
    },
  });

  // Use values from store (which already include voucher calculations)
  const subtotal = storeSubtotal;
  const tax = storeTax;
  const shipping = storeShipping;
  const total = storeTotal;

  // Watch province and district changes to load dependent data
  const selectedProvince = form.watch("province");
  const selectedDistrict = form.watch("district");
  const selectedPaymentMethod = form.watch("paymentMethod");
  const selectedWard = form.watch("ward");

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await fetch("https://provinces.open-api.vn/api/");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        toast.error("Không thể tải danh sách tỉnh/thành");
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          setLoadingDistricts(true);
          const response = await fetch(
            `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
          );
          const data = await response.json();
          setDistricts(data.districts || []);
          // Reset district and ward when province changes
          form.setValue("district", "");
          form.setValue("ward", "");
          setWards([]);
        } catch (error) {
          toast.error("Không thể tải danh sách quận/huyện");
        } finally {
          setLoadingDistricts(false);
        }
      };

      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
      form.setValue("district", "");
      form.setValue("ward", "");
    }
  }, [selectedProvince, form]);

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          setLoadingWards(true);
          const response = await fetch(
            `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
          );
          const data = await response.json();
          setWards(data.wards || []);
          // Reset ward when district changes
          form.setValue("ward", "");
        } catch (error) {
          toast.error("Không thể tải danh sách phường/xã");
        } finally {
          setLoadingWards(false);
        }
      };

      fetchWards();
    } else {
      setWards([]);
      form.setValue("ward", "");
    }
  }, [selectedDistrict, form]);

  // Update form with user data when available
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.name || user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.addresses?.[0]?.specificAddress || "",
        province: user.addresses?.[0]?.provinceName || "",
        district: user.addresses?.[0]?.districtName || "",
        ward: user.addresses?.[0]?.wardName || "",
        paymentMethod: "COD",
      });
    }
  }, [user, form]);

  useEffect(() => {
    const checkCart = async () => {
      try {
        setIsLoading(true);

        if (items.length === 0) {
          navigate("/");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking cart:", error);
      }
    };

    checkCart();
  }, [items, navigate]);

  useEffect(() => {
    if (selectedPaymentMethod === "BANK_TRANSFER" && !showVNPayModal) {
      const demoOrderData = {
        orderId: `DEMO_${Date.now()}`,
        amount: total,
        orderInfo: `Thanh toán đơn hàng`,
        orderCode: `ORD${Date.now()}`,
      };
      setVnpayOrderData(demoOrderData);
      setShowVNPayModal(true);
    }
  }, [selectedPaymentMethod]);

  // Cập nhật selectedProvinceName khi selectedProvince thay đổi
  useEffect(() => {
    if (selectedProvince) {
      const found = provinces.find(
        (p) => p.code.toString() === selectedProvince
      );
      setSelectedProvinceName(found ? found.name : "");
    } else {
      setSelectedProvinceName("");
    }
  }, [selectedProvince, provinces]);

  // Cập nhật selectedDistrictName khi selectedDistrict thay đổi
  useEffect(() => {
    if (selectedDistrict) {
      const found = districts.find(
        (d) => d.code.toString() === selectedDistrict
      );
      setSelectedDistrictName(found ? found.name : "");
    } else {
      setSelectedDistrictName("");
    }
  }, [selectedDistrict, districts]);

  // Cập nhật selectedWardName khi selectedWard thay đổi
  useEffect(() => {
    if (selectedWard) {
      const found = wards.find((w) => w.code.toString() === selectedWard);
      setSelectedWardName(found ? found.name : "");
    } else {
      setSelectedWardName("");
    }
  }, [selectedWard, wards]);

  const sendOrderConfirmationEmail = async (
    orderId: string,
    orderData: any,
    userEmail: string
  ) => {
    try {
      const itemsList = items
        .map(
          (item) =>
            `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${
            item.name
          } (${item.size || "N/A"})</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${
            item.quantity
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(
            item.price
          )}</td>
        </tr>`
        )
        .join("");

      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Xác nhận đơn hàng</h2>
          <p>Xin chào <strong>${orderData.shippingAddress.name}</strong>,</p>
          <p>Cảm ơn bạn đã đặt hàng tại Clothes Shop. Dưới đây là chi tiết đơn hàng của bạn:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0;">
            <p><strong>Mã đơn hàng:</strong> ${orderData.code || orderId}</p>
            <p><strong>Ngày đặt hàng:</strong> ${new Date().toLocaleDateString(
              "vi-VN"
            )}</p>
            <p><strong>Phương thức thanh toán:</strong> ${
              orderData.paymentMethod === "COD"
                ? "Thanh toán khi nhận hàng"
                : "Thanh toán qua VNPay"
            }</p>
          </div>
          
          <h3 style="color: #333;">Chi tiết sản phẩm</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                <th style="padding: 10px;">Số lượng</th>
                <th style="padding: 10px; text-align: right;">Giá</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Tạm tính:</td>
                <td style="padding: 10px; text-align: right;">${formatPrice(
                  subtotal + voucherDiscount
                )}</td>
              </tr>
              ${
                appliedVoucher && voucherDiscount > 0
                  ? `
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; color: #16a34a;">Giảm giá voucher (${
                  appliedVoucher.code
                }):</td>
                <td style="padding: 10px; text-align: right; color: #16a34a;">-${formatPrice(
                  voucherDiscount
                )}</td>
              </tr>
              `
                  : ""
              }
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Thuế:</td>
                <td style="padding: 10px; text-align: right;">${formatPrice(
                  tax
                )}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Phí vận chuyển:</td>
                <td style="padding: 10px; text-align: right;">${formatPrice(
                  shipping
                )}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Tổng cộng:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">${formatPrice(
                  total
                )}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 20px;">
            <h3 style="color: #333;">Thông tin giao hàng</h3>
            <p><strong>Người nhận:</strong> ${
              orderData.shippingAddress.name
            }</p>
            <p><strong>Số điện thoại:</strong> ${
              orderData.shippingAddress.phoneNumber
            }</p>
            <p><strong>Địa chỉ:</strong> ${
              orderData.shippingAddress.specificAddress
            }</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; color: #777;">
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline.</p>
            <p>© 2023 Clothes Shop. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      `;

      // Tạo thông báo email
      await createNotificationMutation.mutateAsync({
        type: "EMAIL",
        title: `Xác nhận đơn hàng ${orderData.code || orderId}`,
        content: emailContent,
        recipients: [userEmail, "buitranthienan1111@gmail.com"], // Email của người dùng và email test
        relatedTo: "ORDER",
        relatedId: orderId,
      });
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }
  };

  const onSubmit = async (values: ShippingFormValues) => {
    try {
      setIsProcessing(true);
      if (values.paymentMethod === "BANK_TRANSFER") {
        const demoOrderData = {
          orderId: `DEMO_${Date.now()}`,
          amount: total,
          orderInfo: `Thanh toán đơn hàng`,
          orderCode: `ORD${Date.now()}`,
        };

        setVnpayOrderData(demoOrderData);
        setShowVNPayModal(true);
        setIsProcessing(false);
        return;
      }

      const orderData = {
        orderId: `DH${new Date().getFullYear()}${Date.now()
          .toString()
          .slice(-6)}`,
        customerId: user?.id || "000000000000000000000000",
        items: items.map((item) => ({
          product: item.productId + "" || item.id + "",
          variant: {
            colorId: item.colorId,
            sizeId: item.sizeId,
          },
          quantity: item.quantity,
          price: item.price,
        })),
        voucher: appliedVoucher?.voucherId,
        subTotal: Number(subtotal.toFixed(2)),
        discount: Number(voucherDiscount.toFixed(2)),
        total: Number(total.toFixed(2)),
        shippingAddress: {
          name: values.fullName,
          phoneNumber: values.phoneNumber,
          provinceId: selectedProvince,
          districtId: selectedDistrict,
          wardId: selectedWard,
          specificAddress: `${values.address}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}, Việt Nam`,
        },
        paymentMethod: values.paymentMethod,
      };

      const response = await createOrderMutation.mutateAsync(orderData as any);
      if (response && response.success && response.data) {
        clearCart();
        if (appliedVoucher) {
          removeVoucher();
        }
        toast.success("Đặt hàng thành công!");

        await sendOrderConfirmationEmail(
          response.data.id,
          response.data,
          values.email
        );

        setOrderResult(response.data);
        setShowSuccessModal(true);
      } else {
        throw new Error(
          (response as any)?.message || "Đã xảy ra lỗi khi tạo đơn hàng"
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Đã có lỗi xảy ra khi tạo đơn hàng");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVNPaySuccess = async (paymentData: any) => {
    try {
      setShowVNPayModal(false);
      setIsProcessing(true);

      const formValues = form.getValues();

      const orderData = {
        orderId: `DH${new Date().getFullYear()}-${Date.now()
          .toString()
          .slice(-6)}`,
        customerId: user?.id || "000000000000000000000000",
        items: items.map((item) => ({
          product: item.productId || item.id, // Use productId if available, fallback to id
          variant: {
            colorId: item.colorId,
            sizeId: item.sizeId,
          },
          quantity: item.quantity,
          price: item.price,
        })),
        voucher: appliedVoucher?.voucherId,
        subTotal: Number(subtotal.toFixed(2)),
        discount: Number(voucherDiscount.toFixed(2)),
        total: Number(total.toFixed(2)),
        shippingAddress: {
          name: formValues.fullName,
          phoneNumber: formValues.phoneNumber,
          provinceId: selectedProvince,
          districtId: selectedDistrict,
          wardId: selectedWard,
          specificAddress: `${formValues.address}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}, Việt Nam`,
        },
        paymentMethod: "BANK_TRANSFER",
        paymentInfo: paymentData,
      };

      const response = await createOrderMutation.mutateAsync(orderData as any);
      if (response && response.success && response.data) {
        clearCart();
        if (appliedVoucher) {
          removeVoucher();
        }
        toast.success("Thanh toán và đặt hàng thành công!");
        await sendOrderConfirmationEmail(
          response.data.id,
          response.data,
          formValues.email
        );
        setOrderResult(response.data);
        setShowSuccessModal(true);
      } else {
        throw new Error(
          (response as any)?.message || "Đã xảy ra lỗi khi tạo đơn hàng"
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Đã có lỗi xảy ra sau khi thanh toán");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVNPayError = (error: string) => {
    setShowVNPayModal(false);
    toast.error(error);
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  // Helper function to check if field should be disabled
  const isFieldDisabled = (fieldName: keyof ShippingFormValues) => {
    if (!user) return false;

    switch (fieldName) {
      case "fullName":
        return !!(user.name || user.fullName);
      case "email":
        return !!user.email;
      case "phoneNumber":
        return !!user.phoneNumber;
      case "address":
        return !!user.addresses?.[0]?.specificAddress;
      case "province":
        return !!user.addresses?.[0]?.provinceName;
      case "district":
        return !!user.addresses?.[0]?.districtName;
      case "ward":
        return !!user.addresses?.[0]?.wardName;
      default:
        return false;
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8 flex items-center justify-center">
        <div>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 relative">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="!text-maintext hover:!text-maintext"
            >
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="!text-maintext hover:!text-maintext" />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/products"
              className="!text-maintext hover:!text-maintext"
            >
              Sản phẩm
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="!text-maintext hover:!text-maintext" />
          <BreadcrumbItem>
            <BreadcrumbPage className="!text-maintext hover:!text-maintext">
              Thanh toán đơn hàng
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-maintext">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-maintext font-semibold">
                          Họ tên
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nguyễn Văn A"
                            {...field}
                            disabled={isFieldDisabled("fullName")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-maintext font-semibold">
                          Số điện thoại
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isFieldDisabled("phoneNumber")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-maintext font-semibold">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ví dụ: example@gmail.com"
                            {...field}
                            disabled={isFieldDisabled("email")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-maintext font-semibold">
                          Tỉnh/Thành phố
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={
                              isFieldDisabled("province") || loadingProvinces
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  loadingProvinces
                                    ? "Đang tải..."
                                    : "Chọn tỉnh/thành phố"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem
                                  key={province.code}
                                  value={province.code.toString()}
                                >
                                  {province.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-maintext font-semibold">
                          Quận/Huyện
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={
                              isFieldDisabled("district") ||
                              !selectedProvince ||
                              loadingDistricts
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  !selectedProvince
                                    ? "Vui lòng chọn tỉnh/thành phố trước"
                                    : loadingDistricts
                                    ? "Đang tải..."
                                    : "Chọn quận/huyện"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {districts.map((district) => (
                                <SelectItem
                                  key={district.code}
                                  value={district.code.toString()}
                                >
                                  {district.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-maintext font-semibold">
                          Phường/Xã
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={
                              isFieldDisabled("ward") ||
                              !selectedDistrict ||
                              loadingWards
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={
                                  !selectedDistrict
                                    ? "Vui lòng chọn quận/huyện trước"
                                    : loadingWards
                                    ? "Đang tải..."
                                    : "Chọn phường/xã"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {wards.map((ward) => (
                                <SelectItem
                                  key={ward.code}
                                  value={ward.code.toString()}
                                >
                                  {ward.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-maintext font-semibold">
                          Địa chỉ cụ thể
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Số nhà, tên đường..."
                            {...field}
                            disabled={isFieldDisabled("address")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-maintext font-semibold">
                          Phương thức thanh toán
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={field.disabled}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn phương thức thanh toán" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="COD">
                                Thanh toán khi nhận hàng (COD)
                              </SelectItem>
                              <SelectItem value="BANK_TRANSFER">
                                Thanh toán qua VNPay
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleContinueShopping}
                      disabled={isProcessing}
                    >
                      Tiếp tục mua hàng
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Đang xử lý..." : "Hoàn tất đặt hàng"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded relative overflow-hidden">
                      <img
                        src={checkImageUrl(item.image)}
                        alt={item.name}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-maintext">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.brand}
                        {item.size &&
                          ` • Size ${getSizeLabel(Number(item.size))}`}
                      </p>
                      <div className="flex justify-between mt-2 text-maintext">
                        <span>x{item.quantity}</span>
                        <span className="text-maintext">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="flex justify-between w-full">
                <span className="text-muted-foreground font-semibold text-sm">
                  Tạm tính
                </span>
                <span className="text-maintext">
                  {formatPrice(subtotal + voucherDiscount)}
                </span>
              </div>

              {/* Hiển thị giảm giá từ voucher */}
              {appliedVoucher && voucherDiscount > 0 && (
                <div className="flex justify-between w-full text-green-600">
                  <span className="text-sm font-semibold">
                    Giảm giá voucher ({appliedVoucher.code})
                  </span>
                  <span>-{formatPrice(voucherDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between w-full">
                <span className="text-muted-foreground font-semibold text-sm">
                  Thuế
                </span>
                <span className="text-maintext">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between w-full">
                <span className="text-muted-foreground font-semibold text-sm">
                  Phí vận chuyển
                </span>
                <span className="text-maintext">{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between w-full text-base font-semibold text-maintext pt-2 border-t">
                <span>Tổng cộng</span>
                <span className="text-lg text-primary font-semibold">
                  {formatPrice(total)}
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* VNPay Payment Modal */}
      <VNPayModal
        isOpen={showVNPayModal}
        onClose={() => setShowVNPayModal(false)}
        orderData={
          vnpayOrderData || {
            orderId: `TEMP_${Date.now()}`,
            amount: total,
            orderInfo: `Thanh toán đơn hàng`,
            orderCode: `ORD${Date.now()}`,
          }
        }
        onPaymentSuccess={handleVNPaySuccess}
        onPaymentError={handleVNPayError}
      />

      {/* Success Modal */}
      {orderResult && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderId={orderResult.id}
          orderCode={orderResult.code}
        />
      )}
    </div>
  );
}
