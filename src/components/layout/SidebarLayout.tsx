import { useStableCallback } from "@/hooks/usePerformance";
import { MenuItem, SubMenuItem } from "@/interface/types";
import { cn } from "@/lib/utils";
import { useMenuSidebar } from "@/stores/useMenuSidebar";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import { Icon } from "@mdi/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { memo, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminHeader from "../Common/AdminHeader";
import { menuItems } from "./menuItems";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout = memo(function SidebarLayout({
  children,
}: SidebarLayoutProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [hoverMenu, setHoverMenu] = useState<string | null>(null);
  const location = useLocation();
  const pathname = location.pathname;
  const { isOpen } = useMenuSidebar();

  const toggleSubMenu = useStableCallback((menuId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  });

  const isMenuActive = useMemo(() => {
    const activeMenuCache = new Map<string, boolean>();
    return (menu: MenuItem) => {
      const cacheKey = `${menu.id}-${pathname}`;
      if (activeMenuCache.has(cacheKey)) {
        return activeMenuCache.get(cacheKey);
      }

      let isActive = false;
      if (menu.path && pathname === menu.path) {
        isActive = true;
      } else if (menu.subMenu) {
        isActive = menu.subMenu.some((sub) => pathname === sub.path);
      }

      activeMenuCache.set(cacheKey, isActive);
      return isActive;
    };
  }, [pathname]);

  const isSubMenuActive = useStableCallback((path: string) => {
    return pathname === path;
  });

  const handleMouseEnter = useStableCallback((menuId: string) => {
    if (!isOpen) {
      setHoverMenu(menuId);
    }
  });

  const handleMouseLeave = useStableCallback(() => {
    setHoverMenu(null);
  });

  // Memoize menu items to prevent unnecessary re-renders
  const memoizedMenuItems = useMemo(() => menuItems, []);

  return (
    <div className="flex flex-row min-h-screen w-screen">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white shadow-sm min-h-screen transition-all duration-300",
          isOpen ? "w-60 min-w-60" : "w-0 md:w-16 overflow-hidden"
        )}
      >
        <div className="flex flex-col h-full">
          <div
            className={cn(
              "p-4 border-b !max-h-16",
              isOpen ? "" : "justify-center"
            )}
          >
            {isOpen ? (
              <a href="/" className="flex items-center">
                <img
                  draggable="false"
                  src="/images/logo.svg"
                  alt="logo"
                  width={100}
                  height={100}
                  className="w-auto mx-auto h-10 select-none cursor-pointer"
                />
              </a>
            ) : (
              <h1 className="text-2xl text-white !font-bold select-none cursor-pointer text-center">
                AnhKhoaClothes
              </h1>
            )}
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className={cn("space-y-1", isOpen ? "px-2" : "px-1")}>
              {memoizedMenuItems.map((menu) => (
                <li key={menu.id}>
                  {menu.subMenu && isOpen ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleSubMenu(menu.id)}
                        className={cn(
                          "flex items-center font-medium justify-between w-full rounded-[6px] p-2 text-left text-base transition-colors",
                          isMenuActive(menu)
                            ? "bg-primary/10 text-primary !font-medium"
                            : "hover:bg-gray-100"
                        )}
                      >
                        <div className="flex items-center">
                          <Icon
                            path={menu.icon}
                            size={0.8}
                            className={cn(
                              "mr-2",
                              isMenuActive(menu)
                                ? "text-primary !font-medium"
                                : "text-gray-700"
                            )}
                          />
                          <span
                            className={cn(
                              "font-medium",
                              isMenuActive(menu)
                                ? "text-primary !font-medium"
                                : ""
                            )}
                          >
                            {menu.name}
                          </span>
                        </div>
                        <Icon
                          path={
                            openMenus[menu.id] ? mdiChevronUp : mdiChevronDown
                          }
                          size={0.8}
                          className="text-gray-700"
                        />
                      </button>
                      <AnimatePresence>
                        {openMenus[menu.id] && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 space-y-1 overflow-hidden"
                          >
                            {menu.subMenu.map((subItem: SubMenuItem) => (
                              <motion.li
                                key={subItem.id}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                <a href={subItem.path}>
                                  <div
                                    className={cn(
                                      "flex items-center rounded-[6px] p-2 text-base transition-colors font-medium",
                                      isSubMenuActive(subItem.path)
                                        ? "bg-active/10 text-active !font-medium"
                                        : "text-gray-700 hover:bg-gray-100"
                                    )}
                                  >
                                    {subItem.icon && (
                                      <Icon
                                        path={subItem.icon}
                                        size={0.8}
                                        className="mr-2 text-gray-700"
                                      />
                                    )}
                                    <span
                                      className={cn(
                                        "font-medium",
                                        isSubMenuActive(subItem.path)
                                          ? "text-active !font-medium"
                                          : ""
                                      )}
                                    >
                                      {subItem.name}
                                    </span>
                                  </div>
                                </a>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(menu.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <a href={menu.path}>
                        <div
                          className={cn(
                            "flex items-center rounded-[6px] p-2 text-base font-medium transition-colors ",
                            isMenuActive(menu)
                              ? "bg-primary/10 text-primary !font-medium"
                              : "text-gray-700 hover:bg-gray-100",
                            !isOpen && "justify-center"
                          )}
                        >
                          <Icon
                            path={menu.icon}
                            size={0.8}
                            className={cn(
                              isOpen ? "mr-2" : "mr-0",
                              isMenuActive(menu)
                                ? "text-primary !font-medium"
                                : "text-gray-700"
                            )}
                          />
                          {isOpen && <span>{menu.name}</span>}
                        </div>
                      </a>
                      {!isOpen && hoverMenu === menu.id && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            transition={{ duration: 0.2 }}
                            className="fixed ml-16 mt-[-30px] bg-white border border-primary/20 text-main-text text-xs py-1.5 px-3 rounded-[6px] shadow-light-grey z-50 whitespace-nowrap flex items-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span>
                            <span className="font-medium">{menu.name}</span>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      {/* Main content */}
      <div className="w-full flex-1 flex flex-col bg-[#1C2B38]">
        <AdminHeader />
        <main className="p-4 min-h-[calc(100vh-66px)]">
          <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
        </main>
      </div>
    </div>
  );
});

export default SidebarLayout;
