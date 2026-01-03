'use client';

import { useState, useEffect } from 'react';
 
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@mdi/react';
import { mdiArrowLeft, mdiPlus, mdiTrashCanOutline } from '@mdi/js';
import { useCreateOrder } from '@/hooks/order';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useProducts } from '@/hooks/product';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
interface OrderItemType {
  product: string;
  variant: {
    colorId: string;
    sizeId: string;
  };
  quantity: number;
  price: number;
}

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [productListOpen, setProductListOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<OrderItemType[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [wardId, setWardId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [voucherCode, setVoucherCode] = useState('');
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  
  const { data: productsData } = useProducts({
    name: searchTerm,
    limit: 10,
    status: 'ACTIVE'
  });

  useEffect(() => {
    const newSubTotal = selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubTotal(newSubTotal);
    
    setDiscount(0);
    setTotal(newSubTotal - discount);
  }, [selectedProducts, discount]);

  const handleAddProduct = (product: any) => {
    const newProduct: OrderItemType = {
      product: product.id,
      variant: {
        colorId: product.variants?.[0]?.color?.id || '',
        sizeId: product.variants?.[0]?.size?.id || '',
      },
      quantity: 1,
      price: product.salePrice || product.regularPrice,
    };
    
    setSelectedProducts([...selectedProducts, newProduct]);
    setProductListOpen(false);
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = newQuantity;
    setSelectedProducts(updatedProducts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm vào đơn hàng');
      return;
    }
    
    if (!customerName || !customerPhone) {
      toast.error('Vui lòng nhập thông tin khách hàng');
      return;
    }
    
    if (!shippingName || !shippingPhone || !shippingAddress || !provinceId || !districtId || !wardId) {
      toast.error('Vui lòng nhập đầy đủ thông tin giao hàng');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would first create/get the customer ID
      // For simplicity, we're using a placeholder
      const customerID = "64f720fb93a46d138d413045"; // This would be obtained from API
      
      const orderData = {
        customer: customerID,
        items: selectedProducts,
        voucher: voucherCode || '', // In a real app, this would be validated
        subTotal,
        discount,
        total,
        shippingAddress: {
          name: shippingName,
          phoneNumber: shippingPhone,
          provinceId,
          districtId,
          wardId,
          specificAddress: shippingAddress,
        },
        paymentMethod: paymentMethod as any,
      };
      
      await createOrder.mutateAsync(orderData as any, {
        onSuccess: () => {
          toast.success('Tạo đơn hàng thành công');
          navigate('/admin/orders');
        },
      });
    } catch (error) {
      toast.error('Tạo đơn hàng thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/orders">Quản lý đơn hàng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tạo đơn hàng mới</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <Icon path={mdiArrowLeft} size={0.7} className="mr-2" />
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sản phẩm</CardTitle>
                <Button
                  type="button"
                  onClick={() => setProductListOpen(true)}
                >
                  <Icon path={mdiPlus} size={0.7} className="mr-2" />
                  Thêm sản phẩm
                </Button>
              </CardHeader>
              <CardContent>
                {selectedProducts.length === 0 ? (
                  <div className="text-center py-4 border rounded-[6px]">
                    <p className="text-maintext">Chưa có sản phẩm nào. Vui lòng thêm sản phẩm vào đơn hàng.</p>
                  </div>
                ) : (
                  <div className="border rounded-[6px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead className="text-right">Đơn giá</TableHead>
                          <TableHead className="text-center">Số lượng</TableHead>
                          <TableHead className="text-right">Thành tiền</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedProducts.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {/* In a real implementation, you would display product name by fetching product details */}
                              Product {index + 1} ({item.product})
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center items-center">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                >
                                  -
                                </Button>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                  className="w-16 mx-2 text-center"
                                  min={1}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.price * item.quantity)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveProduct(index)}
                              >
                                <Icon path={mdiTrashCanOutline} size={0.7} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Tổng tiền sản phẩm:</span>
                    <span className="font-medium">{formatCurrency(subTotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Giảm giá:</span>
                      <span className="font-medium text-red-500">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Tổng thanh toán:</span>
                    <span className="text-lg font-bold">{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Tên khách hàng</Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nhập tên khách hàng"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Số điện thoại</Label>
                    <Input
                      id="customerPhone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Nhập số điện thoại khách hàng"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email (không bắt buộc)</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Nhập email khách hàng"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingName">Tên người nhận</Label>
                    <Input
                      id="shippingName"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      placeholder="Tên người nhận hàng"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingPhone">Số điện thoại</Label>
                    <Input
                      id="shippingPhone"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      placeholder="Số điện thoại người nhận"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Tỉnh/Thành phố</Label>
                    <Select 
                      value={provinceId} 
                      onValueChange={setProvinceId}
                    >
                      <SelectTrigger id="province">
                        <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* In a real app, these would be populated from API */}
                        <SelectItem value="01">Hà Nội</SelectItem>
                        <SelectItem value="02">Hồ Chí Minh</SelectItem>
                        <SelectItem value="03">Đà Nẵng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện</Label>
                    <Select 
                      value={districtId} 
                      onValueChange={setDistrictId}
                      disabled={!provinceId}
                    >
                      <SelectTrigger id="district">
                        <SelectValue placeholder="Chọn Quận/Huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* These would be filtered based on province */}
                        <SelectItem value="001">Quận 1</SelectItem>
                        <SelectItem value="002">Quận 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ward">Phường/Xã</Label>
                    <Select 
                      value={wardId} 
                      onValueChange={setWardId}
                      disabled={!districtId}
                    >
                      <SelectTrigger id="ward">
                        <SelectValue placeholder="Chọn Phường/Xã" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* These would be filtered based on district */}
                        <SelectItem value="00001">Phường 1</SelectItem>
                        <SelectItem value="00002">Phường 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ cụ thể</Label>
                  <Input
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Số nhà, tên đường, khu vực..."
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Chọn phương thức thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Tiền mặt</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Chuyển khoản ngân hàng</SelectItem>
                      <SelectItem value="COD">Thanh toán khi nhận hàng</SelectItem>
                      <SelectItem value="MIXED">Thanh toán nhiều phương thức</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voucherCode">Mã giảm giá (nếu có)</Label>
                  <Input
                    id="voucherCode"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-maintext">Tổng tiền sản phẩm:</span>
                    <span>{formatCurrency(subTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-maintext">Giảm giá:</span>
                    <span>{formatCurrency(discount)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-3 border-t">
                    <span>Tổng thanh toán:</span>
                    <span className="text-lg">{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Đang tạo đơn hàng...</span>
                  ) : (
                    <span>Tạo đơn hàng</span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      <Dialog open={productListOpen} onOpenChange={setProductListOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chọn sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            
            {!productsData || productsData.data.products.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-maintext">Không tìm thấy sản phẩm phù hợp.</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="text-right">Giá</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productsData.data.products.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            {product.images?.[0] && (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="h-10 w-10 rounded-[6px] object-cover" 
                              />
                            )}
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-maintext">{product.code}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(product.salePrice || product.regularPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleAddProduct(product)}
                          >
                            Chọn
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductListOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 