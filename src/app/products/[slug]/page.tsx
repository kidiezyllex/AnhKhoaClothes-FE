"use client";

import React, { useState, useEffect, useMemo } from "react";
import CartIcon from "@/components/ui/CartIcon";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/ProductPage/ProductCard";

// Add custom styles for zoom cursor
const zoomStyles = `
  .cursor-zoom-in {
    cursor: zoom-in;
  }
  .cursor-zoom-in:hover {
    cursor: zoom-in;
  }
  .cursor-none {
    cursor: none !important;
  }
  .zoom-container:hover .zoom-lens {
    opacity: 1;
    transform: scale(1);
  }
  .zoom-preview {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  .zoom-lens {
    transition: all 0.1s ease-out;
    backdrop-filter: blur(1px);
  }
  .zoom-lens::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
    pointer-events: none;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = zoomStyles;
  document.head.appendChild(styleSheet);
}
import { useProductDetail, useProducts } from "@/hooks/product";
import { usePromotions } from "@/hooks/promotion";
import {
  calculateProductDiscount,
  formatPrice as formatPromotionPrice,
  applyPromotionsToProducts,
  filterActivePromotions,
} from "@/lib/promotions";
import { getSizeLabel } from "@/utils/sizeMapping";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@mdi/react";
import {
  mdiCartArrowRight,
  mdiHeartCircle,
  mdiShareVariant,
  mdiCheck,
  mdiChevronLeft,
  mdiChevronRight,
  mdiStar,
  mdiStarOutline,
  mdiTruck,
  mdiShield,
  mdiCreditCard,
  mdiRefresh,
  mdiRuler,
  mdiWeight,
  mdiPalette,
  mdiInformation,
  mdiCartPlus,
  mdiMagnify,
  mdiTagMultiple,
  mdiAutoFix,
  mdiEye,
  mdiAlphaSBox,
} from "@mdi/js";
import { IPromotionsResponse } from "@/interface/response/promotion";
import { ProductWithDiscount } from "@/lib/promotions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { checkImageUrl, calculateDiscountedPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/useCartStore";
import {
  IProduct,
  IBrand,
  ICategory,
  IPopulatedProductVariant,
  IProductImage,
} from "@/interface/response/product";
import { motion, AnimatePresence } from "framer-motion";
const ImageZoom = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsZooming(true);
    }
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentage position
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setMousePosition({ x: xPercent, y: yPercent });

    // Calculate lens position (centered on cursor)
    const lensSize = 150; // Size of the lens
    const lensX = Math.max(
      lensSize / 2,
      Math.min(rect.width - lensSize / 2, x)
    );
    const lensY = Math.max(
      lensSize / 2,
      Math.min(rect.height - lensSize / 2, y)
    );

    setLensPosition({ x: lensX, y: lensY });
  };

  const handleTouchStart = () => {
    if (isMobile) {
      setIsZooming(!isZooming);
    }
  };

  return (
    <div className="relative overflow-visible group zoom-container">
      {/* Main Image Container */}
      <div
        className={`relative ${className} transition-all duration-300 p-16 ${
          !isMobile && !isZooming ? "cursor-zoom-in" : ""
        } ${!isMobile && isZooming ? "cursor-none" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
      >
        <img
          src={src}
          alt={alt}
          draggable="false"
          className="object-contain p-4 transition-transform duration-300"
        />

        {/* Zoom Lens - Desktop only */}
        {isZooming && !isMobile && (
          <motion.div
            className="absolute pointer-events-none border-4 border-white rounded-full shadow-2xl z-30 overflow-hidden zoom-lens"
            style={{
              width: "150px",
              height: "150px",
              left: `${lensPosition.x - 75}px`,
              top: `${lensPosition.y - 75}px`,
              boxShadow:
                "0 0 0 2px rgba(59, 130, 246, 0.8), 0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Zoomed image inside the lens */}
            <div
              className="w-full h-full relative bg-white"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: "400%",
                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
            {/* Lens border effect */}
            <div className="absolute inset-2 border border-white/30 rounded-full pointer-events-none"></div>
          </motion.div>
        )}
      </div>
      {/* Mobile Zoom Overlay */}
      {isZooming && isMobile && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsZooming(false)}
        >
          <motion.div
            className="relative w-full max-w-lg aspect-square bg-white rounded-xl overflow-hidden"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={src}
              alt={alt}
              className="object-contain p-4"
              draggable="false"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-white/90 hover:bg-white"
              onClick={() => setIsZooming(false)}
            >
              ✕
            </Button>
            <div className="absolute bottom-4 left-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
              Nhấn để đóng
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Zoom hint for mobile */}
      {isMobile && (
        <motion.div
          className="absolute bottom-2 right-2 bg-primary/90 text-white px-2 py-1 rounded text-xs font-medium opacity-70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Icon path={mdiMagnify} size={0.7} className="inline mr-1" />
          Nhấn để phóng to
        </motion.div>
      )}

      {/* Zoom hint for desktop */}
      {!isMobile && !isZooming && (
        <motion.div
          className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-70 transition-opacity duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0, y: 0 }}
          whileHover={{ opacity: 0.7 }}
        >
          <Icon path={mdiMagnify} size={0.7} className="inline mr-1" />
          Hover để phóng to
        </motion.div>
      )}
    </div>
  );
};

