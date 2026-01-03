import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icon } from "@mdi/react";
import {
  mdiCartOutline,
  mdiHeartOutline,
  mdiStar,
  mdiEye,
  mdiArrowRight,
  mdiArrowLeft,
} from "@mdi/js";
import { InteractiveHoverButton } from "../Common/InteractiveHoverButton";

const bestSellerData = [
  {
    id: 1,
    name: "DSW Original Denim Pants",
    price: 550000,
    originalPrice: 650000,
    discount: 15,
    image:
      "//bizweb.dktcdn.net/thumb/large/100/287/440/products/quan-jean-ong-rong-nam-nu-davies-hoa-tiet-theu-chu-chi-noi-dam-chat-hiphop-mau-den-1-e12f0f46-c931-48df-810a-32d6801dc9b9.jpg?v=1749181163443",
    rating: 5,
    slug: "quan-jean-ong-rong-theu-chu-chi-noi-d-q8",
    brand: "DAVIES",
    colors: ["Đen", "Xanh đen"],
    isBestSeller: true,
    stock: 8,
  },
  {
    id: 2,
    name: "DSW Prickly Tee",
    price: 350000,
    originalPrice: 420000,
    discount: 17,
    image:
      "//bizweb.dktcdn.net/thumb/large/100/287/440/products/ao-phong-rong-nam-nu-in-chu-davies-hoa-tiet-gai-mau-den-phong-cach-hiphop-duong-pho-tay-lo-1.jpg?v=1748918666657",
    rating: 5,
    slug: "ao-phong-rong-nam-nu-in-chu-hoa-tiet-gai-d-t33",
    brand: "DAVIES",
    colors: ["Đen", "Trắng"],
    isBestSeller: true,
    stock: 12,
  },
  {
    id: 3,
    name: "DSW Dark Whisper Tee",
    price: 350000,
    originalPrice: 420000,
    discount: 17,
    image:
      "//bizweb.dktcdn.net/thumb/large/100/287/440/products/ao-thun-hiphop-duong-pho-nam-nu-davies-in-hoa-tiet-chu-cach-dieu-form-rong-tay-ngan-mau-den-1-86db8e6b-431a-4755-b19e-fc812362bff7.jpg?v=1748600994207",
    rating: 5,
    slug: "ao-thun-hiphop-duong-pho-hinh-in-chu-cach-dieu-d-t32",
    brand: "DAVIES",
    colors: ["Đen", "Trắng"],
    isBestSeller: true,
    stock: 10,
  },
  {
    id: 4,
    name: "DSW Spark Tee",
    price: 350000,
    originalPrice: 420000,
    discount: 17,
    image:
      "//bizweb.dktcdn.net/thumb/large/100/287/440/products/ao-thun-form-rong-tay-ngan-in-chu-davies-hoa-tiet-sam-set-tia-lua-loang-mau-dam-chat-hiphop-mau-den-1.jpg?v=1748592652377",
    rating: 5,
    slug: "ao-thun-form-rong-hoa-tiet-sam-set-tia-lua-loang-mau-d-t31",
    brand: "DAVIES",
    colors: ["Đen", "Cam", "Vàng"],
    isBestSeller: true,
    stock: 15,
  },
  {
    id: 5,
    name: "DSW Young Vietnamese Tee",
    price: 350000,
    originalPrice: 420000,
    discount: 17,
    image:
      "//bizweb.dktcdn.net/thumb/large/100/287/440/products/ao-thun-nam-nu-form-rong-davies-hoa-tiet-phoi-chu-mau-tuong-phan-phong-cach-hiphop-mau-den-1-f31adeaa-9e80-4c3f-a483-0b0b0719dc6d.jpg?v=1748593325673",
    rating: 5,
    slug: "ao-thun-nam-nu-form-rong-hoa-tiet-phoi-chu-tuong-phan-d-t30",
    brand: "DAVIES",
    colors: ["Đen", "Trắng"],
    isBestSeller: true,
    stock: 18,
  },
  {
    id: 6,
    name: "DSW Hunter Hooded Bomber Jacket",
    price: 585000,
    originalPrice: 720000,
    discount: 19,
    image:
      "//bizweb.dktcdn.net/thumb/large/100/287/440/products/ao-khoac-bomber-co-mu-phoi-long-vu-local-brand-davies-6.jpg?v=1748075564577",
    rating: 5,
    slug: "ao-khoac-bomber-co-mu-hunter-hooded-jacket",
    brand: "DAVIES",
    colors: ["Đen", "Xanh rêu"],
    isBestSeller: true,
    stock: 6,
  },
  {
    id: 7,
    name: "DSW Fleece Zip-Up Jacket",
    price: 490000,
    originalPrice: 590000,
    discount: 17,
    image:
      "//bizweb.dktcdn.net/thumb/large/100/287/440/products/ao-khoac-long-cuu-hoa-tiet-camo-davies-co-tru-phoi-vien-kem-lot-du-logo-su-hiphop-zipper-1.jpg?v=1747987600177",
    rating: 4,
    slug: "ao-khoac-long-cuu-hoa-tiet-camo-co-tru-d-ak16",
    brand: "DAVIES",
    colors: ["Xanh rêu", "Đen", "Kem"],
    isBestSeller: false,
    stock: 8,
  },
  {
    id: 8,
    name: "DSW Davies Crew Puffer Vest",
    price: 475000,
    originalPrice: 570000,
    discount: 17,
    image:
      "//bizweb.dktcdn.net/thumb/large/100/287/440/products/ao-khoac-gile-nam-nu-hiphop-davies-hoa-tiet-chan-phao-khoa-keo-logo-inox-in-chu-1.jpg?v=1747717003593",
    rating: 4,
    slug: "ao-khoac-gile-nam-nu-hiphop-chan-phao-d-ak15",
    brand: "DAVIES",
    colors: ["Đen", "Xám"],
    isBestSeller: false,
    stock: 12,
  },
];

