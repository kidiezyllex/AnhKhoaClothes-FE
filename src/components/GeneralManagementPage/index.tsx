"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/context/useUserContext";
import {
  mdiAccountEdit,
  mdiChevronRight,
  mdiHanger,
  mdiKeyboardReturn,
  mdiOrderBoolAscending,
  mdiTicket,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { motion } from "framer-motion";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Import extracted tab components
import { OrdersTab } from "./OrdersTab";
import { ProfileTab } from "./ProfileTab";
import { ReturnsTab } from "./ReturnsTab";
import { SavedOutfitsTab } from "./SavedOutfitsTab";
import { VouchersTab } from "./VouchersTab";

export const AccountTabContext = createContext({
  activeTab: "profile",
  setActiveTab: (tab: string) => {},
});

export default function GeneralManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const { isAuthenticated, user, isLoadingProfile } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const updateActiveTabFromHash = () => {
      if (
        typeof window !== "undefined" &&
        window.location.hash === "#account-tabs"
      ) {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get("tab");

        const validTabs = [
          "profile",
          "settings",
          "orders",
          "vouchers",
          "returns",
          "outfits",
        ];

        if (tabParam && validTabs.includes(tabParam)) {
          setActiveTab(tabParam);
        } else {
          setActiveTab("profile");
        }
      }
    };
    updateActiveTabFromHash();
    window.addEventListener("hashchange", updateActiveTabFromHash);

    return () => {
      window.removeEventListener("hashchange", updateActiveTabFromHash);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isLoadingProfile) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, isLoadingProfile, navigate]);

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const tabs = [
    { title: "Thông tin cá nhân", icon: mdiAccountEdit, value: "profile" },
    { title: "Đơn hàng của bạn", icon: mdiOrderBoolAscending, value: "orders" },
    { title: "Trả hàng", icon: mdiKeyboardReturn, value: "returns" },
    { title: "Outfit đã lưu", icon: mdiHanger, value: "outfits" },
    { title: "Mã giảm giá", icon: mdiTicket, value: "vouchers" },
  ];

  return (
    <AccountTabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="container mx-auto py-8 relative">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="!text-gray-700 hover:!text-gray-700"
              >
                Trang chủ
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="!text-gray-700 hover:!text-gray-700" />
            <BreadcrumbItem>
              <BreadcrumbPage className="!text-gray-700 hover:!text-gray-700">
                Quản lý chung
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Sidebar */}
          <motion.div
            className="md:col-span-3"
            initial="hidden"
            animate="visible"
          >
            <Card className="sticky">
              <CardHeader>
                <CardTitle>Quản lý chung</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col" id="account-sidebar-tabs">
                  {tabs.map((tab) => (
                    <motion.div
                      key={tab.value}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a
                        href={`#account-tabs?tab=${tab.value}`}
                        data-value={tab.value}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-muted ${
                          activeTab === tab.value
                            ? "bg-muted text-primary font-medium"
                            : ""
                        }`}
                        onClick={() => {
                          setActiveTab(tab.value);
                          const el = document.getElementById("account-tabs");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <div className="flex items-center">
                          <Icon
                            path={tab.icon}
                            size={0.8}
                            className={`mr-3 text-gray-700 ${
                              activeTab === tab.value ? "text-primary" : ""
                            }`}
                          />
                          <span className="text-gray-700">{tab.title}</span>
                        </div>
                        {activeTab === tab.value && (
                          <Icon
                            path={mdiChevronRight}
                            size={0.8}
                            className="text-primary"
                          />
                        )}
                      </a>
                    </motion.div>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Area */}
          <motion.div
            className="md:col-span-9"
            initial="hidden"
            animate="visible"
            id="account-tabs"
          >
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="profile">
                {activeTab === "profile" && <ProfileTab />}
              </TabsContent>
              <TabsContent value="orders">
                {activeTab === "orders" && <OrdersTab />}
              </TabsContent>
              <TabsContent value="returns">
                {activeTab === "returns" && <ReturnsTab />}
              </TabsContent>
              <TabsContent value="outfits">
                {activeTab === "outfits" && userId && (
                  <SavedOutfitsTab userId={userId} />
                )}
              </TabsContent>
              <TabsContent value="vouchers">
                {activeTab === "vouchers" && <VouchersTab />}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </AccountTabContext.Provider>
  );
}
