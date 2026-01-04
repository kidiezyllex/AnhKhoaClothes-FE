import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  mdiArrowRight,
  mdiCartArrowRight,
  mdiEye,
  mdiHeartCircle,
  mdiStar,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { InteractiveHoverButton } from "../Common/InteractiveHoverButton";

//                                                                                                                     Dữ liệu sản phẩm mới
const newArrivalsData = [
  {
    id: 1,
    name: "Áo Thun Nam Form Rộng Premium",
    price: 299000,
    originalPrice: 399000,
    discount: 25,
    image:
      "https://bizweb.dktcdn.net/thumb/large/100/287/440/products/ao-thun-nam-nu-form-rong-davies-hoa-tiet-phoi-chu-mau-tuong-phan-phong-cach-hiphop-mau-den-1-f31adeaa-9e80-4c3f-a483-0b0b0719dc6d.jpg?v=1748593325673",
    rating: 5,
    slug: "ao-thun-nam-form-rong-premium",
    brand: "Davies",
    colors: ["Đen", "Trắng", "Xanh"],
    isBestSeller: true,
    stock: 15,
  },
  {
    id: 2,
    name: "Áo Khoác Bomber Có Mũ Phối Lông",
    price: 549000,
    originalPrice: 699000,
    discount: 21,
    image: "/images/products/product-2.jpg",
    rating: 4,
    slug: "ao-khoac-bomber-co-mu-phoi-long",
    brand: "Local Brand",
    colors: ["Đen", "Xám", "Navy"],
    isBestSeller: false,
    stock: 20,
  },
  {
    id: 3,
    name: "Áo Thun Unisex Họa Tiết Camo",
    price: 259000,
    originalPrice: 319000,
    discount: 19,
    image: "/images/products/product-3.jpg",
    rating: 5,
    slug: "ao-thun-unisex-hoa-tiet-camo",
    brand: "Street Style",
    colors: ["Đen", "Xanh rêu", "Xám"],
    isBestSeller: true,
    stock: 8,
  },
  {
    id: 4,
    name: "Áo Khoác Bomber Chống Nước",
    price: 449000,
    originalPrice: 559000,
    discount: 20,
    image: "/images/products/product-4.jpg",
    rating: 4,
    slug: "ao-khoac-bomber-chong-nuoc",
    brand: "Urban Wear",
    colors: ["Đen", "Navy", "Olive"],
    isBestSeller: false,
    stock: 12,
  },
];

//                                                                                                                     Fallback images nếu không tải được từ path
const fallbackImages = [
  "https://bizweb.dktcdn.net/thumb/large/100/287/440/products/ao-thun-nam-nu-form-rong-davies-hoa-tiet-phoi-chu-mau-tuong-phan-phong-cach-hiphop-mau-den-1-f31adeaa-9e80-4c3f-a483-0b0b0719dc6d.jpg?v=1748593325673",
  "https://bizweb.dktcdn.net/thumb/large/100/287/440/products/ao-khoac-bomber-co-mu-phoi-long-vu-local-brand-davies-6.jpg?v=1748075564577",
  "https://bizweb.dktcdn.net/thumb/large/100/287/440/products/ao-thun-local-brand-form-rong-in-hoa-tiet-camo-mau-den-trang-tay-lo-nam-nu-7.jpg?v=1734765485657",
  "https://bizweb.dktcdn.net/thumb/large/100/287/440/products/ao-khoac-bomber-nu-nam-local-brand-mau-den-vai-du-khang-nuoc-1.jpg?v=1717745742377",
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1 items-center">
      {[...Array(5)].map((_, i) => (
        <Icon
          key={i}
          path={mdiStar}
          size={0.8}
          className={i < rating ? "text-amber-500" : "text-gray-300"}
        />
      ))}
      <span className="text-xs text-gray-700 ml-1">({rating}.0)</span>
    </div>
  );
};

// Product badges are now handled directly in ProductCard using the Badge component variants.

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
                  : color === "Đỏ"
                  ? "#EF4444"
                  : color === "Hồng"
                  ? "#EC4899"
                  : color === "Xám"
                  ? "#6B7280"
                  : color === "Cam"
                  ? "#F97316"
                  : color === "Navy"
                  ? "#1E3A8A"
                  : color === "Olive"
                  ? "#65A30D"
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
  product: (typeof newArrivalsData)[0];
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
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.discount > 0 && (
              <Badge variant="promotion">-{product.discount}%</Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="bestSeller">Best Seller</Badge>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

          <img
            src={fallbackImages[index % fallbackImages.length]}
            alt={product.name}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            draggable="false"
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
            <Icon path={mdiEye} size={0.8} className="text-gray-700" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full w-9 h-9 bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm flex items-center justify-center"
            title="Yêu thích"
          >
            <Icon path={mdiHeartCircle} size={0.8} className="text-gray-700" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full w-9 h-9 bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm flex items-center justify-center"
            title="Thêm vào giỏ hàng"
          >
            <Icon
              path={mdiCartArrowRight}
              size={0.8}
              className="text-gray-700"
            />
          </Button>
        </div>
      </a>

      <div className="p-4 pb-0 flex flex-col gap-1">
        <div className="text-xs font-medium text-[#2C8B3D] uppercase tracking-wider">
          {product.brand}
        </div>
        <h3 className="text-gray-700 dark:text-white font-semibold text-lg truncate group-hover:text-[#2C8B3D] transition-colors duration-200">
          <a href={`/products/${product.slug}`}>{product.name}</a>
        </h3>
        <div className="">
          <RatingStars rating={product.rating} />
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-bold text-lg bg-gradient-to-r from-[#2C8B3D] to-[#88C140] bg-clip-text text-transparent">
            {formatPrice((product as any)?.price)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-700 line-through">
              {formatPrice((product as any)?.originalPrice)}
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
            size={0.8}
            className="ml-2 group-hover:translate-x-1 transition-transform"
          />
        </InteractiveHoverButton>
      </div>
    </motion.div>
  );
};

export const NewArrivals = () => {
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
    <section
      style={{
        backgroundImage: "url(/images/new-arrivals.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="py-20 pt-12 bg-gradient-to-b from-white to-[#F8FBF6] dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto">
        {/* Header Section */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold tracking-wider text-[#2C8B3D] uppercase bg-[#E9F5E2] rounded-full">
            Mới ra mắt
          </span>
          <h2 className="text-3xl font-bold text-center mb-4 relative">
            <span className="inline-block relative">
              <span className="uppercase bg-gradient-to-r from-[#2C8B3D] to-[#88C140] bg-clip-text text-transparent drop-shadow-sm">
                Sản phẩm mới nhất
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </span>
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Khám phá bộ sưu tập thời trang mới nhất với chất liệu cao cấp và
            thiết kế hiện đại
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {newArrivalsData.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