// Helper functions for ProductCard
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [productId, setProductId] = useState<string>("");
  const { data: productData, isLoading } = useProductDetail(productId);
  const { data: allProductsData } = useProducts({ limit: 8 });
  const { data: promotionsData } = usePromotions({ status: "ACTIVE" });
  const { addToCart } = useCartStore();

  const [selectedVariant, setSelectedVariant] =
    useState<IPopulatedProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productDiscount, setProductDiscount] =
    useState<ProductWithDiscount | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    if (typeof slug === "string") {
      const id = slug.split("-").pop();
      if (id) {
        setProductId(id);
      }
    }
  }, [slug]);

  // Cập nhật variant được chọn khi có dữ liệu sản phẩm
  useEffect(() => {
    const product = productData?.data?.product;
    if (product?.variants?.length && (product as any)?.variants.length > 0) {
      const firstVariant = (product as any)?.variants[0];
      setSelectedVariant(firstVariant);
      setSelectedColor(String(firstVariant.color || ""));
      setSelectedSize(String(firstVariant.size || ""));
      setCurrentImageIndex(0);
    }
  }, [productData]);

  // Calculate product discount when promotions data is available
  useEffect(() => {
    const product = productData?.data?.product;
    if (product && selectedVariant && promotionsData?.data?.promotions) {
      const activePromotions = filterActivePromotions(
        promotionsData.data.promotions
      );
      const discount = calculateProductDiscount(
        String((product as any)?.id),
        selectedVariant.price,
        activePromotions
      );
      setProductDiscount(discount);
    } else {
      setProductDiscount(null);
    }
  }, [productData, selectedVariant, promotionsData]);

  // Xử lý chọn màu sắc
  const handleColorSelect = (colorValue: string) => {
    setSelectedColor(colorValue);
    const product = productData?.data?.product;
    if (!product) return;

    // Try to find a variant with the selected color and current size
    const matchingVariant = (product as any)?.variants.find(
      (v) =>
        String(v.color) === String(colorValue) &&
        String(v.size) === String(selectedSize)
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setCurrentImageIndex(0);
    } else {
      // If no exact match, find first variant with the selected color
      const firstVariantWithColor = (product as any)?.variants.find(
        (v) => String(v.color) === String(colorValue)
      );
      if (firstVariantWithColor) {
        setSelectedVariant(firstVariantWithColor);
        setSelectedSize(String(firstVariantWithColor.size || ""));
        setCurrentImageIndex(0);
      }
    }
  };

  // Xử lý chọn kích thước
  const handleSizeSelect = (sizeValue: string) => {
    setSelectedSize(sizeValue);
    const product = productData?.data?.product;
    if (!product) return;

    const matchingVariant = (product as any)?.variants.find(
      (v) =>
        String(v.color) === String(selectedColor) &&
        String(v.size) === String(sizeValue)
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    const product = productData?.data?.product;
    if (!selectedVariant || !product) return;

    // Check stock availability
    if (selectedVariant.stock === 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    if (quantity > selectedVariant.stock) {
      toast.error(`Chỉ còn ${selectedVariant.stock} sản phẩm trong kho`);
      return;
    }

    const finalPrice =
      productDiscount && productDiscount.discountPercent > 0
        ? productDiscount.discountedPrice
        : (product as any)?.sale
        ? calculateDiscountedPrice(
            selectedVariant.price,
            (product as any)?.sale
          )
        : selectedVariant.price;

    const originalPrice =
      productDiscount && productDiscount.discountPercent > 0
        ? productDiscount.originalPrice
        : (product as any)?.sale
        ? selectedVariant.price
        : undefined;

    const cartItem = {
      id: selectedVariant._id || selectedVariant.id, // Use _id or id
      productId: (product as any)?.id,
      name: (product as any)?.productDisplayName || (product as any)?.name,
      price: finalPrice,
      originalPrice: originalPrice,
      discountPercent:
        productDiscount?.discountPercent || (product as any)?.sale || 0,
      hasDiscount: Boolean(
        (productDiscount && productDiscount.discountPercent > 0) ||
          ((product as any)?.sale && (product as any)?.sale > 0)
      ),
      image:
        checkImageUrl(
          (product as any)?.images?.[0] ||
            (selectedVariant.images as string[])?.[0] ||
            ""
        ) || "/placeholder.svg",
      quantity: quantity,
      slug: (product as any)?.id.toString(),
      brand:
        typeof (product as any)?.brand === "string"
          ? (product as any)?.brand
          : (product as any)?.brand?.name || "No Brand",
      size: String(selectedVariant.size || ""),
      colors: [String(selectedVariant.color || "")],
      stock: selectedVariant.stock,
      colorId: String(selectedVariant.color || ""),
      sizeId: String(selectedVariant.size || ""),
      colorName: String(selectedVariant.color || ""),
      sizeName: String(selectedVariant.size || ""),
    };

    addToCart(cartItem, quantity);
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  // Xử lý chuyển ảnh
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    if (
      !selectedVariant ||
      !selectedVariant.images ||
      selectedVariant.images.length === 0
    )
      return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedVariant.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (
      !selectedVariant ||
      !selectedVariant.images ||
      selectedVariant.images.length === 0
    )
      return;
    setCurrentImageIndex((prev) =>
      prev === selectedVariant.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!selectedVariant) return;
    const maxQuantity = selectedVariant.stock || 0;
    setQuantity(Math.max(1, Math.min(newQuantity, maxQuantity)));
  };

  // Get similar products (exclude current product) and apply promotions
  const similarProducts = useMemo(() => {
    if (!allProductsData?.data?.products || !productData?.data) return [];

    let filteredProducts = allProductsData.data.products
      .filter((p: IProduct) => p.id !== productData.data.product.id)
      .slice(0, 5);

    // Apply promotions to similar products - but only active promotions
    if (promotionsData?.data?.promotions) {
      const activePromotions = filterActivePromotions(
        promotionsData.data.promotions
      );
      filteredProducts = applyPromotionsToProducts(
        filteredProducts,
        activePromotions
      );
    }

    return filteredProducts;
  }, [allProductsData, productData?.data, promotionsData]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/5">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="grid grid-cols-5 gap-2 mt-4">
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="aspect-square w-full rounded-lg"
                />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-2/5 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex gap-2 pt-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-12 w-12 rounded-full" />
              ))}
            </div>
            <div className="flex gap-2">
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className="h-12 w-16" />
              ))}
            </div>
            <div className="pt-4 flex gap-4">
              <Skeleton className="h-14 w-40" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const product = productData?.data?.product;
  if (!product) return null;

  // Product metadata - use actual API fields
  const brandName = (product as any)?.masterCategory || "No Brand";
  const categoryName = (product as any)?.subCategory || "No Category";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-white">
      <div className="container mx-auto py-8">
        {/* Enhanced Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="!text-maintext hover:!text-maintext transition-colors"
                >
                  Trang chủ
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="!text-maintext hover:!text-maintext" />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/products"
                  className="!text-maintext hover:!text-maintext transition-colors"
                >
                  Tất cả sản phẩm
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="!text-maintext hover:!text-maintext" />
              <BreadcrumbItem>
                <BreadcrumbPage className="!text-maintext hover:!text-maintext">
                  {product.productDisplayName || (product as any)?.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6">
          {/* Enhanced Product Images Section */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border flex items-center justify-center">
              {selectedVariant?.images?.length ||
              (product as any)?.images?.length ? (
                <>
                  <ImageZoom
                    src={checkImageUrl(
                      selectedVariant?.images?.[currentImageIndex] ||
                        (product as any)?.images?.[currentImageIndex]
                    )}
                    alt={product.productDisplayName || (product as any)?.name}
                    className="aspect-square"
                  />
                  {((selectedVariant?.images?.length || 0) > 1 ||
                    ((product as any)?.images?.length || 0) > 1) && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 bg-white/90 hover:bg-white shadow-sm border-0 backdrop-blur-sm z-20"
                        onClick={handlePrevImage}
                      >
                        <Icon path={mdiChevronLeft} size={1} />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100 bg-white/90 hover:bg-white shadow-sm border-0 backdrop-blur-sm z-20"
                        onClick={handleNextImage}
                      >
                        <Icon path={mdiChevronRight} size={1} />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-maintext">Không có hình ảnh</p>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {((selectedVariant?.images?.length || 0) > 1 ||
              ((product as any)?.images?.length || 0) > 1) && (
              <div className="grid grid-cols-5 gap-4 mt-4">
                {(
                  selectedVariant?.images ||
                  (product as any)?.images ||
                  []
                ).map((image: any, index: number) => (
                  <motion.div
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`
                    relative aspect-square rounded-xl overflow-hidden cursor-pointer
                    border-2 transition-all duration-300 hover:opacity-80
                    ${
                      currentImageIndex === index
                        ? "border-primary ring-2 ring-primary/20 shadow-sm scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                    whileHover={{
                      scale: currentImageIndex === index ? 1.05 : 1.02,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={checkImageUrl(image)}
                      alt={`${
                        product.productDisplayName || (product as any)?.name
                      } - ${index + 1}`}
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 20vw, 10vw"
                    />
                  </motion.div>
                ))}
              </div>
            )}
            {/* Enhanced Product Information */}
            <Card className="p-4 border-green-100 mt-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="!text-maintext font-semibold">
                    Phân loại chính
                  </span>
                  <span className="font-medium text-maintext">
                    {product.masterCategory}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="!text-maintext font-semibold">
                    Phân loại phụ
                  </span>
                  <span className="font-medium text-maintext">
                    {product.subCategory}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="!text-maintext font-semibold">
                    Kiểu dáng
                  </span>
                  <span className="font-medium text-maintext">
                    {product.articleType}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="!text-maintext font-semibold">
                    Màu cơ bản
                  </span>
                  <span className="font-medium text-maintext">
                    {product.baseColour}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="!text-maintext font-semibold">
                    Mã sản phẩm
                  </span>
                  <span className="font-mono font-medium text-primary">
                    {product.id}
                  </span>
                </div>
                {product.gender && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="!text-maintext font-semibold">
                      Giới tính
                    </span>
                    <span className="font-medium text-maintext">
                      {product.gender}
                    </span>
                  </div>
                )}
                {product.usage && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="!text-maintext font-semibold">
                      Dịp sử dụng
                    </span>
                    <span className="font-medium text-maintext">
                      {product.usage}
                    </span>
                  </div>
                )}
                {product.season && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="!text-maintext font-semibold">Mùa</span>
                    <span className="font-medium text-maintext">
                      {product.season} ({product.year})
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Enhanced Product Information Section */}
          <motion.div
            className="w-full space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Product Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="default">#{product.id}</Badge>
                <Badge variant="bestSeller">{product.masterCategory}</Badge>
                <Badge variant="bestSeller">{product.articleType}</Badge>
                {productDiscount && productDiscount.discountPercent > 0 && (
                  <Badge variant="promotion">
                    <Icon path={mdiTagMultiple} size={0.6} className="mr-1" />
                    {productDiscount.appliedPromotion?.name} -
                    {productDiscount.discountPercent}%
                  </Badge>
                )}
                {(product as any)?.sale &&
                  (!productDiscount ||
                    productDiscount.discountPercent === 0) && (
                    <Badge variant="danger">
                      <Icon path={mdiTagMultiple} size={0.6} className="mr-1" />
                      SALE {(product as any)?.sale}%
                    </Badge>
                  )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-maintext leading-tight">
                {product.productDisplayName || (product as any)?.name}
              </h1>

              {/* Rating placeholder */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      path={
                        i < Math.floor((product as any)?.rating || 4)
                          ? mdiStar
                          : mdiStarOutline
                      }
                      size={0.7}
                      className={
                        i < Math.floor((product as any)?.rating || 4)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm !text-maintext">
                  ({product.rating || "4.0"}) •{" "}
                  {((product as any)?.reviews?.length || 0) + 128} đánh giá
                </span>
              </div>
            </div>

            {/* Enhanced Pricing */}
            <Card className="p-4 border-green-100">
              <div className="space-y-4">
                {/* Price Display */}
                <div className="flex items-center gap-4">
                  <motion.div
                    className="text-4xl font-bold text-primary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {(() => {
                      if (
                        productDiscount &&
                        productDiscount.discountPercent > 0
                      ) {
                        return formatPrice(productDiscount.discountedPrice);
                      } else if ((product as any)?.sale && selectedVariant) {
                        const calculatedPrice = calculateDiscountedPrice(
                          selectedVariant.price,
                          (product as any)?.sale
                        );
                        return formatPrice(calculatedPrice);
                      } else if (selectedVariant) {
                        return formatPrice(selectedVariant.price);
                      }
                      return "N/A";
                    })()}
                  </motion.div>
                  {((productDiscount && productDiscount.discountPercent > 0) ||
                    (product as any)?.sale) &&
                    selectedVariant && (
                      <div className="text-xl text-maintext line-through font-medium bg-gray-100 px-3 py-2 rounded-lg">
                        {formatPrice(
                          productDiscount && productDiscount.discountPercent > 0
                            ? productDiscount.originalPrice
                            : selectedVariant.price
                        )}
                      </div>
                    )}
                </div>

                {/* Price breakdown for clarity */}
                {productDiscount && productDiscount.discountPercent > 0 && (
                  <Card className="p-4 bg-[#EAEBF2]">
                    <div className="font-semibold italic mb-3 text-base">
                      🎉 Áp dụng khuyến mãi:{" "}
                      <span className="text-primary">
                        {productDiscount.appliedPromotion?.name}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {/* Step 1: Original Price */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm font-semibold text-maintext">
                          Giá gốc:
                        </span>
                        <span className="text-sm font-semibold text-maintext">
                          {formatPrice(productDiscount.originalPrice)}
                        </span>
                      </div>

                      {/* Step 2: Discount Amount */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-sm font-semibold text-maintext">
                          Giảm giá ({productDiscount.discountPercent}%):
                        </span>
                        <span className="text-sm font-semibold text-red-600">
                          -{" "}
                          {formatPrice(
                            productDiscount.discountAmount ||
                              productDiscount.originalPrice -
                                productDiscount.discountedPrice
                          )}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Show original price info when no discount */}
                {(!productDiscount || productDiscount.discountPercent === 0) &&
                  selectedVariant && (
                    <div className="text-sm text-maintext">
                      Giá bán: {formatPrice(selectedVariant.price)}
                    </div>
                  )}
              </div>
            </Card>

            <Card className="p-4 border-green-100 flex flex-col gap-4">
              {/* Enhanced Color Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      path={mdiPalette}
                      size={1}
                      className="!text-maintext"
                    />
                    <span className="font-semibold text-maintext">Màu sắc</span>
                  </div>
                  {selectedColor && (
                    <span className="text-sm !text-maintext bg-gray-100 px-3 py-1 rounded-full">
                      {selectedColor}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.variants
                    .filter((variant, index, self) => {
                      const colorValue = variant.color;
                      return (
                        colorValue &&
                        index === self.findIndex((v) => v.color === colorValue)
                      );
                    })
                    .map((variant) => (
                      <motion.button
                        key={variant.color}
                        onClick={() => handleColorSelect(String(variant.color))}
                        className={`
                        relative group flex items-center justify-center w-10 h-10 rounded-full
                        transition-all duration-300 border-2
                        ${
                          String(selectedColor) === String(variant.color)
                            ? "border-primary ring-4 ring-primary/20 scale-110"
                            : "border-gray-200 hover:border-gray-300 hover:scale-105"
                        }
                      `}
                        style={{ backgroundColor: variant.color as string }}
                        title={variant.color as string}
                        whileHover={{
                          scale:
                            String(selectedColor) === String(variant.color)
                              ? 1.1
                              : 1.05,
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {String(selectedColor) === String(variant.color) && (
                          <Icon
                            path={mdiCheck}
                            size={1}
                            className="text-white drop-shadow-sm"
                          />
                        )}
                      </motion.button>
                    ))}
                </div>
              </div>

              {/* Enhanced Size Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon path={mdiRuler} size={1} className="!text-maintext" />
                    <span className="font-semibold text-maintext">
                      Kích thước
                    </span>
                  </div>
                  {selectedSize && (
                    <span className="text-sm !text-maintext bg-gray-100 px-3 py-1 rounded-full">
                      {selectedSize}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  {Array.from(
                    new Set(
                      (product as any)?.variants
                        .map((v) => String(v.size))
                        .filter(Boolean)
                    )
                  ).map((sizeValue) => {
                    const sizeVariant = (product as any)?.variants.find(
                      (v) => String(v.size) === sizeValue
                    );
                    const variantForColorAndSize = (
                      product as any
                    ).variants.find(
                      (v) =>
                        String(v.color) === String(selectedColor) &&
                        String(v.size) === sizeValue
                    );
                    const isAvailable =
                      !!variantForColorAndSize &&
                      variantForColorAndSize.stock > 0;

                    return (
                      <Button
                        variant={
                          String(selectedSize) === sizeValue
                            ? "default"
                            : "outline"
                        }
                        size="icon"
                        key={sizeValue}
                        onClick={() => handleSizeSelect(sizeValue)}
                        disabled={!isAvailable}
                        className={
                          !isAvailable ? "opacity-50 cursor-not-allowed" : ""
                        }
                        title={!isAvailable ? "Không có sẵn cho màu này" : ""}
                      >
                        {sizeValue}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Quantity Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      path={mdiCartPlus}
                      size={1}
                      className="!text-maintext"
                    />
                    <span className="font-semibold text-maintext">
                      Số lượng
                    </span>
                  </div>

                  {selectedVariant && (
                    <span className="text-sm !text-maintext">
                      Còn{" "}
                      <span className="font-semibold text-primary">
                        {selectedVariant.stock}
                      </span>{" "}
                      sản phẩm
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <div className="w-9 h-9 flex items-center justify-center border text-center text-lg font-semibold bg-gray-50 rounded-sm">
                    {quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={
                      !selectedVariant ||
                      quantity >= (selectedVariant.stock || 0)
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white shadow-sm hover:shadow-sm"
                  size="lg"
                  onClick={() =>
                    toast.success("Đã thêm vào danh sách yêu thích")
                  }
                >
                  <Icon path={mdiAlphaSBox} size={1} />
                  <strong>Gợi ý sản phẩm</strong>
                </Button>
                <Button
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-500 text-white shadow-sm hover:shadow-sm"
                  size="lg"
                  onClick={() =>
                    toast.success("Đã thêm vào danh sách yêu thích")
                  }
                >
                  <Icon path={mdiHeartCircle} size={1} />
                  <strong>Yêu thích</strong>
                </Button>
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                >
                  <Icon path={mdiCartArrowRight} size={1} />
                  <strong>Thêm vào giỏ hàng</strong>
                </Button>
              </div>
            </Card>

            {/* Enhanced Product Features */}
            <Card className="p-4 border-green-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon path={mdiTruck} size={1} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-maintext">
                      Miễn phí vận chuyển
                    </p>
                    <p className="text-sm !text-maintext">Đơn hàng từ 500k</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon path={mdiShield} size={1} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-maintext">
                      Bảo hành chính hãng
                    </p>
                    <p className="text-sm !text-maintext">12 tháng</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon path={mdiRefresh} size={1} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-maintext">Đổi trả dễ dàng</p>
                    <p className="text-sm !text-maintext">Trong 30 ngày</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon
                      path={mdiCreditCard}
                      size={1}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-maintext">
                      Thanh toán an toàn
                    </p>
                    <p className="text-sm !text-maintext">Nhiều phương thức</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
        {/* Enhanced Similar Products Section */}
        {similarProducts.length > 0 && (
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-maintext mb-4">
                Sản phẩm tương tự
              </h2>
              <p className="!text-maintext max-w-2xl mx-auto text-lg">
                Khám phá những sản phẩm tương tự có thể bạn sẽ thích
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {similarProducts.map(
                (similarProduct: IProduct, index: number) => (
                  <ProductCard
                    key={similarProduct.id}
                    product={similarProduct}
                    promotionsData={promotionsData}
                    formatPrice={formatPrice}
                    onAddToCart={() => {
                      const firstVariant = similarProduct.variants?.[0];
                      if (!firstVariant) return;

                      if (firstVariant.stock === 0) {
                        toast.error("Sản phẩm đã hết hàng");
                        return;
                      }

                      const { addToCart } = useCartStore.getState();

                      let discountPercent = similarProduct.sale || 0;
                      let finalPrice = calculateDiscountedPrice(
                        firstVariant.price,
                        discountPercent
                      );
                      let originalPrice =
                        discountPercent > 0 ? firstVariant.price : undefined;

                      if (
                        discountPercent === 0 &&
                        promotionsData?.data?.promotions
                      ) {
                        const activePromotions = filterActivePromotions(
                          promotionsData.data.promotions
                        );
                        const discount = calculateProductDiscount(
                          String(similarProduct.id),
                          firstVariant.price,
                          activePromotions
                        );
                        if (discount.discountPercent > 0) {
                          finalPrice = discount.discountedPrice;
                          originalPrice = discount.originalPrice;
                          discountPercent = discount.discountPercent;
                        }
                      }

                      const cartItem = {
                        id: firstVariant._id || firstVariant.id,
                        productId: similarProduct.id,
                        name:
                          similarProduct.productDisplayName ||
                          similarProduct.name,
                        price: finalPrice,
                        originalPrice: originalPrice,
                        discountPercent: discountPercent,
                        hasDiscount: discountPercent > 0,
                        image:
                          checkImageUrl(
                            similarProduct.images?.[0] ||
                              firstVariant.images?.[0] ||
                              ""
                          ) || "/placeholder.svg",
                        quantity: 1,
                        slug: similarProduct.id.toString(),
                        brand:
                          typeof similarProduct.brand === "string"
                            ? similarProduct.brand
                            : similarProduct.brand?.name || "No Brand",
                        size: String(firstVariant.size || ""),
                        colors: [String(firstVariant.color || "")],
                        stock: firstVariant.stock,
                        colorId: String(firstVariant.color || ""),
                        sizeId: String(firstVariant.size || ""),
                        colorName: String(firstVariant.color || ""),
                        sizeName: String(firstVariant.size || ""),
                      };

                      addToCart(cartItem, 1);
                      toast.success("Đã thêm sản phẩm vào giỏ hàng");
                    }}
                    onQuickView={() => {
                      window.location.href = `/products/${(
                        similarProduct.productDisplayName ||
                        similarProduct.name ||
                        "product"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}-${similarProduct.id}`;
                    }}
                    onAddToWishlist={() => {
                      toast.success("Đã thêm vào danh sách yêu thích");
                    }}
                  />
                )
              )}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <a href="/products">Xem tất cả sản phẩm</a>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
      <div className="fixed bottom-6 right-6 z-50 shadow-sm rounded-full bg-primary p-2 hover:bg-primary/80 transition-all duration-300">
        <CartIcon className="text-white" />
      </div>
    </div>
  );
}
