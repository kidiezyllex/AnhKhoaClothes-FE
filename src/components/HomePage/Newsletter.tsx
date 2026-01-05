import { Button } from "@/components/ui/button";
import { mdiCheckCircle, mdiEmailFast, mdiGift, mdiSale } from "@mdi/js";
import { Icon } from "@mdi/react";
import { motion, useInView } from "framer-motion";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const benefits = [
    { icon: mdiGift, text: "Ưu đãi đặc biệt cho thành viên" },
    { icon: mdiSale, text: "Thông báo sale sớm nhất" },
    { icon: mdiCheckCircle, text: "Xu hướng thời trang mới nhất" },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-primary/30 to-blue-400/30 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-20 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 left-1/3 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"
          animate={{
            x: [0, -60, 0],
            y: [0, -40, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Đăng ký nhận thông tin độc quyền
            </motion.h2>

            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Tham gia cộng đồng thời trang của chúng tôi để nhận những thông
              tin hot nhất về
              <span className="font-semibold text-primary"> sản phẩm mới</span>,
              <span className="font-semibold text-blue-600">
                {" "}
                khuyến mãi đặc biệt
              </span>{" "}
              và
              <span className="font-semibold text-purple-600">
                {" "}
                xu hướng thời trang
              </span>{" "}
              từ các nhà thiết kế hàng đầu.
            </motion.p>

            {/* Benefits section */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Icon
                    path={benefit.icon}
                    size={1.2}
                    className="text-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {benefit.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced form */}
            <motion.div
              className="relative max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-400/20 to-purple-400/20 rounded-2xl blur-xl opacity-60" />
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Nhập email của bạn để nhận ưu đãi..."
                          className="w-full h-14 px-6 rounded-md border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="h-14 px-8 bg-gradient-to-r from-primary via-secondary to-primary hover:from-primary/90 hover:via-secondary/90 hover:to-primary/90 text-white font-semibold rounded-md shadow-sm hover:shadow-sm transition-all duration-300 transform hover:scale-105 min-w-[160px]"
                      >
                        <span className="mr-2">Đăng ký ngay</span>
                        <Icon path={mdiEmailFast} size={1} />
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#EAEBF2] dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Icon
                      path={mdiCheckCircle}
                      size={3}
                      className="text-green-500 mx-auto mb-4"
                    />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                    Cảm ơn bạn đã đăng ký!
                  </h3>
                  <p className="text-green-600 dark:text-green-300">
                    Chúng tôi sẽ gửi những thông tin thú vị nhất đến email của
                    bạn.
                  </p>
                </motion.div>
              )}
            </motion.div>

            <motion.p
              className="text-sm text-gray-500 dark:text-gray-400 mt-6 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Bằng cách đăng ký, bạn đồng ý với
              <span className="text-primary hover:underline cursor-pointer">
                {" "}
                Chính sách bảo mật
              </span>{" "}
              của chúng tôi. Bạn có thể hủy đăng ký bất cứ lúc nào.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
