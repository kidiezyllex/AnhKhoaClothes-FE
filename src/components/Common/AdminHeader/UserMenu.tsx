"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/useUserContext";
import { useUserProfile } from "@/hooks/account";
import {
  IconLock,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function UserMenu() {
  const { logoutUser } = useUser();
  const { data: profileData } = useUserProfile();
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    toast.success("Đăng xuất thành công");
    navigate("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage
            src={
              profileData?.data?.user?.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                profileData?.data?.user?.fullName ||
                profileData?.data?.user?.name ||
                "User"
              }`
            }
            alt={
              profileData?.data?.user?.fullName || profileData?.data?.user?.name
            }
          />
          <AvatarFallback>
            {(
              profileData?.data?.user?.fullName ||
              profileData?.data?.user?.name ||
              "U"
            ).charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profileData?.data?.user?.fullName ||
                profileData?.data?.user?.name}
            </p>
            <p className="text-xs leading-none text-gray-700">
              {profileData?.data?.user?.email}
            </p>
            <p className="text-xs leading-none text-primary mt-1">
              {profileData?.data?.user?.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconUser className="mr-2 h-4 w-4" />
            <span>Thông tin tài khoản</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconSettings className="mr-2 h-4 w-4" />
            <span>Cài đặt</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconLock className="mr-2 h-4 w-4" />
            <span>Đổi mật khẩu</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <IconLogout className="mr-2 h-4 w-4 text-red-600" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
