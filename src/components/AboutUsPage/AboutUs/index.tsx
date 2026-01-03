import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@mdi/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

//                                                                                                                     Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

//                                                                                                                     Component cho các tính năng
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <motion.div
    className="bg-white backdrop-blur-md p-8 rounded-[6px] transition-all duration-300 border border-white/20"
    whileHover={{ y: -10, scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center mb-5">
      <div className="p-4 rounded-full bg-gradient-to-r from-[#2C8B3D] to-[#88C140] mr-5">
        <Icon path={icon} size={1.5} className="text-white" />
      </div>
      <h3 className="text-xl font-bold text-maintext dark:text-white">
        {title}
      </h3>
    </div>
    <p className="text-maintext dark:text-maintext">{description}</p>
  </motion.div>
);

//                                                                                                                     Component cho thành viên nhóm
const TeamMember = ({
  name,
  id,
  role,
}: {
  name: string;
  id: string;
  role: string;
}) => (
  <motion.div
    className=" bg-gradient-to-r from-[#2C8B3D80] to-[#88C14080] flex flex-col items-center justify-center gap-2 p-4 px-2 rounded-[6px] relative overflow-hidden cursor-pointer"
    whileHover={{ y: -10, scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden bg-gradient-to-r from-[#2C8B3D] to-[#F2A024] p-1 relative z-[2]">
      <img
        draggable="false"
        src="/images/member-avatar.png"
        alt={name}
        width={200}
        height={200}
        className="object-contain h-full w-full rounded-full"
      />
    </div>
    <h3 className="uppercase text-base font-bold text-center text-white relative z-[2]">
      {name}
    </h3>
    <p className="text-center text-white/80 mb-2 relative z-[2]">{id}</p>
    <p className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-white border border-white/80 bg-primary/80 transition-colors duration-200 rounded-full relative z-[2] uppercase">
      {role}
    </p>
  </motion.div>
);

//                                                                                                                     Component cho đánh giá khách hàng
const TestimonialCard = ({
  rating,
  title,
  description,
  image,
  name,
  role,
}: {
  rating: number;
  title: string;
  description: string;
  image: string;
  name: string;
  role: string;
}) => (
  <motion.div
    className="bg-white/15 backdrop-blur-md p-8 rounded-[6px] shadow-sm transition-all duration-300 border border-white/20 h-full"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-center mb-4">
      {[...Array(rating)].map((_, i) => (
        <Icon
          key={i}
          path={mdiStar}
          size={1.5}
          className="text-yellow-400 mx-1"
        />
      ))}
    </div>
    <h3 className="text-2xl font-bold text-center text-white mb-4">{title}</h3>
    <p className="text-white/80 text-center mb-8 text-lg italic">
      "{description}"
    </p>
    <div className="flex items-center justify-center">
      <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-white/30">
        <img
          src={image}
          alt={name}
          width={64}
          height={64}
          className="object-cover"
        />
      </div>
      <div>
        <h4 className="text-lg font-bold text-white">{name}</h4>
        <p className="text-white/80">{role}</p>
      </div>
    </div>
  </motion.div>
);

//                                                                                                                     Dữ liệu testimonial mở rộng
const testimonialData = [
  {
    rating: 5,
    title: "Cửa hàng giày tốt nhất!",
    description:
      "Tôi rất hài lòng với dịch vụ của AllwearStudio. Sản phẩm chất lượng, giao hàng nhanh chóng và nhân viên phục vụ rất nhiệt tình.",
    image:
      "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/elementor/thumbs/testimo-1-pjspfmypsvn72mv2l3cj4mhf4j0bl9ruu9jw5bh1eo.jpg",
    name: "Tom Robertson",
    role: "Cầu thủ bóng đá",
  },
  {
    rating: 5,
    title: "Trải nghiệm tuyệt vời!",
    description:
      "Mua sắm tại AllwearStudio là một trải nghiệm tuyệt vời. Sản phẩm đa dạng, giá cả phải chăng và dịch vụ chăm sóc khách hàng rất tốt.",
    image:
      "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/elementor/thumbs/testimo-2-pjspfoue6jprpusca45s9m0cbar20nzbiiuv3ve928.jpg",
    name: "Amelia Robinson",
    role: "Cầu thủ bóng đá",
  },
  {
    rating: 5,
    title: "Chất lượng đáng tin cậy",
    description:
      "Những đôi giày tôi mua từ AllwearStudio luôn bền đẹp và thoải mái. Tôi đã giới thiệu cửa hàng cho tất cả bạn bè của mình.",
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    name: "Michael Johnson",
    role: "Huấn luyện viên thể thao",
  },
  {
    rating: 4,
    title: "Dịch vụ tận tâm",
    description:
      "Nhân viên tại AllwearStudio luôn nhiệt tình và am hiểu về sản phẩm. Họ giúp tôi chọn được đôi giày phù hợp nhất với nhu cầu của mình.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    name: "Sarah Miller",
    role: "Người yêu thể thao",
  },
  {
    rating: 5,
    title: "Giao hàng nhanh chóng",
    description:
      "Tôi đặt hàng online và nhận được sản phẩm chỉ sau 2 ngày. Đóng gói cẩn thận và sản phẩm đúng như mô tả trên website.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    name: "David Thompson",
    role: "Doanh nhân",
  },
  {
    rating: 5,
    title: "Sản phẩm chính hãng",
    description:
      "Rất yên tâm khi mua sắm tại AllwearStudio vì họ chỉ bán hàng chính hãng. Giá cả hợp lý và chất lượng đảm bảo.",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    name: "Emily Parker",
    role: "Người mẫu",shadow-sm
  },
];

export const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/hero-about.jpg"
            alt="AllwearStudio Banner"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C8B3D]/50 via-[#88C140]/50 to-[#F2A024]/70"></div>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-normal text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="bg-clip-text text-white/80 font-light tracking-widest uppercase text-nowrap">
                Khám Phá Thế Giới
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F2A024] to-[#88C140] font-extrabold">
                AllwearStudio
              </span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-white/80 mb-10 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Nơi kết nối đam mê, nơi định nghĩa phong cách
              <br />
              Chúng tôi mang đến những sản phẩm chất lượng cao với giá cả phải
              chăng
            </motion.p>
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <a
                href="#team"
                className="flex items-center bg-transparent border border-white/80 text-white/80 font-bold py-4 px-10 rounded-full shadow-sm hover:shadow-xl transition-all duration-300 text-lg"
              >
                Gặp gỡ đội ngũ của chúng tôi
                <Icon path={mdiChevronDoubleDown} size={1.5} className="ml-2" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-maintext dark:text-white mb-8">
                Câu chuyện của chúng tôi
              </h2>
              <p className="text-lg text-maintext dark:text-maintext mb-8">
                AllwearStudio được thành lập với sứ mệnh mang đến cho khách hàng
                những sản phẩm giày chất lượng cao với giá cả phải chăng. Chúng
                tôi tin rằng mỗi người đều xứng đáng được sở hữu những đôi giày
                thoải mái và thời trang.
              </p>
              <p className="text-lg text-maintext dark:text-maintext mb-8">
                Với hơn 5 năm kinh nghiệm trong ngành, chúng tôi đã xây dựng
                được mạng lưới cung cấp sản phẩm rộng khắp, đảm bảo luôn có sẵn
                các mẫu giày mới nhất và phổ biến nhất trên thị trường.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon
                    path={mdiCheckCircle}
                    size={1}
                    className="text-[#2C8B3D] mr-3"
                  />
                  <span className="text-lg text-maintext dark:text-gray-300">
                    Sản phẩm chính hãng
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon
                    path={mdiCheckCircle}
                    size={1}
                    className="text-[#2C8B3D] mr-3"
                  />
                  <span className="text-lg text-maintext dark:text-gray-300">
                    Giao hàng nhanh chóng
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon
                    path={mdiCheckCircle}
                    size={1}
                    className="text-[#2C8B3D] mr-3"
                  />
                  <span className="text-lg text-maintext dark:text-gray-300">
                    Hỗ trợ 24/7
                  </span>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="relative h-[500px] overflow-hidden rounded-none"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#2C8B3D] to-[#F2A024] opacity-20"></div>
              <img
                src="https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/elementor/thumbs/about-sect-pjs7cmwyucho7hy38akr4ok276qbcwtfp44ksgi1sa.jpg"
                alt="AllwearStudio Store"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-[#2C8B3D]/10 to-[#F2A024]/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-maintext dark:text-white mb-4">
              Tại sao chọn AllwearStudio?
            </h2>
            <p className="text-lg text-maintext dark:text-maintext max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách
              hàng với những dịch vụ và sản phẩm chất lượng cao.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <FeatureCard
              icon={mdiCheckCircle}
              title="Sản phẩm chính hãng"
              description="Tất cả sản phẩm đều được nhập khẩu trực tiếp từ các nhà sản xuất uy tín, đảm bảo chất lượng và độ bền."
            />
            <FeatureCard
              icon={mdiTruck}
              title="Giao hàng nhanh chóng"
              description="Hệ thống logistics hiện đại giúp chúng tôi giao hàng nhanh chóng đến mọi nơi trên toàn quốc."
            />
            <FeatureCard
              icon={mdiShieldCheck}
              title="Bảo hành uy tín"
              description="Chính sách bảo hành rõ ràng, minh bạch, hỗ trợ khách hàng trong suốt quá trình sử dụng sản phẩm."
            />
            <FeatureCard
              icon={mdiStore}
              title="Mạng lưới rộng khắp"
              description="Hệ thống cửa hàng trải dài khắp các tỉnh thành, giúp khách hàng dễ dàng tiếp cận sản phẩm."
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-maintext dark:text-white mb-4">
              Đội ngũ của chúng tôi
            </h2>shadow-sm
            <p className="text-lg text-maintext dark:text-maintext max-w-2xl mx-auto">
              AllwearStudio được vận hành bởi một đội ngũ trẻ trung, năng động
              và đầy nhiệt huyết. Chúng tôi luôn nỗ lực để mang đến những sản
              phẩm và dịch vụ tốt nhất cho khách hàng.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <TeamMember
              name="Dương Đức Doanh"
              id="PH26897"
              role="Trưởng nhóm"
            />
            <TeamMember name="Lý Minh Tuấn" id="PH13422" role="Frontend DEV" />
            <TeamMember
              name="Vương Đình Cường"
              id="PH28631"
              role="Backend DEV"
            />
            <TeamMember
              name="Hoàng Anh Tuấn"
              id="PH41515"
              role="Thiết kế UI/UX"
            />
            <TeamMember
              name="Hoàng Đình Giáp"
              id="PH57655"
              role="Quản lý dự án"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-r from-[#2C8B3D] to-[#88C140]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Khách hàng nói gì về chúng tôi?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Những phản hồi từ khách hàng là động lực để chúng tôi không ngừng
              cải thiện và phát triển.
            </p>
          </motion.div>

          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            navigation={true}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="testimonial-swiper py-10"
          >
            {testimonialData.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <TestimonialCard
                  rating={testimonial.rating}
                  title={testimonial.title}
                  description={testimonial.description}
                  image={testimonial.image}
                  name={testimonial.name}
                  role={testimonial.role}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-gradient-to-r from-[#2C8B3D] via-[#88C140] to-[#F2A024] rounded-[6px] p-16 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
            <h2 className="text-4xl font-bold text-white mb-8 relative z-10">
              Sẵn sàng khám phá bộ sưu tập của chúng tôi?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto relative z-10">
              Hãy ghé thăm cửa hàng của chúng tôi hoặc mua sắm trực tuyến để tìm
              cho mình đôi giày phù hợp nhất.
            </p>
            <motion.div
              className="inline-block relative z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/products"
                className="bg-white text-[#2C8B3D] font-bold py-4 px-10 rounded-full shadow-sm hover:shadow-xl transition-all duration-300 text-lg"
              >
                Xem sản phẩm ngay
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
