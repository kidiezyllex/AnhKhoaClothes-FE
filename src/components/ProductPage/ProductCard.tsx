import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@mdi/react";
import {
  mdiCartArrowRight,
  mdiHeartCircle,
  mdiEye,
  mdiTagMultiple,
  mdiPackageVariantClosed,
  mdiAlertOctagon,
} from "@mdi/js";
import { checkImageUrl, calculateDiscountedPrice } from "@/lib/utils";
import { calculateProductDiscount } from "@/lib/promotions";

interface ProductCardProps {
  product: any;
  promotionsData?: any;
  onAddToCart: () => void;
  onQuickView: () => void;
  onAddToWishlist: () => void;
  formatPrice: (price: number) => string;
}

export const ProductCard = ({
  product,
  promotionsData,
  onAddToCart,
  onQuickView,
  onAddToWishlist,
  formatPrice,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const firstVariant = (product as any)?.variants?.[0];
  const basePrice = firstVariant?.price || 0;
  const currentStock = firstVariant?.stock || 0;

  const getDiscountInfo = () => {
    let discountPercent = (product as any)?.sale || 0;
    let discountedPrice = calculateDiscountedPrice(basePrice, discountPercent);

    if (
      discountPercent === 0 &&
      promotionsData?.data?.promotions &&
      firstVariant
    ) {
      const promoDiscount = calculateProductDiscount(
        (product as any)?.id,
        basePrice,
        promotionsData.data.promotions
      );
      if (promoDiscount.discountPercent > 0) {
        discountPercent = promoDiscount.discountPercent;
        discountedPrice = promoDiscount.discountedPrice;
      }
    }

    return {
      percent: Math.round(discountPercent),
      finalPrice: discountedPrice,
      isDiscounted: discountPercent > 0,
    };
  };

  const discountInfo = getDiscountInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden rounded-xl hover:shadow-2xl shadow-md transition-all duration-500 h-full flex flex-col transform bg-white relative backdrop-blur-sm border-2 border-transparent hover:border-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg z-10 pointer-events-none" />

        <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-t-2xl overflow-hidden">
          <a
            href={`/products/${(
              product.productDisplayName || (product as any)?.name
            )
              .toLowerCase()
              .replace(/\s+/g, "-")}-${product.id}`}
            className="block"
          >
            <div className="aspect-square overflow-visible relative flex items-center justify-center">
              <motion.div className="w-full h-full relative z-20 bg-white">
                <img
                  src={
                    checkImageUrl(
                      (product as any)?.images?.[0] ||
                        (product as any)?.variants?.[0]?.images?.[0]
                    ) || "/placeholder.svg"
                  }
                  alt={product.productDisplayName || (product as any)?.name}
                  className="object-contain w-full h-full drop-shadow-2xl filter group-hover:brightness-110 transition-all duration-500 bg-white"
                />
              </motion.div>
            </div>
          </a>

          {/* Enhanced badges */}
          <div className="absolute top-2 left-2 flex flex-row flex-wrap gap-2 z-20">
            {product.articleType && (
              <Badge variant="teal">{product.articleType}</Badge>
            )}
            {discountInfo.isDiscounted && (
              <Badge variant="bestSeller" className="flex items-center gap-1">
                <Icon path={mdiTagMultiple} size={0.6} />-{discountInfo.percent}
                %
              </Badge>
            )}
            {/* Stock badge */}
            {(() => {
              if (currentStock === 0) {
                return (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Badge variant="danger" className="flex items-center gap-1">
                      <Icon path={mdiPackageVariantClosed} size={0.6} />
                      Hết hàng
                    </Badge>
                  </motion.div>
                );
              } else if (currentStock <= 5) {
                return (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Badge
                      variant="lowStock"
                      className="flex items-center gap-1"
                    >
                      <Icon path={mdiAlertOctagon} size={0.6} />
                      Sắp hết
                    </Badge>
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
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-primary hover:text-white shadow-sm border hover:shadow-2xl transition-all duration-300 group/btn border-primary"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart();
                }}
                aria-label="Thêm vào giỏ hàng"
              >
                <Icon
                  path={mdiCartArrowRight}
                  size={0.7}
                  className="group-hover/btn:animate-bounce"
                />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-pink-500 hover:text-white shadow-sm border hover:shadow-2xl transition-all duration-300 group/btn border-primary hover:border-pink-500"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToWishlist();
                }}
                aria-label="Yêu thích"
              >
                <Icon
                  path={mdiHeartCircle}
                  size={0.7}
                  className="group-hover/btn:animate-pulse"
                />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:!bg-blue-500 hover:text-white shadow-sm border hover:shadow-2xl transition-all duration-300 group/btn border-primary hover:border-blue-500"
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

        <div className="p-3 flex flex-col flex-grow bg-green-50 border-t border-gray-200 relative">
          <span className="font-semibold text-base text-primary">
            {product.brand
              ? typeof (product as any)?.brand === "string"
                ? (product as any)?.brand
                : (product as any)?.brand?.name
              : (product as any)?.gender ||
                (product as any)?.masterCategory ||
                "Product"}
          </span>
          <a
            href={`/products/${(
              product.productDisplayName || (product as any)?.name
            )
              .toLowerCase()
              .replace(/\s+/g, "-")}-${product.id}`}
            className="hover:text-primary transition-colors group/link"
          >
            <h3 className="font-bold text-base mb-2 line-clamp-2 leading-tight group-hover:text-primary/90 transition-colors duration-300 text-maintext group-hover/link:underline decoration-primary/50 underline-offset-2">
              {product.productDisplayName || (product as any)?.name}
            </h3>
          </a>

          <div>
            {basePrice > 0 ? (
              <div className="flex items-baseline justify-between">
                <motion.div
                  className="font-extrabold text-xl text-active"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {formatPrice(discountInfo.finalPrice)}
                </motion.div>
                {discountInfo.isDiscounted && (
                  <div className="text-sm text-maintext line-through font-semibold italic">
                    {formatPrice(basePrice)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-maintext italic">
                Giá chưa cập nhật
              </div>
            )}

            {product.variants?.length > 0 && (
              <div className="flex flex-col gap-1 items-start justify-start mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-maintext font-semibold whitespace-nowrap">
                    Màu sắc:
                  </span>
                  <div className="flex flex-wrap gap-1 text-sm items-center">
                    {Array.from(
                      new Set(
                        (product as any)?.variants.map((v: any) => v.color)
                      )
                    )
                      .slice(0, 5)
                      .map((color: any, index: number) => (
                        <motion.div
                          key={index}
                          className="w-4 h-4 flex-shrink-0 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                          style={{ backgroundColor: color }}
                          title={color}
                          whileHover={{ scale: 1.3 }}
                        />
                      ))}
                    {Array.from(
                      new Set(
                        (product as any)?.variants.map((v: any) => v.color)
                      )
                    ).length > 5 && (
                      <span className="text-[10px] text-maintext">
                        +
                        {Array.from(
                          new Set(
                            (product as any)?.variants.map((v: any) => v.color)
                          )
                        ).length - 5}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-maintext font-semibold whitespace-nowrap">
                    Kích thước:
                  </span>
                  <div className="flex flex-wrap gap-1 text-xs text-maintext">
                    {Array.from(
                      new Set(
                        (product as any)?.variants.map((v: any) => v.size)
                      )
                    ).join(" , ")}
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
