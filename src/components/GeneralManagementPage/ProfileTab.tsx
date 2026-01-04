"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/useUserContext";
import { useChangePassword, useUpdateUserProfile } from "@/hooks/account";
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  mdiAccountEdit,
  mdiContentSaveCheck,
  mdiLock,
  mdiShieldAccount,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schemas
const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Họ và tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10,11}$/, { message: "Số điện thoại không hợp lệ" })
    .optional()
    .or(z.literal("")),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    newPassword: z
      .string()
      .min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Mật khẩu xác nhận phải có ít nhất 6 ký tự" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const ProfileTab = () => {
  const { user } = useUser();
  const { showToast } = useToast();
  const updateProfileMutation = useUpdateUserProfile();
  const changePasswordMutation = useChangePassword();

  // Profile Form
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.name || user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  // Password Form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.name || user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    updateProfileMutation.mutate(
      {
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber || undefined,
      },
      {
        onSuccess: () => {
          showToast({
            title: "Cập nhật thành công",
            message: "Thông tin cá nhân đã được cập nhật",
            type: "success",
          });
        },
        onError: (error) => {
          showToast({
            title: "Lỗi",
            message: error.message || "Đã xảy ra lỗi khi cập nhật thông tin",
            type: "error",
          });
        },
      }
    );
  };

  const onPasswordSubmit = (values: z.infer<typeof passwordSchema>) => {
    changePasswordMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          showToast({
            title: "Thành công",
            message: "Đổi mật khẩu thành công",
            type: "success",
          });
          passwordForm.reset();
        },
        onError: (error) => {
          showToast({
            title: "Lỗi",
            message: error.message || "Đã xảy ra lỗi khi đổi mật khẩu",
            type: "error",
          });
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Icon path={mdiAccountEdit} size={1} className="text-primary" />
            <span>Thông tin cá nhân</span>
          </CardTitle>
          <CardDescription>
            Quản lý thông tin hồ sơ và thông tin liên lạc của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-8"
            >
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Avatar Column */}
                <div className="flex flex-col items-center space-y-4 lg:w-1/3">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-foreground rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <Avatar className="h-40 w-40 border-4 border-background relative">
                      <AvatarImage
                        src={
                          user?.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                            user?.name ||
                            user?.fullName ||
                            user?.email ||
                            "User"
                          }`
                        }
                        alt={user?.name || user?.fullName || "User"}
                      />
                      <AvatarFallback className="text-5xl font-bold bg-muted text-primary uppercase">
                        {(user?.name || user?.fullName || "U").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">
                      {user?.name || user?.fullName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Thành viên từ {new Date().getFullYear()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full max-w-[180px] rounded-full border-primary/20 hover:bg-primary/5 shadow-sm"
                    type="button"
                  >
                    Thay đổi ảnh đại diện
                  </Button>
                </div>

                {/* Fields Column */}
                <div className="flex-1 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={profileForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Họ và tên
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập họ và tên"
                              {...field}
                              className="bg-muted/30 focus-visible:ring-primary h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Số điện thoại
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập số điện thoại"
                              {...field}
                              className="bg-muted/30 focus-visible:ring-primary h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold opacity-70">
                          Địa chỉ Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập email"
                            {...field}
                            disabled
                            className="bg-muted/50 border-dashed cursor-not-allowed h-11"
                          />
                        </FormControl>
                        <FormDescription className="text-xs italic">
                          Email dùng để đăng nhập và không thể thay đổi
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4 gap-3">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => profileForm.reset()}
                      className="hover:bg-muted font-medium"
                    >
                      Hủy bỏ
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="gap-2 px-6 h-11 shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                      {updateProfileMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
                      ) : (
                        <Icon path={mdiContentSaveCheck} size={0.8} />
                      )}
                      Lưu thay đổi hồ sơ
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className="border-none shadow-md overflow-hidden">
        <div className="h-2 bg-extra/80"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Icon path={mdiShieldAccount} size={1} className="text-extra" />
            <span>Đổi mật khẩu</span>
          </CardTitle>
          <CardDescription>
            Đảm bảo tài khoản của bạn đang sử dụng một mật khẩu dài và ngẫu
            nhiên để giữ an toàn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Mật khẩu hiện tại
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-muted/30 h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Mật khẩu mới
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-muted/30 h-11"
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] leading-tight">
                        Ít nhất 6 ký tự
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Xác nhận lại
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-muted/30 h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-start">
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="gap-2 px-8 h-11 bg-extra hover:bg-extra/90 shadow-lg shadow-extra/20"
                >
                  {changePasswordMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
                  ) : (
                    <Icon path={mdiLock} size={0.8} />
                  )}
                  Cập nhật mật khẩu mới
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
