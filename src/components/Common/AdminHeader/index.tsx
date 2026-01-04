"use client";

import { useMenuSidebar } from "@/stores/useMenuSidebar";
import { IconLayoutSidebarRightExpandFilled } from "@tabler/icons-react";
import LanguageSelector from "./LanguageSelector";
import NotificationDropdown from "./NotificationDropdown";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

export default function AdminHeader() {
  const { toggle } = useMenuSidebar();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={toggle}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 mr-4"
        >
          <IconLayoutSidebarRightExpandFilled
            size={20}
            stroke={1.5}
            className="text-gray-700"
          />
        </button>
      </div>

      <div className="flex-1 flex justify-center">
        <SearchBar />
      </div>
      <div className="flex items-center space-x-4">
        <LanguageSelector />
        <NotificationDropdown />
        <UserMenu />
      </div>
    </header>
  );
}
