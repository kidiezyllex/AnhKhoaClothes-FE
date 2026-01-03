"use client"

import { useState, useEffect } from "react"
 
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from "@/context/useUserContext"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icon } from '@mdi/react'
import { mdiAccount, mdiAccountEdit, mdiShieldAccount, mdiMapMarker } from '@mdi/js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddressManager from "@/components/ProfilePage/AddressManager"
import { useUpdateUserProfile, useUserProfile } from "@/hooks/account"

const profileSchema = z.object({
  fullName: z.string().min(3, "Tên đầy đủ phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ").min(1, "Email không được để trống"),
  phoneNumber: z.string().optional(),
  avatar: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

function ProfileForm() {
  const { data: profileData, isLoading, refetch } = useUserProfile()
  const updateProfileMutation = useUpdateUserProfile()
  const { updateUserProfile } = useUser()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      avatar: "",
    },
  })

  useEffect(() => {
    if (profileData && profileData.data) {
      form.reset({
        fullName: profileData.data.fullName || "",
        email: profileData.data.email || "",
        phoneNumber: profileData.data.phoneNumber || "",
        avatar: profileData.data.avatar || "",
      })
    }
  }, [profileData, form])

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfileMutation.mutateAsync(data)
      toast.success("Cập nhật thành công")
      refetch()
    } catch (error: any) {
      console.error("Lỗi cập nhật:", error)
      toast.error("Cập nhật thất bại")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex justify-center mb-4">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarImage src={form.getValues("avatar") || undefined} alt="Avatar" />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {form.getValues("fullName")?.charAt(0)?.toUpperCase() || <Icon path={mdiAccount} size={1.5} />}
            </AvatarFallback>
          </Avatar>
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-maintext dark:text-gray-300 font-medium">Họ và tên</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nhập họ và tên của bạn"
                  {...field}
                  className="border-gray-300 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
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
              <FormLabel className="text-maintext dark:text-gray-300 font-medium">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  {...field}
                  disabled
                  className="border-gray-300 dark:border-gray-700 opacity-70 cursor-not-allowed"
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
              <FormLabel className="text-maintext dark:text-gray-300 font-medium">Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Nhập số điện thoại của bạn"
                  {...field}
                  className="border-gray-300 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            className="bg-primary hover:bg-secondary transition-all duration-300 text-base font-semibold w-full py-4"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật thông tin"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { profile, isAuthenticated } = useUser()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login")
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-maintext dark:text-white mb-2">Hồ sơ tài khoản</h1>
          <p className="text-maintext dark:text-maintext max-w-2xl">
            Quản lý thông tin cá nhân, địa chỉ và thay đổi mật khẩu của bạn
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Icon path={mdiAccountEdit} size={0.7} /> Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <Icon path={mdiMapMarker} size={0.7} /> Sổ địa chỉ
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Icon path={mdiShieldAccount} size={0.7} /> Bảo mật
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin cá nhân của bạn tại đây
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="addresses">
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle>Sổ địa chỉ</CardTitle>
                <CardDescription>
                  Quản lý danh sách địa chỉ nhận hàng của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddressManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle>Bảo mật tài khoản</CardTitle>
                <CardDescription>
                  Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <Icon path={mdiShieldAccount} size={3} className="text-primary mb-4 opacity-80" />
                  <h3 className="text-xl font-medium mb-2">Thay đổi mật khẩu tài khoản</h3>
                  <p className="text-maintext dark:text-maintext text-center mb-4 max-w-4xl">
                    Cập nhật mật khẩu mới để bảo vệ tài khoản của bạn khỏi các truy cập trái phép
                  </p>
                  <a href="/profile/change-password" className="bg-primary hover:bg-secondary transition-all duration-300">
                    <Button className="bg-primary hover:bg-secondary transition-all duration-300">
                      Đổi mật khẩu
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

export default ProfilePage
