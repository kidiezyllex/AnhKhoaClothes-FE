"use client";

import { mdiAccount, mdiLogout, mdiViewDashboard } from "@mdi/js";
import { Icon } from "@mdi/react";
import { motion } from "framer-motion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/useUserContext";

const AccountDropdown = () => {
  const { isAuthenticated, logoutUser, profile } = useUser();
  const handleLogout = () => {
    logoutUser();
  };
  if (!isAuthenticated) {
    return (
      <a
        href="/auth/login"
        className="p-2 text-gray-700 hover:text-primary transition-colors"
      >
        <Icon path={mdiAccount} size={1} />
      </a>
    );
  }

  const getInitials = () => {
    const user = profile?.data?.user;
    const name = user?.name || user?.fullName || "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="ml-4">
          <Avatar className="h-8 w-8 border border-primary/20">
            <AvatarImage
              src={
                profile?.data?.user?.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                  profile?.data?.user?.name ||
                  profile?.data?.user?.fullName ||
                  "User"
                }`
              }
              alt={
                profile?.data?.user?.name ||
                profile?.data?.user?.fullName ||
                "User"
              }
            />
            <AvatarFallback>
              {(
                profile?.data?.user?.name ||
                profile?.data?.user?.fullName ||
                "U"
              ).charAt(0)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount asChild>
        <motion.div initial="hidden" animate="visible" exit="exit">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profile?.data?.user?.name ||
                  profile?.data?.user?.fullName ||
                  "Người dùng"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {profile?.data?.user?.email || ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <motion.div transition={{ delay: 0.05 }}>
            <DropdownMenuItem asChild>
              <a href="/account" className="flex items-center cursor-pointer">
                <Icon
                  path={mdiAccount}
                  size={0.8}
                  className="mr-2 text-gray-700"
                />
                <span className="!text-gray-700">Quản lý chung</span>
              </a>
            </DropdownMenuItem>
          </motion.div>

          {(profile?.data?.user?.role === "ADMIN" ||
            profile?.data?.user?.role === "STAFF" ||
            profile?.data?.user?.email === "adminallwear@gmail.com") && (
            <motion.div transition={{ delay: 0.07 }}>
              <DropdownMenuItem asChild>
                <a
                  href="/admin/statistics"
                  className="flex items-center cursor-pointer"
                >
                  <Icon
                    path={mdiViewDashboard}
                    size={0.8}
                    className="mr-2 text-gray-700"
                  />
                  <span className="!text-gray-700">Dashboard</span>
                </a>
              </DropdownMenuItem>
            </motion.div>
          )}
          <DropdownMenuSeparator />
          <motion.div transition={{ delay: 0.1 }}>
            <DropdownMenuItem
              className="text-rose-500 focus:text-rose-500 cursor-pointer"
              onClick={handleLogout}
            >
              <Icon path={mdiLogout} size={0.8} className="mr-2" />
              Đăng xuất
            </DropdownMenuItem>
          </motion.div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdown;
