"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@mdi/react";
import { mdiFilterMultiple, mdiClose, mdiMagnify } from "@mdi/js";
import { useProducts, useSearchProducts } from "@/hooks/product";
import { usePromotions } from "@/hooks/promotion";
import {
  applyPromotionsToProducts,
  calculateProductDiscount,
} from "@/lib/promotions";
import { getSizeLabel } from "@/utils/sizeMapping";
import type { IProductFilter } from "@/interface/request/product";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { checkImageUrl } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import VoucherForm from "@/components/ProductPage/VoucherForm";
import CartIcon from "@/components/ui/CartIcon";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ProductCard } from "@/components/ProductPage/ProductCard";
import { ProductFilters } from "@/components/ProductPage/ProductFilters";
import { ProductsListSkeleton } from "@/components/ProductPage/ProductsListSkeleton";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
  });
  const [filters, setFilters] = useState<IProductFilter>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
    voucherId: string;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchQuery) {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const productQueryParams: IProductFilter = useMemo(() => {
    const params: IProductFilter = {
      page: pagination.page,
      limit: pagination.limit,
      status: "ACTIVE",
      ...filters,
    };

    if (sortOption !== "default") {
      switch (sortOption) {
        case "price-asc":
          params.sortBy = "price";
          params.sortOrder = "asc";
          break;
        case "price-desc":
          params.sortBy = "price";
          params.sortOrder = "desc";
          break;
        case "newest":
          params.sortBy = "createdAt";
          params.sortOrder = "desc";
          break;
        case "popularity":
          params.sortBy = "stock";
          params.sortOrder = "desc";
          break;
      }
    }

    return params;
  }, [pagination.page, pagination.limit, filters, sortOption]);

  const productsQuery = useProducts(productQueryParams);
  const searchQuery2 = useSearchProducts(
    isSearching
      ? {
          keyword: searchQuery,
          status: "ACTIVE",
          page: pagination.page,
          limit: pagination.limit,
          sortBy: productQueryParams.sortBy,
          sortOrder: productQueryParams.sortOrder,
        }
      : { keyword: "" }
  );
  const {
    data: rawData,
    isLoading,
    isError,
  } = isSearching ? searchQuery2 : productsQuery;
  const { data: promotionsData } = usePromotions({ status: "ACTIVE" });

  const data = useMemo(() => {
    if (!rawData || !rawData.data || !rawData.data.products) return rawData;
    let filteredProducts = [...rawData.data.products];
    if (promotionsData?.data?.promotions) {
      filteredProducts = applyPromotionsToProducts(
        filteredProducts,
        promotionsData.data.promotions
      );
    }

    // Apply filters after promotions
    if (filters.brands && filters.brands.length > 0) {
      const brandsArray = Array.isArray(filters.brands)
        ? filters.brands
        : [filters.brands];
      filteredProducts = filteredProducts.filter((product) => {
        const brandId =
          typeof (product as any)?.brand === "object"
            ? ((product as any)?.brand as any).id
            : (product as any)?.brand;
        return brandsArray.includes(brandId);
      });
    }

    if (filters.categories && filters.categories.length > 0) {
      const categoriesArray = Array.isArray(filters.categories)
        ? filters.categories
        : [filters.categories];
      filteredProducts = filteredProducts.filter((product) => {
        const categoryId =
          typeof (product as any)?.category === "object"
            ? ((product as any)?.category as any).id
            : (product as any)?.category;
        return categoriesArray.includes(categoryId);
      });
    }

    if (filters.color) {
      filteredProducts = filteredProducts.filter((product) =>
        (product as any)?.variants.some((variant: any) => {
          const colorId = variant.color?.id || variant.colorId;
          return colorId === filters.color;
        })
      );
    }

    if (filters.size) {
      filteredProducts = filteredProducts.filter((product) =>
        (product as any)?.variants.some((variant: any) => {
          const sizeId = variant.size?.id || variant.sizeId;
          return sizeId === filters.size;
        })
      );
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const minPrice = filters.minPrice !== undefined ? filters.minPrice : 0;
      const maxPrice =
        filters.maxPrice !== undefined
          ? filters.maxPrice
          : Number.POSITIVE_INFINITY;

      filteredProducts = filteredProducts.filter((product: any) => {
        let price = (product as any)?.variants[0]?.price || 0;

        if (promotionsData?.data?.promotions) {
          const discount = calculateProductDiscount(
            (product as any)?.id,
            price,
            promotionsData.data.promotions
          );

          if (discount.discountPercent > 0) {
            price = discount.discountedPrice;
          }
        }

        return price >= minPrice && price <= maxPrice;
      });
    }

    // Sắp xếp sản phẩm
    if (sortOption !== "default") {
      filteredProducts.sort((a: any, b: any) => {
        let priceA = a.variants[0]?.price || 0;
        let priceB = b.variants[0]?.price || 0;

        if (promotionsData?.data?.promotions) {
          const discountA = calculateProductDiscount(
            a.id,
            priceA,
            promotionsData.data.promotions
          );
          const discountB = calculateProductDiscount(
            b.id,
            priceB,
            promotionsData.data.promotions
          );

          if (discountA.discountPercent > 0) {
            priceA = discountA.discountedPrice;
          }
          if (discountB.discountPercent > 0) {
            priceB = discountB.discountedPrice;
          }
        }

        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        switch (sortOption) {
          case "price-asc":
            return priceA - priceB;
          case "price-desc":
            return priceB - priceA;
          case "newest":
            return dateB - dateA;
          case "popularity":
            const stockA = a.variants.reduce(
              (total: number, variant: any) => total + variant.stock,
              0
            );
            const stockB = b.variants.reduce(
              (total: number, variant: any) => total + variant.stock,
              0
            );
            return stockB - stockA;
          default:
            return 0;
        }
      });
    }

    // Tính toán phân trang - ưu tiên dữ liệu từ BE nếu có
    const isBePaginated =
      rawData.data.pages !== undefined || rawData.data.count !== undefined;

    const totalItems = isBePaginated
      ? rawData.data.count ?? filteredProducts.length
      : filteredProducts.length;

    const totalPages = isBePaginated
      ? rawData.data.pages ?? Math.ceil(totalItems / pagination.limit)
      : Math.ceil(totalItems / pagination.limit) || 1;

    const paginatedProducts = isBePaginated
      ? filteredProducts
      : filteredProducts.slice(
          (pagination.page - 1) * pagination.limit,
          pagination.page * pagination.limit
        );

    return {
      ...rawData,
      data: {
        ...rawData.data,
        products: paginatedProducts,
        pagination: {
          totalItems: totalItems,
          totalPages: totalPages,
          currentPage: pagination.page,
          limit: pagination.limit,
        },
        page: pagination.page,
        pages: totalPages,
        count: totalItems,
        perPage: pagination.limit,
      },
    };
  }, [rawData, filters, sortOption, pagination, promotionsData]);

  const handleFilterChange = (updatedFilters: Partial<IProductFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...updatedFilters,
    }));
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleAddToCart = (product: any) => {
    if (!product.variants?.[0]) return;

    const firstVariant = (product as any)?.variants[0];

    if (firstVariant.stock === 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    let finalPrice = firstVariant.price;
    let originalPrice = undefined;
    let discountPercent = 0;
    let hasDiscount = false;

    if (promotionsData?.data?.promotions) {
      const discount = calculateProductDiscount(
        (product as any)?.id,
        firstVariant.price,
        promotionsData.data.promotions
      );

      if (discount.discountPercent > 0) {
        finalPrice = discount.discountedPrice;
        originalPrice = discount.originalPrice;
        discountPercent = discount.discountPercent;
        hasDiscount = true;
      }
    }

    const cartItem = {
      id: firstVariant.id,
      productId: (product as any)?.id,
      name: (product as any)?.productDisplayName || (product as any)?.name,
      price: finalPrice,
      originalPrice: originalPrice,
      discountPercent: discountPercent,
      hasDiscount: hasDiscount,
      image:
        checkImageUrl(
          (product as any)?.images?.[0] ||
            firstVariant.images?.[0]?.imageUrl ||
            firstVariant.images?.[0]
        ) || "",
      quantity: 1,
      slug: (product as any)?.code,
      brand:
        typeof (product as any)?.brand === "string"
          ? (product as any)?.brand
          : (product as any)?.brand?.name,
      size: firstVariant.size?.code || firstVariant.size?.name,
      colors: [firstVariant.color?.name || "Default"],
      stock: firstVariant.stock,
      colorId: firstVariant.color?.id || firstVariant.colorId || "",
      sizeId: firstVariant.size?.id || firstVariant.sizeId || "",
      colorName: firstVariant.color?.name || "Default",
      sizeName: firstVariant.size?.value
        ? getSizeLabel(firstVariant.size.value)
        : firstVariant.size?.code || firstVariant.size?.name || "",
    };

    addToCart(cartItem, 1);
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
  };

  const handleQuickView = (product: any) => {
    window.location.href = `/products/${product.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-${product.id}`;
  };

  const handleAddToWishlist = (product: any) => {
    toast.success("Đã thêm sản phẩm vào danh sách yêu thích");
  };

  const handleApplyVoucher = (voucherData: {
    code: string;
    discount: number;
    voucherId: string;
  }) => {
    setAppliedVoucher(voucherData);
    toast.success(`Đã áp dụng mã giảm giá: ${voucherData.code}`);
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    toast.info("Đã xóa mã giảm giá");
  };

  const filteredProducts = useMemo(() => {
    if (!data || !data.data || !data.data.products) return [];
    return data.data.products;
  }, [data]);

  return (
    <div className="container mx-auto py-8 relative bg-[#EAEBF2]">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="!text-maintext hover:!text-maintext"
            >
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="!text-maintext hover:!text-maintext" />
          <BreadcrumbItem>
            <BreadcrumbPage className="!text-maintext hover:!text-maintext">
              Tất cả sản phẩm
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Filters - Mobile */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden w-full"
            >
              <div className="bg-white rounded-[6px] shadow-sm border p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-medium">Bộ lọc sản phẩm</h2>
                  <Button variant="ghost" size="sm" onClick={toggleFilter}>
                    <Icon path={mdiClose} size={0.7} />
                  </Button>
                </div>
                <ProductFilters
                  filters={filters}
                  onChange={handleFilterChange}
                  formatPrice={formatPrice}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Filters */}
        <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
          <div className="bg-white rounded-xl shadow-sm border border-white p-4 sticky top-20">
            <h2 className="font-semibold mb-4">Bộ lọc sản phẩm</h2>
            <ProductFilters
              filters={filters}
              onChange={handleFilterChange}
              formatPrice={formatPrice}
            />

            {data && data.data.products && data.data.products.length > 0 && (
              <VoucherForm
                orderValue={data.data.products.reduce(
                  (sum, product) =>
                    sum + ((product as any)?.variants[0]?.price || 0),
                  0
                )}
                onApplyVoucher={handleApplyVoucher}
                onRemoveVoucher={handleRemoveVoucher}
                appliedVoucher={appliedVoucher}
              />
            )}
          </div>
        </div>

        {/* Products */}
        <div className="w-full lg:w-3/4 xl:w-4/5">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex gap-2 flex-1">
              <Button
                variant="outline"
                onClick={toggleFilter}
                className="lg:hidden flex items-center gap-2"
              >
                <Icon path={mdiFilterMultiple} size={0.7} />
                Bộ lọc
              </Button>
              <div className="relative flex-1">
                <Icon
                  path={mdiMagnify}
                  size={0.7}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maintext"
                />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  className="pl-10 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select
              defaultValue="default"
              value={sortOption}
              onValueChange={setSortOption}
            >
              <SelectTrigger className="w-full sm:w-[200px] bg-white">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Mặc định</SelectItem>
                <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="popularity">Phổ biến nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products List */}
          {isLoading ? (
            <ProductsListSkeleton count={pagination.limit} />
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Đã xảy ra lỗi khi tải dữ liệu</p>
              <Button onClick={() => setPagination({ ...pagination })}>
                Thử lại
              </Button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-maintext font-semibold">
                  Tìm thấy{" "}
                  <span className="text-primary text-lg">
                    {data?.data?.count || filteredProducts.length}
                  </span>{" "}
                  sản phẩm
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    promotionsData={promotionsData}
                    onAddToCart={() => handleAddToCart(product)}
                    onQuickView={() => handleQuickView(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationPrevious
                      href="#"
                      disabled={
                        (data?.data?.pagination?.currentPage ||
                          data?.data?.page ||
                          1) <= 1
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        const currentPage =
                          data?.data?.pagination?.currentPage ||
                          data?.data?.page ||
                          1;
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                    />
                    {(() => {
                      const pages = [];
                      const totalPages =
                        data?.data?.pagination?.totalPages ||
                        data?.data?.pages ||
                        1;
                      const currentPage =
                        data?.data?.pagination?.currentPage ||
                        data?.data?.page ||
                        1;

                      if (totalPages > 0) {
                        pages.push(
                          <PaginationItem key={1}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === 1}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(1);
                              }}
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      if (currentPage > 3) {
                        pages.push(
                          <PaginationItem key="start-ellipsis">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      for (
                        let i = Math.max(2, currentPage - 1);
                        i <= Math.min(totalPages - 1, currentPage + 1);
                        i++
                      ) {
                        if (i !== 1 && i !== totalPages) {
                          pages.push(
                            <PaginationItem key={i}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === i}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(i);
                                }}
                              >
                                {i}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      }

                      if (currentPage < totalPages - 2) {
                        pages.push(
                          <PaginationItem key="end-ellipsis">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      if (totalPages > 1) {
                        pages.push(
                          <PaginationItem key={totalPages}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === totalPages}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(totalPages);
                              }}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      return pages;
                    })()}
                    <PaginationNext
                      href="#"
                      disabled={
                        (data?.data?.pagination?.currentPage ||
                          data?.data?.page ||
                          1) >=
                        (data?.data?.pagination?.totalPages ||
                          data?.data?.pages ||
                          1)
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        const totalPages =
                          data?.data?.pagination?.totalPages ||
                          data?.data?.pages ||
                          1;
                        const currentPage =
                          data?.data?.pagination?.currentPage ||
                          data?.data?.page ||
                          1;
                        if (currentPage < totalPages)
                          handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationContent>
                </Pagination>
              </div>

              {/* Mobile Voucher Form */}
              <div className="lg:hidden mt-8 bg-white rounded-[6px] shadow-sm border p-4">
                <VoucherForm
                  orderValue={filteredProducts.reduce(
                    (sum, product) =>
                      sum + ((product as any)?.variants[0]?.price || 0),
                    0
                  )}
                  onApplyVoucher={handleApplyVoucher}
                  onRemoveVoucher={handleRemoveVoucher}
                  appliedVoucher={appliedVoucher}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-maintext mb-4">Không tìm thấy sản phẩm nào</p>
              {(searchQuery || Object.keys(filters).length > 0) && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({});
                  }}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Icon */}
      <div className="fixed bottom-6 right-6 z-50 shadow-sm rounded-full bg-primary p-2 hover:bg-primary/80 transition-all duration-300">
        <CartIcon className="text-white" />
      </div>
    </div>
  );
}
