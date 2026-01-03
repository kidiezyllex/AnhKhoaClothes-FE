import React, { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@mdi/react";
import { Button } from "@/components/ui/button";

//                                                                                                                     Dữ liệu mẫu cho kết quả tìm kiếm
const searchResults = [
  {
    id: 1,
    name: "Prada Air Max 270",
    price: 3200000,
    category: "Giày thể thao",
  },
  {
    id: 2,
    name: "Uniqlo Ultraboost 21",
    price: 4500000,
    category: "Giày chạy bộ",
  },
  {
    id: 3,
    name: "Balenciaga RS-X³",
    price: 2800000,
    category: "Giày thời trang",
  },
  {
    id: 4,
    name: "New Balance 990v5",
    price: 4200000,
    category: "Giày thể thao",
  },
  {
    id: 5,
    name: "Chanel Chuck 70",
    price: 1800000,
    category: "Giày thời trang",
  },
];

//                                                                                                                     Format giá tiền theo VND
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const SearchBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredResults, setFilteredResults] = useState(searchResults);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim() === "") {
      setFilteredResults([]);
      return;
    }

    const filtered = searchResults.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.category.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredResults(filtered);
  };

  return (
    <div className="relative z-50">
      {/* Nút tìm kiếm */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-maintext hover:text-primary transition-colors"
      >
        <Icon path={mdiMagnify} size={1} />
      </Button>

      {/* Overlay tìm kiếm */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Hộp tìm kiếm */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed top-0 left-0 right-0 bg-white shadow-sm p-4 md:p-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-maintext">Tìm kiếm</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-maintext hover:text-maintext"
                >
                  <Icon path={mdiClose} size={1} />
                </Button>
              </div>

              <div className="relative">
                <div className="flex items-center border-b-2 border-primary focus-within:border-extra transition-colors">
                  <Icon
                    path={mdiMagnify}
                    size={1}
                    className="text-maintext mr-2"
                  />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm, danh mục..."
                    className="w-full py-3 outline-none text-maintext"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                  />
                </div>

                {searchValue.trim() !== "" && (
                  <div className="mt-6">
                    <h4 className="text-sm text-maintext mb-2">
                      Kết quả ({filteredResults.length})
                    </h4>

                    {filteredResults.length === 0 ? (
                      <p className="text-maintext italic">
                        Không tìm thấy kết quả nào phù hợp.
                      </p>
                    ) : (
                      <ul className="space-y-2 divide-y divide-gray-100">
                        {filteredResults.map((result) => (
                          <motion.li
                            key={result.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="py-3 hover:bg-gray-50 cursor-pointer px-2 rounded"
                          >
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium text-maintext">
                                  {result.name}
                                </p>
                                <span className="text-xs text-maintext">
                                  {result.category}
                                </span>
                              </div>
                              <span className="text-primary font-semibold">
                                {formatPrice(result.price)}
                              </span>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBox;
