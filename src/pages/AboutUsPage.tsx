"use client";

import { Card } from "@/components/ui/card";
import React from "react";

const AboutUsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Về Chúng Tôi</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Giới Thiệu
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Chào mừng bạn đến với cửa hàng thời trang của chúng tôi. Chúng tôi cam
          kết mang đến những sản phẩm chất lượng cao với giá cả hợp lý.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Với đội ngũ nhân viên nhiệt tình và chuyên nghiệp, chúng tôi luôn sẵn
          sàng phục vụ quý khách hàng một cách tốt nhất.
        </p>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sứ Mệnh</h2>
        <p className="text-gray-600 leading-relaxed">
          Sứ mệnh của chúng tôi là mang đến cho khách hàng những trải nghiệm mua
          sắm tuyệt vời nhất với các sản phẩm thời trang đa dạng, phong cách và
          chất lượng.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Liên Hệ</h2>
        <div className="space-y-2 text-gray-600">
          <p>
            <strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP. HCM
          </p>
          <p>
            <strong>Email:</strong> contact@example.com
          </p>
          <p>
            <strong>Điện thoại:</strong> (028) 1234 5678
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AboutUsPage;
