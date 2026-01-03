"use client";

import React, { useEffect, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
function PaymentResultContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");
  const success = searchParams.get("success") === "true";
  const message = searchParams.get("message") || "";

  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-xl mx-auto bg-white rounded-[6px] shadow-sm p-8">
        <div className="text-center">
          {success ? (
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          ) : (
            <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
          )}

          <h2 className="mt-4 text-2xl font-semibold text-maintext">
            {success ? "Thanh toán thành công" : "Thanh toán thất bại"}
          </h2>

          <p className="mt-2 text-maintext">{message}</p>

          {orderId && (
            <p className="mt-2 text-sm text-maintext">Mã đơn hàng: {orderId}</p>
          )}

          <div className="mt-8 space-y-4">
            <a
              href={`/orders/${orderId}`}
              className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-[6px] hover:bg-indigo-700"
            >
              Xem chi tiết đơn hàng
            </a>

            <a
              href="/"
              className="block w-full bg-gray-100 text-maintext py-2 px-4 rounded-[6px] hover:bg-gray-200"
            >
              Về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <PaymentResultContent />
    </Suspense>
  );
}
