import { Icon } from "@mdi/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  mdiMapMarker,
  mdiEmail,
  mdiPhone,
  mdiClockOutline,
  mdiHeart,
} from "@mdi/js";
import { motion } from "framer-motion";

export const Footer = () => {
  const socialLinks = [
    {
      name: "linkedin",
      href: "https://www.linkedin.com/company/clothess/",
      src: "/images/linkedin.png",
      width: 60,
      height: 60,
      hoverColor: "hover:bg-blue-600",
    },
    {
      name: "google-play",
      href: "https://play.google.com/store/apps/dev?id=8799588644277179294&hl",
      src: "/images/google-play.png",
      width: 60,
      height: 60,
      hoverColor: "hover:bg-green-600",
    },
    {
      name: "app-store",
      href: "https://apps.apple.com/us/developer/commandoo-joint-stock-company/id1561328863",
      src: "/images/app-store.png",
      width: 60,
      height: 60,
      hoverColor: "hover:bg-gray-800",
    },
    {
      name: "facebook",
      href: "https://www.facebook.com/clothess",
      src: "/images/facebook.png",
      width: 60,
      height: 60,
      hoverColor: "hover:bg-blue-500",
    },
    {
      name: "tiktok",
      href: "https://www.tiktok.com/@clothess",
      src: "/images/tiktok.png",
      width: 60,
      height: 60,
      hoverColor: "hover:bg-black",
    },
  ];

  const quickLinks = [
    { name: "Về chúng tôi", href: "/about-us" },
    { name: "Sản phẩm", href: "/products" },
    { name: "Đơn hàng", href: "/orders" },
    { name: "Liên hệ", href: "/contact" },
  ];

  const supportLinks = [
    { name: "Hướng dẫn mua hàng", href: "/guide" },
    { name: "Chính sách đổi trả", href: "/return-policy" },
    { name: "Hỗ trợ khách hàng", href: "/support" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <>
      {/* Enhanced main footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-br from-primary/20 to-blue-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 -right-32 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 pt-16 pb-8">
          <div className="container mx-auto px-6">
            {/* Mobile view - Enhanced */}
            <div className="flex flex-col justify-center items-center sm:hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-blue-400/30 rounded-full blur-xl" />
                  <img
                    src="/images/logo.svg"
                    alt="Logo"
                    width={200}
                    height={134}
                    className="h-20 w-auto relative z-10 filter drop-shadow-sm"
                    draggable={false}
                  />
                </div>
              </motion.div>

              <motion.div
                className="space-y-4 mb-8 w-full max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-start gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Icon
                    path={mdiMapMarker}
                    size={1.2}
                    className="text-primary mt-1 flex-shrink-0"
                  />
                  <p className="text-gray-300 text-sm">
                    D29, Pham Van Bach Street, Cau Giay District, Ha Noi,
                    Vietnam
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Icon
                    path={mdiEmail}
                    size={1.2}
                    className="text-primary flex-shrink-0"
                  />
                  <p className="text-gray-300 text-sm">streetstore@gmail.com</p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Icon
                    path={mdiPhone}
                    size={1.2}
                    className="text-primary flex-shrink-0"
                  />
                  <p className="text-gray-300 text-sm">+84 123 456 789</p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Icon
                    path={mdiClockOutline}
                    size={1.2}
                    className="text-primary flex-shrink-0"
                  />
                  <p className="text-gray-300 text-sm">
                    8:00 - 22:00 hàng ngày
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Desktop view - Enhanced */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {/* Company Logo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-blue-400/30 rounded-full blur-xl" />
                    <img
                      src="/images/logo.svg"
                      alt="Logo"
                      width={200}
                      height={134}
                      className="h-20 w-auto relative z-10 filter drop-shadow-sm"
                      draggable={false}
                    />
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Điểm đến tin cậy cho những tín đồ thời trang. Chúng tôi mang
                    đến những sản phẩm chất lượng cao với thiết kế độc đáo và
                    phong cách hiện đại.
                  </p>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h4 className="text-lg font-semibold mb-6 text-white">
                    Thông tin liên hệ
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Icon
                        path={mdiMapMarker}
                        size={1}
                        className="text-primary mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-300 text-sm">
                        D29, Pham Van Bach Street, Cau Giay District, Ha Noi,
                        Vietnam
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon
                        path={mdiEmail}
                        size={1}
                        className="text-primary flex-shrink-0"
                      />
                      <span className="text-gray-300 text-sm">
                        streetstore@gmail.com
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon
                        path={mdiPhone}
                        size={1}
                        className="text-primary flex-shrink-0"
                      />
                      <span className="text-gray-300 text-sm">
                        +84 123 456 789
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon
                        path={mdiClockOutline}
                        size={1}
                        className="text-primary flex-shrink-0"
                      />
                      <span className="text-gray-300 text-sm">
                        8:00 - 22:00 hàng ngày
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h4 className="text-lg font-semibold mb-6 text-white">
                    Liên kết nhanh
                  </h4>
                  <ul className="space-y-3">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                        >
                          <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Support Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h4 className="text-lg font-semibold mb-6 text-white">
                    Hỗ trợ
                  </h4>
                  <ul className="space-y-3">
                    {supportLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                        >
                          <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Social Links - Desktop */}
              <motion.div
                className="flex justify-center items-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="text-gray-400 mr-4">Theo dõi chúng tôi:</span>
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 transition-all duration-300 ${link.hoverColor} hover:scale-110 hover:border-white/40 group`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={link.src}
                      alt={link.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 filter group-hover:brightness-110 transition-all duration-300"
                    />
                  </motion.a>
                ))}
              </motion.div>

              {/* Footer Bottom */}
              <motion.div
                className="border-t border-white/20 pt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex flex-wrap justify-center md:justify-start gap-6">
                    {[
                      "Điều khoản sử dụng",
                      "Chính sách bảo mật",
                      "Bản quyền",
                      "Cộng đồng",
                    ].map((item, index) => (
                      <a
                        key={index}
                        href="#"
                        className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm"
                      >
                        {item}
                      </a>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <span>©2026 Shop Quần Áo. Made with</span>
                    <Icon path={mdiHeart} size={0.8} className="text-red-500" />
                    <span>in Vietnam</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Social links - Mobile */}
            <motion.div
              className="flex justify-center items-center gap-3 sm:hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-110"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={link.src}
                    alt={link.name}
                    width={20}
                    height={20}
                    className="w-5 h-5 filter brightness-110"
                  />
                </motion.a>
              ))}
            </motion.div>

            {/* Mobile footer bottom */}
            <motion.div
              className="sm:hidden mt-8 pt-6 border-t border-white/20 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <p className="text-gray-400 text-xs flex items-center justify-center gap-2">
                <span>©2026 Shop Quần Áo. Made with</span>
                <Icon path={mdiHeart} size={0.6} className="text-red-500" />
                <span>in Vietnam</span>
              </p>
            </motion.div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
