"use client";

import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import {
  useAccount,
  useUpdateAccount,
  useUpdateAccountStatus,
} from "@/hooks/account";
import {
  IAccountUpdate,
  IAccountStatusUpdate,
} from "@/interface/request/account";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@mdi/react";
import { mdiArrowLeft, mdiLoading } from "@mdi/js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EditAccountPage() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const { data: accountData, isLoading, error } = useAccount(id);
  const updateAccount = useUpdateAccount(id);
  const updateAccountStatus = useUpdateAccountStatus(id);

  const [formData, setFormData] = useState<IAccountUpdate>({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: undefined,
    status: "ACTIVE",
  });

  const [displayGender, setDisplayGender] = useState<string>("Khác"); // Default display value

  useEffect(() => {
    if (accountData?.data) {
      const account = accountData.data;
      const formGender =
        account.gender === "Nam"
          ? true
          : account.gender === "Nữ"
          ? false
          : undefined;

      setFormData({
        fullName: account.fullName,
        email: account.email,
        phoneNumber: account.phoneNumber,
        gender: formGender,
        birthday: account.birthday,
        citizenId: account.citizenId,
        avatar: account.avatar,
        status: account.status,
      });

      setDisplayGender(
        account.gender === "Nam"
          ? "Nam"
          : account.gender === "Nữ"
          ? "Nữ"
          : "Khác"
      );
    }
  }, [accountData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email || "")) {
      toast.error("Email không hợp lệ");
      return;
    }

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    try {
      await updateAccount.mutateAsync(
        {
          ...formData,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật tài khoản thành công");
          },
          onError: (error) => {
            toast.error(
              "Cập nhật tài khoản thất bại: " +
                (error.message || "Không xác định")
            );
          },
        }
      );
    } catch (error) {
      toast.error("Cập nhật tài khoản thất bại");
    }
  };

  const handleToggleStatus = async () => {
    const newStatus: IAccountStatusUpdate = {
      status: formData.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    };

    try {
      await updateAccountStatus.mutateAsync(newStatus, {
        onSuccess: () => {
          setFormData((prev) => ({ ...prev, status: newStatus.status }));
          toast.success(
            `Tài khoản đã được ${
              newStatus.status === "ACTIVE" ? "kích hoạt" : "vô hiệu hóa"
            }`
          );
        },
        onError: (error) => {
          toast.error(
            "Cập nhật trạng thái thất bại: " +
              (error.message || "Không xác định")
          );
        },
      });
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Icon
          path={mdiLoading}
          size={2}
          className="animate-spin text-primary"
        />
      </div>
    );
  }

  if (error || !accountData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-bold">Không thể tải thông tin tài khoản</h2>
        <p className="text-maintext">
          Có lỗi xảy ra: {error?.message || "Không tìm thấy tài khoản"}
        </p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          Quay lại
        </Button>
      </div>
    );
  }

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
              <BreadcrumbLink href="/admin/accounts">
                Quản lý tài khoản
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chỉnh sửa tài khoản</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <Icon path={mdiArrowLeft} size={0.7} />
          Quay lại
        </Button>
      </div>

      <div className="flex items-center space-x-4 bg-white p-8 rounded-[6px] shadow-sm">
        <Avatar className="w-24 h-24 border-2 border-primary">
          <AvatarImage src={formData.avatar} />
          <AvatarFallback className="text-2xl">
            {getInitials(formData.fullName || "")}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">{formData.fullName}</h2>
          <p className="text-maintext text-lg">
            {accountData.data.role === "ADMIN"
              ? "Quản trị viên"
              : accountData.data.role === "STAFF"
              ? "Nhân viên"
              : "Khách hàng"}
          </p>
          <div className="flex items-center pt-3">
            <Switch
              checked={formData.status === "ACTIVE"}
              onCheckedChange={handleToggleStatus}
              id="status"
              className="data-[state=checked]:bg-green-500"
            />
            <Label htmlFor="status" className="ml-3 text-sm font-medium">
              {formData.status === "ACTIVE"
                ? "Đang hoạt động"
                : "Không hoạt động"}
            </Label>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-[6px] shadow-sm"
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 bg-white"
        >
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="info" className="text-maintext">
              Thông tin cơ bản
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-maintext">
              Thông tin bổ sung
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Nhập email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Giới tính</Label>
                    <RadioGroup
                      value={displayGender}
                      onValueChange={(value) => {
                        setDisplayGender(value);
                        // Map display gender string to boolean/undefined for formData
                        const apiGender =
                          value === "Nam"
                            ? true
                            : value === "Nữ"
                            ? false
                            : undefined;
                        setFormData((prev) => ({ ...prev, gender: apiGender }));
                      }}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Nam" id="gender-nam" />
                        <Label htmlFor="gender-nam">Nam</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Nữ" id="gender-nu" />
                        <Label htmlFor="gender-nu">Nữ</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Khác" id="gender-khac" />
                        <Label htmlFor="gender-khac">Khác</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bổ sung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="citizenId">CCCD/CMND (Tuỳ chọn)</Label>
                    <Input
                      id="citizenId"
                      name="citizenId"
                      value={formData.citizenId || ""}
                      onChange={handleInputChange}
                      placeholder="Nhập số CCCD/CMND"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday">Ngày sinh</Label>
                    <Input
                      id="birthday"
                      name="birthday"
                      type="date"
                      value={
                        formData.birthday
                          ? typeof formData.birthday === "string"
                            ? formData.birthday.split("T")[0]
                            : formData.birthday.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar">URL Ảnh đại diện</Label>
                    <Input
                      id="avatar"
                      name="avatar"
                      value={formData.avatar || ""}
                      onChange={handleInputChange}
                      placeholder="Nhập URL ảnh đại diện"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={updateAccount.isPending}
            className="flex items-center gap-2"
          >
            {updateAccount.isPending ? (
              <>
                <Icon path={mdiLoading} size={0.7} className="animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
