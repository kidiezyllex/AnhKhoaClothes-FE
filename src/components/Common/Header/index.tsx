"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Dropdown } from "antd";
import Icon from "@mdi/react";
import { mdiMagnify, mdiChevronDown, mdiCart, mdiMenu, mdiCog } from "@mdi/js";
import { useUser } from "@/context/useUserContext";
import { logout } from "@/api/axios";
import { ItemType } from "antd/es/menu/interface";
import CartIcon from "@/components/ui/CartIcon";

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

const languages: LanguageOption[] = [
  { code: "vn", name: "Vietnamese", flag: "/images/vn-flag.png" },
  { code: "en", name: "English", flag: "/images/vn-flag.png" },
  { code: "cn", name: "中国人", flag: "/images/vn-flag.png" },
  { code: "kr", name: "한국인", flag: "/images/vn-flag.png" },
  { code: "id", name: "Indonesia", flag: "/images/vn-flag.png" },
  { code: "ru", name: "Русский", flag: "/images/vn-flag.png" },
];

const currencies: CurrencyOption[] = [
  { code: "USD", name: "U.S. Dollar", symbol: "$" },
  { code: "USD", name: "Vietnamese Dong", symbol: "₫" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

export function Header() {
  const { user } = useUser();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(
    languages[0]
  );
  const [currentCurrency, setCurrency] = useState<CurrencyOption>(
    currencies[0]
  );
  const cartItemCount = 0;
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLanguageChange = (language: LanguageOption) => {
    setCurrentLanguage(language);
    setMobileMenuOpen(false);
  };

  const handleCurrencyChange = (currency: CurrencyOption) => {
    setCurrency(currency);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchExpanded) setSearchExpanded(false);
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const languageMenu = (
    <ul className="bg-white !text-[#374151] py-2 rounded shadow-sm min-w-[200px]">
      {languages.map((language) => (
        <li
          key={language.code}
          onClick={() => handleLanguageChange(language)}
          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center ${
            language.code === currentLanguage.code ? "bg-gray-100" : ""
          }`}
        >
          <img
            src={language.flag}
            alt={language.name}
            className="object-contain mr-2"
            height={11}
            width={16}
          />
          <span>{language.name}</span>
        </li>
      ))}
    </ul>
  );

  const currencyMenu = (
    <ul className="bg-white !text-[#374151] py-2 rounded shadow-sm min-w-[200px]">
      {currencies.map((currency) => (
        <li
          key={currency.code}
          onClick={() => handleCurrencyChange(currency)}
          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
            currency.code === currentCurrency.code ? "bg-gray-100" : ""
          }`}
        >
          <span>
            {currency.name} {currency.symbol}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <header className="bg-[#232F3E] text-maintext px-4 py-2">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between gap-2">
          <a href="/" className="flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="Amazon"
              width={80}
              height={34}
              className="cursor-pointer"
            />
          </a>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-[550px]">
            <Input
              placeholder="Tôi đang tìm mua..."
              className="py-2 pr-10 h-[38px] rounded-sm w-full"
            />
            <div className="absolute right-0 top-0 h-full flex items-center justify-center bg-[#febd69] w-[45px] rounded-r-sm cursor-pointer">
              <Icon path={mdiMagnify} size={0.7} color="#E3E6E6" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {/* Language Selector */}
            <Dropdown
              menu={{ items: languageMenu as unknown as ItemType[] }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="flex items-center cursor-pointer px-2">
                <img
                  height={16}
                  width={24}
                  src={currentLanguage.flag}
                  alt={currentLanguage.name}
                  className="object-contain mr-1"
                />
                <span className="mr-1">{currentLanguage.name}</span>
                <Icon path={mdiChevronDown} size={0.7} />
              </div>
            </Dropdown>

            {/* User Account */}
            <a
              href="/auth/login"
              className="px-2"
              onClick={() => navigate("/seller/products/storehouse")}
            >
              <div className="flex flex-col">
                {!isMounted ? null : (
                  <>
                    {!user && (
                      <span className="text-xs text-maintext transition-all duration-300 cursor-pointer">
                        Xin chào. Đăng nhập
                      </span>
                    )}
                    {user && (
                      <span
                        onClick={() => navigate("/seller/products/storehouse")}
                        className="font-bold text-sm text-maintext hover:!text-white/80 transition-all duration-300"
                      >
                        Bảng điều khiển của tôi
                      </span>
                    )}
                    {!user && (
                      <span className="font-bold text-sm text-maintext hover:!text-white/80 transition-all duration-300">
                        Tài khoản và danh sách mong muốn
                      </span>
                    )}
                  </>
                )}
              </div>
            </a>
            {isMounted && user && (
              <div
                className="font-bold text-sm text-maintext cursor-pointer hover:!text-white/80 transition-all duration-300"
                onClick={() => logout()}
              >
                Đăng xuất
              </div>
            )}

            {/* Currency Selector */}
            <Dropdown
              menu={{ items: currencyMenu as unknown as ItemType[] }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="flex items-center cursor-pointer px-2">
                <span className="mr-1 text-maintext text-sm transition-all duration-300 hover:!text-white/80 font-bold">
                  {currentCurrency.name} {currentCurrency.symbol}
                </span>
                <Icon path={mdiChevronDown} size={0.7} />
              </div>
            </Dropdown>

            {/* Shopping Cart */}
            <div className="px-2">
              <CartIcon className="text-white" />
            </div>
          </nav>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="Amazon"
                width={60}
                height={25}
                className="cursor-pointer"
              />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSearch}
              className="text-gray-300 hover:text-white p-1"
              aria-label="Search"
            >
              <Icon path={mdiMagnify} size={0.7} />
            </button>
            <div className="p-1">
              <CartIcon className="text-white" />
            </div>
            <button
              onClick={toggleMobileMenu}
              className="mr-2 text-gray-300 hover:text-white"
              aria-label="Menu"
            >
              <Icon path={mdiCog} size={0.7} />
            </button>
          </div>
        </div>

        {/* Mobile Search - Expandable */}
        {searchExpanded && (
          <div className="md:hidden mt-2 relative">
            <Input
              placeholder="Tôi đang tìm mua..."
              className="py-1 pr-10 h-[34px] rounded-sm w-full"
              autoFocus
            />
            <div className="absolute right-0 top-0 h-full flex items-center justify-center bg-[#febd69] w-[40px] rounded-r-sm cursor-pointer">
              <Icon path={mdiMagnify} size={0.7} color="#E3E6E6" />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={toggleMobileMenu}
        >
          <div
            className="bg-[#232F3E] h-full w-[80%] max-w-[300px] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Account Section */}
            <div className="bg-[#37475A] p-4 text-white">
              {!isMounted ? null : (
                <>
                  {!user ? (
                    <div
                      onClick={() => {
                        setMobileMenuOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <h3 className="font-bold text-lg">Xin chào. Đăng nhập</h3>
                      <p className="text-sm">
                        Tài khoản và danh sách mong muốn
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div
                        onClick={() => {
                          navigate("/seller/products/storehouse");
                          setMobileMenuOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <h3 className="font-bold text-lg">
                          Xin chào, {user.username || "Người dùng"}
                        </h3>
                        <p className="text-sm">Bảng điều khiển của tôi</p>
                      </div>
                      <div
                        className="font-bold text-sm cursor-pointer hover:text-white/80"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Đăng xuất
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Language Selector */}
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-bold mb-2">Ngôn ngữ</h3>
              <ul className="space-y-2">
                {languages.map((language) => (
                  <li
                    key={language.code}
                    onClick={() => handleLanguageChange(language)}
                    className={`py-1 cursor-pointer flex items-center ${
                      language.code === currentLanguage.code
                        ? "text-white"
                        : "text-maintext"
                    }`}
                  >
                    <img
                      src={language.flag}
                      alt={language.name}
                      className="object-contain mr-2"
                      height={11}
                      width={16}
                    />
                    <span>{language.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Currency Selector */}
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-bold mb-2">Tiền tệ</h3>
              <ul className="space-y-2">
                {currencies.map((currency) => (
                  <li
                    key={currency.code}
                    onClick={() => handleCurrencyChange(currency)}
                    className={`py-1 cursor-pointer ${
                      currency.code === currentCurrency.code
                        ? "text-white"
                        : "text-maintext"
                    }`}
                  >
                    <span>
                      {currency.name} {currency.symbol}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation Links */}
            <div className="p-4">
              <a
                href="/cart"
                className="block py-2 text-white hover:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Icon path={mdiCart} size={0.7} className="mr-2" />
                  <span>Giỏ hàng ({cartItemCount})</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
