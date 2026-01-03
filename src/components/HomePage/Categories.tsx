import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight, mdiArrowRight } from "@mdi/js";
import { Button } from "../ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-cards";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

const categories = [
  {
    id: 1,
    name: "Áo thun nam",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    productCount: 150,
    slug: "ao-thun-nam",
    description: "Bộ sưu tập áo thun nam đa dạng, phong cách và thoải mái",
    featured: true,
    badge: "Bán chạy",
    discount: 15,
  },
  {
    id: 2,
    name: "Váy nữ",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    productCount: 120,
    slug: "vay-nu",
    description: "Váy nữ thời trang, thiết kế thanh lịch cho mọi dịp",
    featured: false,
    badge: "Mới",
    discount: 0,
  },
  {
    id: 3,
    name: "Quần jeans",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    productCount: 200,
    slug: "quan-jeans",
    description: "Quần jeans nam nữ chất lượng cao, form dáng hiện đại",
    featured: true,
    badge: "Hot",
    discount: 10,
  },
  {
    id: 4,
    name: "Áo sơ mi",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    productCount: 90,
    slug: "ao-so-mi",
    description: "Áo sơ mi công sở và dạo phố, phong cách lịch lãm",
    featured: false,
    badge: "",
    discount: 5,
  },
  {
    id: 5,
    name: "Đầm dự tiệc",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    productCount: 75,
    slug: "dam-du-tiec",
    description: "Đầm dự tiệc sang trọng, tôn lên vẻ đẹp quyến rũ",
    featured: true,
    badge: "Sale",
    discount: 20,
  },
  {
    id: 6,
    name: "Áo khoác",
    image:
      "https://images.unsplash.com/photo-1715408153725-186c6c77fb45?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    productCount: 85,
    slug: "ao-khoac",
    description: "Áo khoác thời trang, giữ ấm và phong cách",
    featured: false,
    badge: "Mới",
    discount: 8,
  },
  {
    id: 7,
    name: "Đồ thể thao",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    productCount: 110,
    slug: "do-the-thao",
    description: "Đồ thể thao chất lượng cao, thoải mái khi vận động",
    featured: true,
    badge: "Hot",
    discount: 12,
  },
  {
    id: 8,
    name: "Thời trang trẻ em",
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    productCount: 95,
    slug: "thoi-trang-tre-em",
    description: "Thời trang trẻ em đáng yêu, chất liệu an toàn",
    featured: false,
    badge: "",
    discount: 15,
  },
];

//                                                                                                                     Component Badge hiển thị nhãn cho sản phẩm
const Badge = ({ text }: { text: string }) => {
  if (!text) return null;

  return (
    <div className="absolute top-4 right-4 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-extra text-white px-3 py-1 rounded-full text-xs font-medium"
      >
        {text}
      </motion.div>
    </div>
  );
};

//                                                                                                                     Component DiscountTag hiển thị phần trăm giảm giá
const DiscountTag = ({ discount }: { discount: number }) => {
  if (!discount) return null;

  return (
    <div className="absolute top-4 left-4 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="bg-red-medium text-white px-2 py-1 rounded-[6px] text-xs font-bold"
      >
        -{discount}%
      </motion.div>
    </div>
  );
};

const CategoryCard = ({
  category,
  index,
}: {
  category: (typeof categories)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
    hover: {
      y: -12,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.2,
      },
    },
    hover: {
      color: "#2C8B3D", //                                                                                                                     primary color
      transition: { duration: 0.2 },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.8,
      transition: {
        duration: 0.3,
        delay: 0.3,
      },
    },
    hover: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative overflow-hidden rounded-[6px] shadow-sm hover:shadow-sm transition-all duration-300 h-full"
    >
      <a href={`/categories/${category.slug}`} className="block group h-full">
        <div className="aspect-[4/5] relative overflow-hidden h-full">
          <Badge text={category.badge} />
          <DiscountTag discount={category.discount} />

          <motion.div className="h-full w-full">
            <img
              src={category.image}
              alt={category.name}
              className="object-cover"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-main-dark-blue/80 via-main-dark-blue/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <motion.div className="text-white space-y-2">
                <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                <motion.p className="text-gray-200 text-sm line-clamp-2 mb-3">
                  {category.description}
                </motion.p>
                <div className="flex items-center justify-between">
                  <p className="text-gray-200 text-sm flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                    {category.productCount} sản phẩm
                  </p>
                  <motion.span
                    initial={{ opacity: 0.8, x: 0 }}
                    whileHover={{ opacity: 1, x: 5 }}
                    className="text-primary flex items-center text-sm font-medium"
                  >
                    Xem thêm
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

const NavigationButton = ({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`absolute top-1/2 z-10 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-white/50 dark:bg-gray-800/80 rounded-full shadow-sm border border-primary/30 text-primary ${
        direction === "prev" ? "left-2 md:left-5" : "right-2 md:right-5"
      }`}
    >
      <Icon
        path={direction === "prev" ? mdiChevronLeft : mdiChevronRight}
        size={1}
      />
    </motion.button>
  );
};

export const Categories = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -200px 0px",
  });
  const swiperRef = useRef<any>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .categories-swiper .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
        background: #D1D5DB;
        opacity: 0.5;
        transition: all 0.3s ease;
      }
      .categories-swiper .swiper-pagination-bullet-active {
        width: 24px;
        border-radius: 5px;
        background: var(--primary-color, #2C8B3D);
        opacity: 1;
      }
      .categories-swiper .swiper-pagination {
        position: relative;
        margin-top: 40px;
      }
      .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next,
      .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev {
        transform: scale(0.8);
      }
      .swiper-slide {
        height: auto;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 bg-white dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center md:text-left w-full"
          >
            <div className="flex items-center w-full gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-start mb-4 relative">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm ">
                  Danh mục
                </span>
              </h2>
              <div className="flex-1 h-[1px] bg-primary"></div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="mt-6 md:mt-0 hidden md:block"
              >
                <Button
                  variant="outline"
                  className="uppercase group border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 text-sm font-medium rounded-full px-4 py-2 h-auto"
                >
                  Xem tất cả danh mục
                  <Icon
                    path={mdiArrowRight}
                    size={0.7}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </motion.div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-maintext dark:text-white">
              THỜI TRANG <span className="text-extra">HOT TREND 2026</span>
            </h2>
          </motion.div>
        </div>

        {/* Swiper Component */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative categories-swiper"
        >
          <NavigationButton direction="prev" onClick={handlePrev} />

          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            spaceBetween={20}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            modules={[Pagination, Navigation, Autoplay]}
            className="mySwiper"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={(category as any)?.id}>
                <CategoryCard category={category} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>

          <NavigationButton direction="next" onClick={handleNext} />
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
