"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@mdi/react';
import {
    mdiAccount,
    mdiLogout,
    mdiViewDashboard
} from '@mdi/js';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/context/useUserContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const dropdownAnimation = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -5, transition: { duration: 0.1 } }
};

const itemAnimation = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 }
};
const AccountDropdown = () => {
    const { isAuthenticated, logoutUser, profile } = useUser();
    const handleLogout = () => {
        logoutUser();
    };
    if (!isAuthenticated) {
        return (
            <a href="/auth/login" className="p-2 text-maintext hover:text-primary transition-colors">
                <Icon path={mdiAccount} size={1} />
            </a>
        );
    }

    const getInitials = () => {
        const name = profile?.data?.fullName || "U";
        return name.charAt(0).toUpperCase();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="ml-4">
                    <Avatar className="h-8 w-8 border border-primary/20">
                        <AvatarImage src={profile?.data?.avatar || ""} alt={profile?.data?.fullName || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">{getInitials()}</AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount asChild>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{profile?.data?.fullName || "Người dùng"}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {profile?.data?.email || ""}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <motion.div transition={{ delay: 0.05 }}>
                        <DropdownMenuItem asChild>
                            <a href="/account" className="flex items-center cursor-pointer">
                                <Icon path={mdiAccount} size={0.7} className="mr-2 text-maintext" />
                               <span className='!text-maintext'>Quản lý chung</span>
                            </a>
                        </DropdownMenuItem>
                    </motion.div>

                    {profile?.data?.role === "ADMIN" && (
                        <motion.div transition={{ delay: 0.07 }}>
                            <DropdownMenuItem asChild>
                                <a href="/admin/statistics" className="flex items-center cursor-pointer">
                                    <Icon path={mdiViewDashboard} size={0.7} className="mr-2 text-maintext" />
                                    <span className='!text-maintext'>Dashboard</span>
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
                            <Icon path={mdiLogout} size={0.7} className="mr-2" />
                            Đăng xuất
                        </DropdownMenuItem>
                    </motion.div>
                </motion.div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AccountDropdown; 