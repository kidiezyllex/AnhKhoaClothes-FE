"use client";

import React, { useState, useEffect, useMemo } from "react";
import CartIcon from "@/components/ui/CartIcon";
import { useNavigate } from "react-router-dom";

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
  mdiCartOutline,
  mdiHeartOutline,
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
  mdiTagOutline,
  mdiAutoFix,
  mdiEye,
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
import { checkImageUrl } from "@/lib/utils";
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
        className={`relative ${className} transition-all duration-300 ${
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

// Similar Products Component
const SimilarProductCard = ({
  product,
  promotionsData,
}: {
  product: IProduct;
  promotionsData?: IPromotionsResponse;
}) => {
  const { addToCart } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product.variants?.[0]) return;

    const firstVariant = product.variants[0];

    if (firstVariant.stock === 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    // Calculate discount - prioritize product.sale, fallback to promotions
    let discountPercent = product.sale || 0;
    let finalPrice = firstVariant.price * (1 - discountPercent / 100);
    let originalPrice = discountPercent > 0 ? firstVariant.price : undefined;
    let hasDiscount = discountPercent > 0;

    if (discountPercent === 0 && promotionsData?.data?.promotions) {
      const activePromotions = filterActivePromotions(
        promotionsData.data.promotions
      );
      const discount = calculateProductDiscount(
        String(product.id),
        firstVariant.price,
        activePromotions
      );

      if (discount.discountPercent > 0) {
        finalPrice = discount.discountedPrice;
        originalPrice = discount.originalPrice;
        discountPercent = discount.discountPercent;
        hasDiscount = true;
      }
    }

    const cartItem = {
      id: firstVariant._id || firstVariant.id,
      productId: product.id,
      name: product.productDisplayName || product.name,
      price: finalPrice,
      originalPrice: originalPrice,
      discountPercent: discountPercent,
      hasDiscount: hasDiscount,
      image:
        checkImageUrl(product.images?.[0] || firstVariant.images?.[0] || "") ||
        "/placeholder.svg",
      quantity: 1,
      slug: product.id.toString(),
      brand:
        typeof product.brand === "string"
          ? product.brand
          : product.brand?.name || "No Brand",
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
  };

  const handleQuickView = () => {
    window.location.href = `/products/${(
      product.productDisplayName ||
      product.name ||
      "product"
    )
      .toLowerCase()
      .replace(/\s+/g, "-")}-${product.id}`;
  };

  const handleAddToWishlist = () => {
    toast.success("Đã thêm vào danh sách yêu thích");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden border rounded-lg hover:shadow-2xl shadow-sm transition-all duration-500 h-full flex flex-col transform hover:-translate-y-3 bg-white relative backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg z-10 pointer-events-none" />
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-t-2xl">
          <a
            href={`/products/${(product.productDisplayName || product.name)
              .toLowerCase()
              .replace(/\s+/g, "-")}-${product.id}`}
            className="block"
          >
            <div className="aspect-square overflow-hidden relative flex items-center justify-center">
              <motion.div
                className="w-full h-full relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <img
                  src={
                    checkImageUrl(
                      product.images?.[0] || product.variants?.[0]?.images?.[0]
                    ) || "/placeholder.svg"
                  }
                  alt={product.productDisplayName || product.name}
                  className="object-contain w-full h-full drop-shadow-2xl filter group-hover:brightness-110 transition-all duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  draggable="false"
                />
              </motion.div>
            </div>
          </a>

          {/* Enhanced badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            {product?.isNew && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Badge variant="new" className="flex items-center gap-1">
                  <Icon path={mdiAutoFix} size={0.6} />
                  Mới
                </Badge>
              </motion.div>
            )}
            {(() => {
              // Calculate discount from promotions data if available
              if (promotionsData?.data?.promotions && product.variants?.[0]) {
                const activePromotions = filterActivePromotions(
                  promotionsData.data.promotions
                );
                const discount = calculateProductDiscount(
                  String(product.id),
                  product.variants[0].price,
                  activePromotions
                );

                if (discount.discountPercent > 0) {
                  return (
                    <motion.div
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Badge
                        variant="promotion"
                        className="flex items-center gap-1"
                      >
                        <Icon path={mdiTagOutline} size={0.6} />
                        <span className="text-base">
                          -{discount.discountPercent}%
                        </span>
                      </Badge>
                    </motion.div>
                  );
                }
              }
              return null;
            })()}
          </div>

          {/* Enhanced quick action buttons */}
          <motion.div
            className="absolute right-2 top-2 transform -translate-y-1/2 flex flex-col gap-4 z-30"
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
                  handleAddToCart();
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
                  handleAddToWishlist();
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
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-primary hover:text-white shadow-sm border-0 hover:shadow-2xl transition-all duration-300 group/btn"
                onClick={(e) => {
                  e.preventDefault();
                  handleQuickView();
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

        <div className="p-4 flex flex-col flex-grow bg-gradient-to-b bg-green-50 border-t border-gray-100/50 rounded-b-2xl relative">
          <div className="text-xs text-primary/80 mb-2 uppercase tracking-wider font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-pink-400 animate-pulse"></div>
            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              {product.masterCategory || "No Category"}
            </span>
          </div>

          <a
            href={`/products/${(product.productDisplayName || product.name)
              .toLowerCase()
              .replace(/\s+/g, "-")}-${product.id}`}
            className="hover:text-primary transition-colors group/a"
          >
            <h3 className="font-bold text-base mb-3 line-clamp-2 leading-tight group-hover:text-primary/90 transition-colors duration-300 text-maintext group-hover/link:underline decoration-primary/50 underline-offset-2">
              {product.productDisplayName || product.name}
            </h3>
          </a>

          <div className="mt-auto">
            {/* Enhanced pricing */}
            <div className="flex items-center justify-between">
              <motion.div
                className="font-extrabold text-lg text-active"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {(() => {
                  // Calculate discount from promotions data if available
                  if (
                    promotionsData?.data?.promotions &&
                    product.variants?.[0]
                  ) {
                    const discount = calculateProductDiscount(
                      String(product.id),
                      product.variants[0].price,
                      promotionsData.data.promotions
                    );

                    if (discount.discountPercent > 0) {
                      return formatPrice(discount.discountedPrice);
                    }
                  }

                  return (
                    product.variants?.[0] &&
                    formatPrice(product.variants[0].price)
                  );
                })()}
              </motion.div>
              {(() => {
                // Show original price if there's a discount
                if (promotionsData?.data?.promotions && product.variants?.[0]) {
                  const discount = calculateProductDiscount(
                    String(product.id),
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

            {/* Enhanced color variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="flex flex-col gap-1 items-start justify-start">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-maintext font-semibold">
                    Màu sắc:
                  </span>
                  <div className="flex gap-1 text-sm">
                    {Array.from(
                      new Set(
                        product.variants.map((v) => v.color).filter(Boolean)
                      )
                    )
                      .slice(0, 4)
                      .map((colorValue: any, index: number) => (
                        <motion.div
                          key={index}
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-2 ring-gray-200 cursor-pointer"
                          style={{ backgroundColor: colorValue }}
                          title={colorValue}
                          whileHover={{ scale: 1.3, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        />
                      ))}

                    {Array.from(
                      new Set(
                        product.variants.map((v) => v.color).filter(Boolean)
                      )
                    ).length > 4 && (
                      <motion.span
                        className="text-xs text-maintext ml-1 bg-gray-100 px-2 py-1 rounded-full font-medium"
                        whileHover={{ scale: 1.1 }}
                      >
                        +
                        {Array.from(
                          new Set(
                            product.variants.map((v) => v.color).filter(Boolean)
                          )
                        ).length - 4}
                      </motion.span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-maintext font-semibold">
                    Kích thước:
                  </span>
                  <div className="flex gap-1 text-maintext text-sm">
                    {Array.from(
                      new Set(product.variants.map((v) => String(v.size)))
                    ).join(", ")}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Decorative bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-pink-400/20 to-orange-400/20 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Card>
    </motion.div>
  );
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
    if (product?.variants?.length && product.variants.length > 0) {
      const firstVariant = product.variants[0];
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
        String(product.id),
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
    const matchingVariant = product.variants.find(
      (v) =>
        String(v.color) === String(colorValue) &&
        String(v.size) === String(selectedSize)
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setCurrentImageIndex(0);
    } else {
      // If no exact match, find first variant with the selected color
      const firstVariantWithColor = product.variants.find(
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

    const matchingVariant = product.variants.find(
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
        : product.sale
        ? selectedVariant.price * (1 - product.sale / 100)
        : selectedVariant.price;

    const originalPrice =
      productDiscount && productDiscount.discountPercent > 0
        ? productDiscount.originalPrice
        : product.sale
        ? selectedVariant.price
        : undefined;

    const cartItem = {
      id: selectedVariant._id || selectedVariant.id, // Use _id or id
      productId: product.id,
      name: product.productDisplayName || product.name,
      price: finalPrice,
      originalPrice: originalPrice,
      discountPercent: productDiscount?.discountPercent || product.sale || 0,
      hasDiscount: Boolean(
        (productDiscount && productDiscount.discountPercent > 0) ||
          (product.sale && product.sale > 0)
      ),
      image:
        checkImageUrl(
          product.images?.[0] || (selectedVariant.images as string[])?.[0] || ""
        ) || "/placeholder.svg",
      quantity: quantity,
      slug: product.id.toString(),
      brand:
        typeof product.brand === "string"
          ? product.brand
          : product.brand?.name || "No Brand",
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
      .slice(0, 4);

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
        <div className="flex flex-col lg:flex-row gap-8">
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
  const brandName = product.masterCategory || "No Brand";
  const categoryName = product.subCategory || "No Category";

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
                  {product.productDisplayName || product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8">
          {/* Enhanced Product Images Section */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border flex items-center justify-center">
              {selectedVariant?.images?.length || product.images?.length ? (
                <>
                  <ImageZoom
                    src={checkImageUrl(
                      selectedVariant?.images?.[currentImageIndex] ||
                        product.images?.[currentImageIndex]
                    )}
                    alt={product.productDisplayName || product.name}
                    className="aspect-square"
                  />
                  {((selectedVariant?.images?.length || 0) > 1 ||
                    (product.images?.length || 0) > 1) && (
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
              (product.images?.length || 0) > 1) && (
              <div className="grid grid-cols-5 gap-4 mt-4">
                {(selectedVariant?.images || product.images || []).map(
                  (image: any, index: number) => (
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
                        alt={`${product.productDisplayName || product.name} - ${
                          index + 1
                        }`}
                        className="object-contain p-2"
                        sizes="(max-width: 768px) 20vw, 10vw"
                      />
                    </motion.div>
                  )
                )}
              </div>
            )}
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
              <div className="flex items-center gap-4">
                <div className="font-mono border h-[22px] bg-gray-100 px-3 flex items-center justify-center text-primary text-sm font-medium rounded-full">
                  #{product.id}
                </div>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {product.masterCategory}
                </Badge>
                <Badge variant="outline" className="!text-maintext">
                  {product.articleType}
                </Badge>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-maintext leading-tight">
                {product.productDisplayName || product.name}
              </h1>

              {/* Rating placeholder */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      path={
                        i < Math.floor(product.rating || 4)
                          ? mdiStar
                          : mdiStarOutline
                      }
                      size={0.7}
                      className={
                        i < Math.floor(product.rating || 4)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm !text-maintext">
                  ({product.rating || "4.0"}) •{" "}
                  {(product.reviews?.length || 0) + 128} đánh giá
                </span>
              </div>
            </div>

            {/* Enhanced Pricing */}
            <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <div className="space-y-4">
                {/* Discount Badge */}
                {productDiscount && productDiscount.discountPercent > 0 && (
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-sm border border-white/50 backdrop-blur-sm animate-pulse flex-shrink-0 w-fit flex items-center justify-center gap-2"
                  >
                    💥
                    <span className="text-lg">
                      -{productDiscount.discountPercent}%
                    </span>
                  </motion.div>
                )}

                {/* Price Display */}
                <div className="flex items-center gap-4">
                  <motion.div
                    className="text-4xl font-bold text-primary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {productDiscount && productDiscount.discountPercent > 0
                      ? formatPrice(productDiscount.discountedPrice)
                      : selectedVariant && formatPrice(selectedVariant.price)}
                  </motion.div>
                  {productDiscount && productDiscount.discountPercent > 0 && (
                    <div className="text-xl text-maintext line-through font-medium bg-gray-100 px-3 py-2 rounded-lg">
                      {formatPrice(productDiscount.originalPrice)}
                    </div>
                  )}
                </div>

                {/* Price breakdown for clarity */}
                {productDiscount && productDiscount.discountPercent > 0 && (
                  <div className="text-sm text-green-600 font-medium space-y-1">
                    <div>
                      🎉 Áp dụng khuyến mãi:{" "}
                      {productDiscount.appliedPromotion?.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-maintext">
                      <span>
                        Giá gốc:{" "}
                        <span className="line-through">
                          {formatPrice(productDiscount.originalPrice)}
                        </span>
                      </span>
                      <span>→</span>
                      <span className="text-green-600 font-semibold">
                        Giá sau giảm:{" "}
                        {formatPrice(productDiscount.discountedPrice)}
                      </span>
                    </div>
                  </div>
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

            {/* Enhanced Color Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon path={mdiPalette} size={1} className="!text-maintext" />
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
                    product.variants.map((v) => String(v.size)).filter(Boolean)
                  )
                ).map((sizeValue) => {
                  const sizeVariant = product.variants.find(
                    (v) => String(v.size) === sizeValue
                  );
                  const variantForColorAndSize = product.variants.find(
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
                  <span className="font-semibold text-maintext">Số lượng</span>
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
                    !selectedVariant || quantity >= (selectedVariant.stock || 0)
                  }
                >
                  +
                </Button>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => toast.success("Đã thêm vào danh sách yêu thích")}
              >
                <Icon path={mdiHeartOutline} size={1} className="mr-2" />
                Yêu thích
              </Button>
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                <Icon path={mdiCartOutline} size={1} className="mr-2" />
                Thêm vào giỏ hàng
              </Button>
            </div>

            {/* Enhanced Product Features */}
            <Card className="p-4 bg-gray-50/50">
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

            {/* Enhanced Product Information */}
            <Card className="p-4">
              <h3 className="font-semibold text-maintext mb-4 flex items-center gap-2">
                <Icon path={mdiInformation} size={1} className="text-primary" />
                Thông tin sản phẩm
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="!text-maintext">Phân loại chính</span>
                  <span className="font-medium text-maintext">
                    {product.masterCategory}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="!text-maintext">Phân loại phụ</span>
                  <span className="font-medium text-maintext">
                    {product.subCategory}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="!text-maintext">Kiểu dáng</span>
                  <span className="font-medium text-maintext">
                    {product.articleType}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="!text-maintext">Màu cơ bản</span>
                  <span className="font-medium text-maintext">
                    {product.baseColour}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="!text-maintext">Mã sản phẩm</span>
                  <span className="font-mono font-medium text-primary">
                    {product.id}
                  </span>
                </div>
                {product.gender && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="!text-maintext">Giới tính</span>
                    <span className="font-medium text-maintext">
                      {product.gender}
                    </span>
                  </div>
                )}
                {product.usage && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="!text-maintext">Dịp sử dụng</span>
                    <span className="font-medium text-maintext">
                      {product.usage}
                    </span>
                  </div>
                )}
                {product.season && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="!text-maintext">Mùa</span>
                    <span className="font-medium text-maintext">
                      {product.season} ({product.year})
                    </span>
                  </div>
                )}
                {selectedVariant && (
                  <div className="flex justify-between items-center py-2">
                    <span className="!text-maintext">Giá hiện tại</span>
                    <span className="font-medium text-primary">
                      {productDiscount && productDiscount.discountPercent > 0
                        ? formatPrice(productDiscount.discountedPrice)
                        : formatPrice(selectedVariant.price)}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Product Details Tabs */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full sm:w-auto border-b bg-transparent h-auto p-0 rounded-none">
              <TabsTrigger
                value="description"
                className="flex-1 sm:flex-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 font-semibold text-maintext"
              >
                Mô tả sản phẩm
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="flex-1 sm:flex-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 font-semibold text-maintext"
              >
                Thông số kỹ thuật
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-1 sm:flex-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 font-semibold"
              >
                Đánh giá (128)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <Card className="p-8">
                <div className="prose max-w-none">
                  <div className="text-maintext leading-relaxed">
                    <p>Tên sản phẩm: {product.productDisplayName}</p>
                    <p>Giới tính: {product.gender}</p>
                    <p>
                      Phân loại: {product.masterCategory} -{" "}
                      {product.subCategory}
                    </p>
                    <p>Kiểu dáng: {product.articleType}</p>
                    <p>Màu sắc: {product.baseColour}</p>
                    <p>
                      Mùa: {product.season} {product.year}
                    </p>
                    <p>Dịp sử dụng: {product.usage}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-8">
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-maintext">
                      Thông tin cơ bản
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="!text-maintext">Giới tính</span>
                        <span className="font-medium">{product.gender}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="!text-maintext">Phân loại chính</span>
                        <span className="font-medium">
                          {product.masterCategory}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="!text-maintext">Phân loại phụ</span>
                        <span className="font-medium">
                          {product.subCategory}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="!text-maintext">Kiểu dáng</span>
                        <span className="font-medium">
                          {product.articleType}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="!text-maintext">Màu cơ bản</span>
                        <span className="font-medium">
                          {product.baseColour}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="!text-maintext">Mùa</span>
                        <span className="font-medium">
                          {product.season} ({product.year})
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="!text-maintext">Dịp sử dụng</span>
                        <span className="font-medium">{product.usage}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-4 text-maintext">
                      Thông tin biến thể
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="!text-maintext">Số màu sắc</span>
                        <span className="font-medium">
                          {
                            Array.from(
                              new Set(
                                product.variants.map(
                                  (v) =>
                                    (v.color as any)?.id || (v as any)?.colorId
                                )
                              )
                            ).length
                          }{" "}
                          màu
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="!text-maintext">Số kích thước</span>
                        <span className="font-medium">
                          {
                            Array.from(
                              new Set(
                                product.variants.map(
                                  (v) =>
                                    (v.size as any)?.id || (v as any)?.sizeId
                                )
                              )
                            ).length
                          }{" "}
                          size
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="!text-maintext">Tổng tồn kho</span>
                        <span className="font-medium">
                          {product.variants.reduce(
                            (sum, v) => sum + v.stock,
                            0
                          )}{" "}
                          sản phẩm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <Card className="p-8">
                <div className="text-center py-12">
                  <Icon
                    path={mdiStar}
                    size={3}
                    className="text-gray-300 mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-maintext mb-2">
                    Chưa có đánh giá
                  </h3>
                  <p className="!text-maintext">
                    Hãy là người đầu tiên đánh giá sản phẩm này!
                  </p>
                  <Button className="mt-4">Viết đánh giá</Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

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
              <p className="!text-maintext max-w-2xl mx-auto">
                Khám phá những sản phẩm tương tự có thể bạn sẽ thích
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {similarProducts.map(
                  (similarProduct: IProduct, index: number) => (
                    <motion.div
                      key={similarProduct.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <SimilarProductCard
                        product={similarProduct}
                        promotionsData={promotionsData}
                      />
                    </motion.div>
                  )
                )}
              </AnimatePresence>
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