const fallbackImages = [
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-1-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-2-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-4-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-5-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-7-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-6-300x300.jpg",
  "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-3-300x300.jpg",
];

//                                                                                                                     Component hiển thị rating stars
const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1 items-center">
      {[...Array(5)].map((_, i) => (
        <Icon
          key={i}
          path={mdiStar}
          size={0.7}
          className={i < rating ? "text-amber-500" : "text-gray-300"}
        />
      ))}
      <span className="text-xs text-maintext ml-1">({rating}.0)</span>
    </div>
  );
};

//                                                                                                                     Component thẻ giảm giá
const DiscountBadge = ({ discount }: { discount: number }) => {
  if (!discount) return null;

  return (
    <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-none font-medium text-xs text-white bg-gradient-to-r from-red-500 to-amber-500">
      -{discount}%
    </div>
  );
};

//                                                                                                                     Component thẻ best seller
const BestSellerBadge = ({ isBestSeller }: { isBestSeller: boolean }) => {
  if (!isBestSeller) return null;

  return (
    <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-none font-medium text-xs text-white bg-gradient-to-r from-[#2C8B3D] to-[#88C140]">
      Best Seller
    </div>
  );
};

//                                                                                                                     Component hiển thị màu sắc
const ColorOptions = ({ colors }: { colors: string[] }) => {
  return (
    <div className="flex gap-1 items-center">
      {colors.map((color, i) => (
        <div key={i} className="group relative">
          <div
            className="w-4 h-4 rounded-full border cursor-pointer hover:scale-110 transition-transform duration-200"
            style={{
              backgroundColor:
                color === "Đen"
                  ? "black"
                  : color === "Trắng"
                  ? "white"
                  : color === "Xanh"
                  ? "#3B82F6"
                  : color === "Xanh đen"
                  ? "#1e293b"
                  : color === "Đỏ"
                  ? "#EF4444"
                  : color === "Hồng"
                  ? "#EC4899"
                  : color === "Xám"
                  ? "#6B7280"
                  : color === "Cam"
                  ? "#F97316"
                  : color === "Vàng"
                  ? "#EAB308"
                  : color === "Kem"
                  ? "#FEF3C7"
                  : color === "Xanh rêu"
                  ? "#4D7C0F"
                  : "#9CA3AF",
            }}
          />
        </div>
      ))}
    </div>
  );
};

//                                                                                                                     Component card sản phẩm
const ProductCard = ({
  product,
  index,
}: {
  product: (typeof bestSellerData)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  //                                                                                                                     Format giá tiền sang VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-gray-800 rounded-[6px] overflow-hidden shadow-sm hover:shadow-sm transition-all duration-300 pb-4 flex flex-col border border-gray-100"
    >
      <a
        href={`/products/${product.slug}`}
        className="block relative overflow-hidden"
      >
        <div className="relative aspect-square w-full overflow-hidden">
          {product.discount > 0 && (
            <DiscountBadge discount={product.discount} />
          )}
          {product.isBestSeller && (
            <BestSellerBadge isBestSeller={product.isBestSeller} />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

          <img
            src={
              product.image.startsWith("//")
                ? `https:${product.image}`
                : product.image
            }
            alt={product.name}
            className="object-cover transition-transform duration-700 group-hover:scale-110 w-full h-full"
            draggable="false"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackImages[index % fallbackImages.length];
            }}
          />
        </div>
        {/* Quick action buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center items-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full w-9 h-9 bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm flex items-center justify-center"
            title="Xem nhanh"
          >
            <Icon path={mdiEye} size={0.7} className="text-maintext" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full w-9 h-9 bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm flex items-center justify-center"
            title="Yêu thích"
          >
            <Icon path={mdiHeartOutline} size={0.7} className="text-maintext" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full w-9 h-9 bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm flex items-center justify-center"
            title="Thêm vào giỏ hàng"
          >
            <Icon path={mdiCartOutline} size={0.7} className="text-maintext" />
          </Button>
        </div>
      </a>

      <div className="p-4 pb-0 flex flex-col gap-1">
        <div className="text-xs font-medium text-[#2C8B3D] uppercase tracking-wider">
          {product.brand}
        </div>
        <h3 className="text-maintext dark:text-white font-semibold text-lg truncate group-hover:text-[#2C8B3D] transition-colors duration-200">
          <a href={`/products/${product.slug}`}>{product.name}</a>
        </h3>
        <div className="">
          <RatingStars rating={product.rating} />
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-bold text-lg bg-gradient-to-r from-[#2C8B3D] to-[#88C140] bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-maintext line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="flex gap-1 items-center justify-between mb-4">
          <ColorOptions colors={product.colors} />

          {product.stock <= 10 && (
            <div className="text-xs text-orange-600 font-medium">
              (Chỉ còn {product.stock} sản phẩm)
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-end flex-1">
        <InteractiveHoverButton className="rounded-none uppercase font-normal w-fit">
          Xem chi tiết
          <Icon
            path={mdiArrowRight}
            size={0.7}
            className="ml-2 group-hover:translate-x-1 transition-transform"
          />
        </InteractiveHoverButton>
      </div>
    </motion.div>
  );
};

export const BestSeller = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="py-20 pt-12 bg-[#FAFAFB] dark:bg-gray-900">
      <div className="container mx-auto">
        {/* Header Section */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-[#2C8B3D] uppercase bg-[#E9F5E2] rounded-full">
            Bán chạy nhất
          </span>
          <h2 className="text-3xl font-bold text-center mb-4 relative">
            <span className="inline-block relative">
              <span className="uppercase bg-gradient-to-r from-[#2C8B3D] to-[#88C140] bg-clip-text text-transparent drop-shadow-sm">
                Sản phẩm bán chạy
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </span>
          </h2>
          <p className="text-maintext dark:text-gray-300 max-w-2xl mx-auto">
            Khám phá những sản phẩm bán chạy nhất với chất lượng và thiết kế
            vượt trội
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bestSellerData.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        <div className="flex w-full flex-col items-center justify-end flex-1 mt-8">
          <InteractiveHoverButton className="!rounded-full uppercase font-normal w-fit">
            Xem tất cả
            <Icon
              path={mdiArrowLeft}
              size={1}
              className="
        ml-2 group-hover:translate-x-1 transition-transform transform scale-x-[-1]"
            />
          </InteractiveHoverButton>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
