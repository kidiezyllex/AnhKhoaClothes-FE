import React, { useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icon } from "@mdi/react";
import { mdiArrowRight } from "@mdi/js";

//                                                                                                                     Dữ liệu cho các bộ sưu tập
const collectionsData = [
  {
    id: 1,
    title: "Nam",
    subtitle: "Thời trang",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    url: "/collections/men",
  },
  {
    id: 2,
    title: "Nữ",
    subtitle: "Thời trang",
    image:
      "https://plus.unsplash.com/premium_photo-1668896122554-2a4456667f65?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    url: "/collections/women",
  },
  {
    id: 3,
    title: "Trẻ em",
    subtitle: "Thời trang",
    image:
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=986&q=80",
    url: "/collections/kids",
  },
];

//                                                                                                                     Component thẻ bộ sưu tập
const CollectionCard = ({
  collection,
  animation,
}: {
  collection: (typeof collectionsData)[0];
  animation: "fadeInLeft" | "fadeInUp" | "fadeInRight";
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  //                                                                                                                     Xác định animation dựa trên prop
  const getInitialAnimation = () => {
    switch (animation) {
      case "fadeInLeft":
        return { opacity: 0, x: -70 };
      case "fadeInRight":
        return { opacity: 0, x: 70 };
      default:
        return { opacity: 0, y: 70 };
    }
  };

  const getTargetAnimation = () => {
    switch (animation) {
      case "fadeInLeft":
      case "fadeInRight":
        return { opacity: 1, x: 0 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialAnimation()}
      animate={isInView ? getTargetAnimation() : getInitialAnimation()}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="relative overflow-hidden h-[450px] group shadow-sm hover:shadow-sm transition-shadow duration-500"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 z-0"
        style={{ backgroundImage: `url(${collection.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/60 group-hover:via-black/30 group-hover:to-black/10 transition-colors duration-500 z-10" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-4 z-20">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Button
              asChild
              variant="ghost"
              className="self-start mb-4 text-white hover:text-primary-foreground bg-white/10 hover:bg-primary transition-all duration-300 group rounded-full px-4 py-5"
            >
              <a href={collection.url}>
                <span className="flex items-center text-sm font-medium">
                  Khám phá ngay
                  <Icon
                    path={mdiArrowRight}
                    size={0.7}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </a>
            </Button>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="transform group-hover:translate-y-[-8px] transition-transform duration-500"
        >
          <h3 className="text-outline-white uppercase text-4xl font-bold text-white mb-2 group-hover:text-primary-foreground transition-colors duration-300">
            {collection.title}
          </h3>
          <h3 className="text-2xl font-bold text-white/80 group-hover:text-primary-foreground/80 transition-colors duration-300">
            {collection.subtitle}
          </h3>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const Collections = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section className="py-20 bg-muted/30 dark:bg-gray-900/95 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="container mx-auto">
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
                  Bộ sưu tập
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
                  Xem tất cả bộ sưu tập
                  <Icon
                    path={mdiArrowRight}
                    size={0.7}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </motion.div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-maintext dark:text-white">
              BỘ SƯU TẬP <span className="text-extra">THỜI TRANG</span>
            </h2>
          </motion.div>
        </div>

        {/* Collection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CollectionCard
            collection={collectionsData[0]}
            animation="fadeInLeft"
          />
          <CollectionCard
            collection={collectionsData[1]}
            animation="fadeInUp"
          />
          <CollectionCard
            collection={collectionsData[2]}
            animation="fadeInRight"
          />
        </div>

        {/* Mobile Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex justify-center md:hidden"
        >
          <Button
            variant="outline"
            className="uppercase group border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 text-sm font-medium rounded-full px-4 py-5 h-auto"
          >
            Xem tất cả bộ sưu tập
            <Icon
              path={mdiArrowRight}
              size={0.7}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Collections;
