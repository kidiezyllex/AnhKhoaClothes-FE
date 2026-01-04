"use client";

import CreateReturnRequestModal from "@/components/Returns/CreateReturnRequestModal";
import ReturnDetailModal from "@/components/Returns/ReturnDetailModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyReturns, useReturnableOrders } from "@/hooks/return";
import { IReturn, IReturnableOrder } from "@/interface/response/return";
import { mdiCalendar, mdiCurrencyUsd, mdiPackageVariant } from "@mdi/js";
import { Icon } from "@mdi/react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";

export default function CustomerReturnsPage() {
  const [selectedTab, setSelectedTab] = useState("returnable");
  const [selectedOrder, setSelectedOrder] = useState<IReturnableOrder | null>(
    null
  );
  const [selectedReturn, setSelectedReturn] = useState<IReturn | null>(null);
  const [returnableParams, setReturnableParams] = useState({
    page: 1,
    limit: 10,
  });
  const [myReturnsParams, setMyReturnsParams] = useState({
    page: 1,
    limit: 10,
  });

  const { data: returnableOrders, isLoading: loadingReturnable } =
    useReturnableOrders(returnableParams);
  const { data: myReturns, isLoading: loadingMyReturns } =
    useMyReturns(myReturnsParams);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CHO_XU_LY":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-600 border-yellow-200"
          >
            Chờ xử lý
          </Badge>
        );
      case "DA_HOAN_TIEN":
        return (
          <Badge
            variant="outline"
            className="bg-[#EAEBF2] text-green-600 border-green-200"
          >
            Đã hoàn tiền
          </Badge>
        );
      case "DA_HUY":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const ReturnableOrderCard = ({ order }: { order: IReturnableOrder }) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">#{order.code}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-700 mt-1">
              <div className="flex items-center gap-1">
                <Icon path={mdiCalendar} size={0.8} />
                {formatDate(order.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Icon path={mdiCurrencyUsd} size={0.8} />
                {formatCurrency(order.total)}
              </div>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(order)}
              >
                <Icon path={mdiPackageVariant} size={0.8} className="mr-1" />
                Yêu cầu trả hàng
              </Button>
            </DialogTrigger>
            <CreateReturnRequestModal order={selectedOrder} />
          </Dialog>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex-shrink-0">
              <img
                src={item.product.images[0] || "/placeholder.jpg"}
                alt={item.product.name}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="flex-shrink-0 w-15 h-15 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-700">
              +{order.items.length - 3}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const MyReturnCard = ({ returnItem }: { returnItem: IReturn }) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">#{returnItem.code}</h3>
            <p className="text-sm text-gray-700">
              Đơn gốc: #
              {typeof returnItem.originalOrder === "string"
                ? returnItem.originalOrder
                : returnItem.originalOrder.code}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-700 mt-1">
              <div className="flex items-center gap-1">
                <Icon path={mdiCalendar} size={0.8} />
                {formatDate(returnItem.createdAt)}
              </div>
              <div className="flex items-center gap-1">
                <Icon path={mdiCurrencyUsd} size={0.8} />
                {formatCurrency(returnItem.totalRefund)}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getStatusBadge(returnItem.status)}
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReturn(returnItem)}
                  >
                    <Icon path={mdiEye} size={0.8} className="mr-1" />
                    Chi tiết
                  </Button>
                </DialogTrigger>
                <ReturnDetailModal returnItem={selectedReturn} />
              </Dialog>
              {returnItem.status === "CHO_XU_LY" && (
                <Button variant="destructive" size="sm">
                  Hủy yêu cầu
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {returnItem.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex-shrink-0">
              <img
                src={"/placeholder.jpg"}
                alt="Product"
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
            </div>
          ))}
          {returnItem.items.length > 3 && (
            <div className="flex-shrink-0 w-15 h-15 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-700">
              +{returnItem.items.length - 3}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Quản lý trả hàng</h1>
        <p className="text-gray-700">
          Xem đơn hàng có thể trả và quản lý yêu cầu trả hàng của bạn
        </p>
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="returnable">Đơn hàng có thể trả</TabsTrigger>
          <TabsTrigger value="my-returns">Yêu cầu trả hàng của tôi</TabsTrigger>
        </TabsList>

        <TabsContent value="returnable" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng có thể trả hàng</CardTitle>
              <p className="text-sm text-gray-700">
                Chỉ hiển thị đơn hàng đã hoàn thành trong vòng 7 ngày qua
              </p>
            </CardHeader>
            <CardContent>
              {loadingReturnable ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-gray-100 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : returnableOrders?.data.orders.length === 0 ? (
                <div className="text-center py-8">
                  <Icon
                    path={mdiPackageVariant}
                    size={2}
                    className="mx-auto text-gray-400 mb-4"
                  />
                  <p className="text-gray-700">
                    Không có đơn hàng nào có thể trả
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {returnableOrders?.data.orders.map((order) => (
                    <ReturnableOrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yêu cầu trả hàng của tôi</CardTitle>
              <p className="text-sm text-gray-700">
                Theo dõi trạng thái các yêu cầu trả hàng đã gửi
              </p>
            </CardHeader>
            <CardContent>
              {loadingMyReturns ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-gray-100 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : myReturns?.data.returns.length === 0 ? (
                <div className="text-center py-8">
                  <Icon
                    path={mdiPackageVariant}
                    size={2}
                    className="mx-auto text-gray-400 mb-4"
                  />
                  <p className="text-gray-700">
                    Bạn chưa có yêu cầu trả hàng nào
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReturns?.data.returns.map((returnItem) => (
                    <MyReturnCard
                      key={(returnItem as any)?.id}
                      returnItem={returnItem}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
