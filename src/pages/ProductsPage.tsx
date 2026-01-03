"use client";

import { useState, useEffect, useMemo, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@mdi/react";
import {
  mdiCartOutline,
  mdiHeartOutline,
  mdiEye,
  mdiFilterOutline,
  mdiClose,
  mdiMagnify,
  mdiPercent,
} from "@mdi/js";
import {
  useProducts,
  useSearchProducts,
  useBrands,
  useCategories,
  useColors,
  useSizes,
} from "@/hooks/product";
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
import { Skeleton } from "@/components/ui/skeleton";
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

interface ProductCardProps {
  product: any;
  onAddToCart: () => void;
  onQuickView: () => void;
  onAddToWishlist: () => void;
}

interface ProductFiltersProps {
  filters: IProductFilter;
  onChange: (filters: Partial<IProductFilter>) => void;
}
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

  const productQueryParams: IProductFilter = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      status: "ACTIVE",
      ...filters,
    }),
    [pagination.page, pagination.limit, filters]
  );

  const productsQuery = useProducts(productQueryParams);
  const searchQuery2 = useSearchProducts(
    isSearching
      ? {
          keyword: searchQuery,
          status: "ACTIVE",
          page: pagination.page,
          limit: pagination.limit,
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
          typeof product.brand === "object"
            ? (product.brand as any).id
            : product.brand;
        return brandsArray.includes(brandId);
      });
    }

    if (filters.categories && filters.categories.length > 0) {
      const categoriesArray = Array.isArray(filters.categories)
        ? filters.categories
        : [filters.categories];
      filteredProducts = filteredProducts.filter((product) => {
        const categoryId =
          typeof product.category === "object"
            ? (product.category as any).id
            : product.category;
        return categoriesArray.includes(categoryId);
      });
    }

    if (filters.color) {
      filteredProducts = filteredProducts.filter((product) =>
        product.variants.some((variant: any) => {
          const colorId = variant.color?.id || variant.colorId;
          return colorId === filters.color;
        })
      );
    }

    if (filters.size) {
      filteredProducts = filteredProducts.filter((product) =>
        product.variants.some((variant: any) => {
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
        let price = product.variants[0]?.price || 0;

        if (promotionsData?.data?.promotions) {
          const discount = calculateProductDiscount(
            product.id,
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

    const startIndex = (pagination.page - 1) * pagination.limit;

    const paginatedProducts = isBePaginated
      ? filteredProducts
      : filteredProducts.slice(startIndex, startIndex + pagination.limit);

    // Giữ nguyên thông tin phân trang từ API nhưng cập nhật theo dữ liệu client
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
        // Thêm các trường phẳng để tương thích với API mới
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

    const firstVariant = product.variants[0];

    if (firstVariant.stock === 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    // Calculate discount from promotions data if available
    let finalPrice = firstVariant.price;
    let originalPrice = undefined;
    let discountPercent = 0;
    let hasDiscount = false;

    // Check if promotions data is available and calculate discount
    if (promotionsData?.data?.promotions) {
      const discount = calculateProductDiscount(
        product.id,
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
      productId: product.id,
      name: product.productDisplayName || product.name,
      price: finalPrice,
      originalPrice: originalPrice,
      discountPercent: discountPercent,
      hasDiscount: hasDiscount,
      image:
        checkImageUrl(
          product.images?.[0] ||
            firstVariant.images?.[0]?.imageUrl ||
            firstVariant.images?.[0]
        ) || "",
      quantity: 1,
      slug: product.code,
      brand:
        typeof product.brand === "string" ? product.brand : product.brand?.name,
      size: firstVariant.size?.code || firstVariant.size?.name,
      colors: [firstVariant.color?.name || "Default"],
      stock: firstVariant.stock,
      // New variant information
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
    <div className="container mx-auto py-8 relative">
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
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5 ">
          <div className="bg-white rounded-[6px] shadow-sm border p-4 sticky top-20">
            <h2 className="font-medium mb-4">Bộ lọc sản phẩm</h2>
            <ProductFilters filters={filters} onChange={handleFilterChange} />

            {data && data.data.products && data.data.products.length > 0 && (
              <VoucherForm
                orderValue={data.data.products.reduce(
                  (sum, product) => sum + (product.variants[0]?.price || 0),
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
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex gap-2 flex-1">
              <Button
                variant="outline"
                onClick={toggleFilter}
                className="lg:hidden flex items-center gap-2"
              >
                <Icon path={mdiFilterOutline} size={0.7} />
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
                  className="pl-10"
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
              <SelectTrigger className="w-full sm:w-[200px]">
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

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(9)].map((_, index) => (
                <Card key={index} className="overflow-hidden h-full">
                  <div className="aspect-square w-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
            </div>
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
                    {filteredProducts.length}
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
                  />
                ))}
              </div>

              {/* Phân trang */}
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

                      // Hiển thị trang đầu
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

                      // Hiển thị dấu ... nếu cần
                      if (currentPage > 3) {
                        pages.push(
                          <PaginationItem key="start-ellipsis">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      // Hiển thị các trang gần currentPage
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

              <div className="lg:hidden mt-8 bg-white rounded-[6px] shadow-sm border p-4">
                <VoucherForm
                  orderValue={filteredProducts.reduce(
                    (sum, product) => sum + (product.variants[0]?.price || 0),
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

      <div className="fixed bottom-6 right-6 z-50 shadow-sm rounded-full bg-primary p-2 hover:bg-primary/80 transition-all duration-300">
        <CartIcon className="text-white" />
      </div>
    </div>
  );
}

const ProductCard = ({
  product,
  promotionsData,
  onAddToCart,
  onQuickView,
  onAddToWishlist,
}: ProductCardProps & { promotionsData?: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden border rounded-lg hover:shadow-2xl shadow-sm transition-all duration-500 h-full flex flex-col transform bg-white relative backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg z-10 pointer-events-none" />

        <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-t-2xl overflow-hidden">
          <a
            href={`/products/${(product.productDisplayName || product.name)
              .toLowerCase()
              .replace(/\s+/g, "-")}-${product.id}`}
            className="block"
          >
            <div className="aspect-square overflow-visible relative flex items-center justify-center">
              <motion.div className="w-full h-full relative z-20 bg-white">
                <img
                  src={
                    checkImageUrl(
                      product.images?.[0] ||
                        product.variants?.[0]?.images?.[0]?.imageUrl ||
                        product.variants?.[0]?.images?.[0]
                    ) || "/placeholder.svg"
                  }
                  alt={product.productDisplayName || product.name}
                  className="object-contain w-full h-full drop-shadow-2xl filter group-hover:brightness-110 transition-all duration-500 bg-white"
                />
              </motion.div>
            </div>
          </a>

          {/* Enhanced badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            {(() => {
              if (promotionsData?.data?.promotions && product.variants?.[0]) {
                const discount = calculateProductDiscount(
                  product.id,
                  product.variants[0].price,
                  promotionsData.data.promotions
                );

                if (discount.discountPercent > 0) {
                  return (
                    <motion.div
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 text-white text-xs font-bold px-3 rounded-full shadow-sm border border-white/50 backdrop-blur-sm animate-pulse flex-shrink-0 w-fit flex items-center justify-center gap-1"
                    >
                      💥
                      <span className="text-base">
                        -{discount.discountPercent}%
                      </span>
                    </motion.div>
                  );
                }
              }
              return null;
            })()}
            {/* Stock badge */}
            {(() => {
              const totalStock = product.variants.reduce(
                (sum: number, variant: any) => sum + (variant.stock || 0),
                0
              );
              if (totalStock === 0) {
                return (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border-2 border-white/50 backdrop-blur-sm"
                  >
                    Hết hàng
                  </motion.div>
                );
              } else if (totalStock <= 5) {
                return (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border-2 border-white/50 backdrop-blur-sm"
                  >
                    Sắp hết
                  </motion.div>
                );
              }
              return null;
            })()}
          </div>

          {/* Enhanced quick action buttons */}
          <motion.div
            className="absolute right-2 top-2 transform -translate-y-1/2 flex flex-col gap-4 z-50"
            initial={{ x: 60, opacity: 0 }}
            animate={{
              x: isHovered ? 0 : 60,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-primary hover:text-white shadow-sm border-0 hover:shadow-2xl transition-all duration-300 group/btn"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart();
                }}
                aria-label="Thêm vào giỏ hàng"
              >
                <Icon
                  path={mdiCartOutline}
                  size={0.7}
                  className="group-hover/btn:animate-bounce"
                />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-pink-500 hover:text-white shadow-sm border-0 hover:shadow-2xl transition-all duration-300 group/btn"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToWishlist();
                }}
                aria-label="Yêu thích"
              >
                <Icon
                  path={mdiHeartOutline}
                  size={0.7}
                  className="group-hover/btn:animate-pulse"
                />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-blue-500 hover:text-white shadow-sm border-0 hover:shadow-2xl transition-all duration-300 group/btn"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView();
                }}
                aria-label="Xem nhanh"
              >
                <Icon
                  path={mdiEye}
                  size={0.7}
                  className="group-hover/btn:animate-ping"
                />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="p-4 flex flex-col flex-grow bg-gray-100 border-t border-gray-100/50 relative">
          <span className="font-semibold text-base text-primary">
            {product.brand
              ? typeof product.brand === "string"
                ? product.brand
                : product.brand?.name
              : product.gender || product.masterCategory || "Product"}
          </span>
          <a
            href={`/products/${(product.productDisplayName || product.name)
              .toLowerCase()
              .replace(/\s+/g, "-")}-${product.id}`}
            className="hover:text-primary transition-colors group/link"
          >
            <h3 className="font-bold text-base mb-2 line-clamp-2 leading-tight group-hover:text-primary/90 transition-colors duration-300 text-maintext group-hover/link:underline decoration-primary/50 underline-offset-2">
              {product.productDisplayName || product.name}
            </h3>
          </a>

          <div>
            {product.variants &&
            product.variants.length > 0 &&
            product.variants[0]?.price ? (
              <div className="flex items-center justify-between">
                <motion.div
                  className="font-extrabold text-lg text-active"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {(() => {
                    // Calculate discount from promotions data if available
                    if (promotionsData?.data?.promotions) {
                      const discount = calculateProductDiscount(
                        product.id,
                        product.variants[0].price,
                        promotionsData.data.promotions
                      );

                      if (discount.discountPercent > 0) {
                        return formatPrice(discount.discountedPrice);
                      }
                    }

                    return formatPrice(product.variants[0]?.price || 0);
                  })()}
                </motion.div>
                {(() => {
                  if (promotionsData?.data?.promotions) {
                    const discount = calculateProductDiscount(
                      product.id,
                      product.variants[0].price,
                      promotionsData.data.promotions
                    );

                    if (discount.discountPercent > 0) {
                      return (
                        <div className="text-xs text-maintext line-through font-medium bg-gray-100 px-2 py-1 rounded-sm italic">
                          {formatPrice(discount.originalPrice)}
                        </div>
                      );
                    }
                  }
                  return null;
                })()}
              </div>
            ) : (
              <div className="text-sm text-maintext/60 italic">
                Price not available
              </div>
            )}

            {product.variants.length > 0 && (
              <div className="flex flex-col gap-1 items-start justify-start mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-maintext/70 font-semibold">
                    Màu sắc:
                  </span>
                  <div className="flex gap-1 text-sm items-center">
                    {Array.from(
                      new Set(
                        product.variants.map(
                          (v: any) => v.color?.id || v.colorId
                        )
                      )
                    )
                      .slice(0, 4)
                      .map((colorId, index: number) => {
                        const variant = product.variants.find(
                          (v: any) => (v.color?.id || v.colorId) === colorId
                        );
                        const color = variant?.color || {
                          code: "#000000",
                          name: "Unknown",
                        };

                        return (
                          <motion.div
                            key={index}
                            className="w-4 h-4 flex-shrink-0 rounded-full border-2 border-white shadow-sm ring-2 ring-gray-200 cursor-pointer"
                            style={{ backgroundColor: color.code }}
                            title={color.name}
                            whileHover={{ scale: 1.3, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                          />
                        );
                      })}

                    {Array.from(
                      new Set(
                        product.variants.map(
                          (v: any) => v.color?.id || v.colorId
                        )
                      )
                    ).length > 4 && (
                      <motion.span
                        className="text-xs border text-maintext ml-1 bg-gray-100 px-3 py-0.5 rounded-full font-medium"
                        whileHover={{ scale: 1.1 }}
                      >
                        +
                        {Array.from(
                          new Set(
                            product.variants.map(
                              (v: any) => v.color?.id || v.colorId
                            )
                          )
                        ).length - 4}
                      </motion.span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-maintext/70 font-semibold">
                    Kích thước:
                  </span>
                  <div className="flex gap-1 text-maintext text-sm">
                    {Array.from(
                      new Set(
                        product.variants.map((v: any) =>
                          v.size?.value
                            ? getSizeLabel(v.size.value)
                            : v.size?.code || v.size?.name || "Unknown"
                        )
                      )
                    ).join(", ")}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Decorative bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Card>
    </motion.div>
  );
};
const ProductFilters = ({ filters, onChange }: ProductFiltersProps) => {
  const { data: brandsData, isLoading: isLoadingBrands } = useBrands();
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();
  const { data: colorsData, isLoading: isLoadingColors } = useColors();
  const { data: sizesData, isLoading: isLoadingSizes } = useSizes();

  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    filters.brands
      ? Array.isArray(filters.brands)
        ? filters.brands[0]
        : filters.brands
      : undefined
  );

  useEffect(() => {
    if (filters.brands) {
      setSelectedBrand(
        Array.isArray(filters.brands) ? filters.brands[0] : filters.brands
      );
    } else {
      setSelectedBrand(undefined);
    }
  }, [filters.brands]);

  const handleBrandChange = (brandId: string) => {
    if (selectedBrand === brandId) {
      setSelectedBrand(undefined);
      onChange({ brands: undefined });
    } else {
      setSelectedBrand(brandId);
      onChange({ brands: brandId });
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    filters.categories
      ? Array.isArray(filters.categories)
        ? filters.categories[0]
        : filters.categories
      : undefined
  );

  useEffect(() => {
    if (filters.categories) {
      setSelectedCategory(
        Array.isArray(filters.categories)
          ? filters.categories[0]
          : filters.categories
      );
    } else {
      setSelectedCategory(undefined);
    }
  }, [filters.categories]);

  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(undefined);
      onChange({ categories: undefined });
    } else {
      setSelectedCategory(categoryId);
      onChange({ categories: categoryId });
    }
  };

  const handleColorChange = (colorId: string) => {
    onChange({
      color: filters.color === colorId ? undefined : colorId,
    });
  };
  const handleSizeChange = (sizeId: string) => {
    onChange({
      size: filters.size === sizeId ? undefined : sizeId,
    });
  };
  const brands = useMemo(() => {
    return brandsData?.data?.brands || [];
  }, [brandsData]);

  const categories = useMemo(() => {
    return categoriesData?.data?.categories || [];
  }, [categoriesData]);

  const colors = useMemo(() => {
    return colorsData?.data?.colors || [];
  }, [colorsData]);

  const sizes = useMemo(() => {
    const rawSizes = sizesData?.data?.sizes || [];
    return [...rawSizes].sort((a, b) => {
      const valA = parseFloat(a.name || "0");
      const valB = parseFloat(b.name || "0");
      return valA - valB;
    });
  }, [sizesData]);

  const priceRange = useMemo(() => {
    return { min: 0, max: 10000000 };
  }, []);

  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([filters.minPrice || priceRange.min, filters.maxPrice || priceRange.max]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePriceChange = (values: number[]) => {
    setSelectedPriceRange(values as [number, number]);

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Áp dụng thay đổi giá vào bộ lọc sau một khoảng thời gian ngắn (debouncing)
    timerRef.current = setTimeout(() => {
      onChange({
        minPrice: values[0],
        maxPrice: values[1],
      });
    }, 500);
  };

  const handleResetFilters = () => {
    setSelectedPriceRange([priceRange.min, priceRange.max]);
    setSelectedCategory(undefined);
    onChange({
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      color: undefined,
      size: undefined,
    });
    toast.info("Đã đặt lại bộ lọc");
  };

  if (
    isLoadingBrands ||
    isLoadingCategories ||
    isLoadingColors ||
    isLoadingSizes
  ) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Giá</h3>
        <div className="px-2">
          <Slider
            defaultValue={[priceRange.min, priceRange.max]}
            min={priceRange.min}
            max={priceRange.max}
            step={100000}
            value={selectedPriceRange}
            onValueChange={(value) =>
              handlePriceChange(value as [number, number])
            }
          />
          <div className="flex justify-between mt-2 text-sm text-maintext">
            <span>{formatPrice(selectedPriceRange[0])}</span>
            <span>{formatPrice(selectedPriceRange[1])}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Thương hiệu</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {brands.map((brand) => (
            <div key={(brand as any)?.id} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${(brand as any)?.id}`}
                checked={selectedBrand === (brand as any)?.id}
                onCheckedChange={() => handleBrandChange((brand as any)?.id)}
              />
              <label
                htmlFor={`brand-${(brand as any)?.id}`}
                className="text-sm"
              >
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Danh mục</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {categories.map((category) => (
            <div
              key={(category as any)?.id}
              className="flex items-center gap-2"
            >
              <Checkbox
                id={`category-${(category as any)?.id}`}
                checked={selectedCategory === (category as any)?.id}
                onCheckedChange={() =>
                  handleCategoryChange((category as any)?.id)
                }
              />
              <label
                htmlFor={`category-${(category as any)?.id}`}
                className="text-sm"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Màu sắc</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              className={`w-8 h-8 rounded-full border overflow-hidden relative transition-all duration-300 ${
                filters.color === color.id
                  ? "ring-2 ring-primary ring-offset-2"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.code }}
              title={color.name}
              onClick={() => handleColorChange(color.id)}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-3">Kích cỡ</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size.id}
              className={`px-2 py-1 border rounded text-sm transition-all duration-300 ${
                filters.size === size.id
                  ? "bg-primary text-white border-primary"
                  : "border-gray-300 hover:border-primary"
              }`}
              onClick={() => handleSizeChange(size.id)}
            >
              {size.name || size.id}
            </button>
          ))}
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleResetFilters}>
        Đặt lại
      </Button>
    </div>
  );
};
