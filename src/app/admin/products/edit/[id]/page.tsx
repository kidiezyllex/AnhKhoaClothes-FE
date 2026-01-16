"use client";

import { useEffect, useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useProductDetail,
  useUpdateProduct,
  useUpdateProductImages,
  useUpdateProductStatus,
  useUpdateProductStock,
  useFilterOptions,
} from "@/hooks/product";
import { useUploadImage } from "@/hooks/upload";
import {
  IProductImageUpdate,
  IProductStatusUpdate,
  IProductStockUpdate,
  IProductUpdate,
} from "@/interface/request/product";
import { createFormData } from "@/utils/cloudinary";
import {
  mdiArrowLeft,
  mdiImageMultiple,
  mdiLoading,
  mdiTrashCan,
  mdiUpload,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { id } = params;
  const [activeTab, setActiveTab] = useState("info");
  const [uploading, setUploading] = useState(false);

  const { data: productData, isLoading, isError } = useProductDetail(id);
  const updateProduct = useUpdateProduct();
  const updateProductStatus = useUpdateProductStatus();
  const updateProductStock = useUpdateProductStock();
  const updateProductImages = useUpdateProductImages();
  const uploadImage = useUploadImage();
  const { data: filterOptions } = useFilterOptions();

  const [productUpdate, setProductUpdate] = useState<IProductUpdate>({});

  useEffect(() => {
    if (productData && productData.data?.product) {
      const product = productData.data.product;

      setProductUpdate({
        name: product.name || product.productDisplayName,
        category:
          typeof product.category === "string"
            ? product.category
            : (product.category as any)?.name || product.subCategory,
        description: product.description,
        weight: product.weight,
        status: (product.status as any) || "ACTIVE",
        gender: product.gender,
        masterCategory: product.masterCategory,
        subCategory: product.subCategory,
        articleType: product.articleType,
        baseColour: product.baseColour,
        season: product.season,
        year: product.year,
        usage: product.usage,
        productDisplayName: product.productDisplayName,
        images: product.images || [],
      });
    }
  }, [productData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "weight") {
      setProductUpdate({ ...productUpdate, [name]: parseFloat(value) || 0 });
    } else {
      setProductUpdate({ ...productUpdate, [name]: value });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductUpdate({ ...productUpdate, [name]: value });
  };

  const handleStatusChange = async (checked: boolean) => {
    const newStatus = checked ? "ACTIVE" : "INACTIVE";
    const payload: IProductStatusUpdate = { status: newStatus };

    try {
      await updateProductStatus.mutateAsync(
        { productId: id, payload },
        {
          onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            setProductUpdate({ ...productUpdate, status: newStatus });
          },
        }
      );
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleUpdateStock = async (variantId: string, stock: number) => {
    const payload: IProductStockUpdate = {
      variantUpdates: [{ variantId, stock }],
    };

    try {
      await updateProductStock.mutateAsync(
        { productId: String(id), payload },
        {
          onSuccess: () => {
            toast.success("Cập nhật số lượng tồn kho thành công");
          },
        }
      );
    } catch (error) {
      toast.error("Cập nhật số lượng tồn kho thất bại");
    }
  };

  const handleImageUpload = async (file: File, variantId: string) => {
    try {
      setUploading(true);
      const formData = createFormData(file);
      const result = await uploadImage.mutateAsync(formData);
      const variant = productData?.data?.product.variants.find(
        (v: any) => (v._id || (v as any).id) === variantId
      );
      if (!variant) {
        toast.error("Không tìm thấy biến thể");
        return;
      }

      const newImages = [...variant.images, result?.data?.imageUrl];

      const payload: IProductImageUpdate = {
        variantId,
        images: newImages,
      };

      await updateProductImages.mutateAsync(
        { productId: String(id), payload },
        {
          onSuccess: () => {
            toast.success("Cập nhật hình ảnh thành công");
          },
        }
      );
    } catch (error) {
      toast.error("Cập nhật hình ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (variantId: string, imageIndex: number) => {
    try {
      // Xác định biến thể cần cập nhật ảnh
      const variant = productData?.data.variants.find(
        (v) => (v as any)?.id === variantId
      );
      if (!variant) {
        toast.error("Không tìm thấy biến thể");
        return;
      }

      const newImages = variant.images.filter((_, i) => i !== imageIndex);

      const payload: IProductImageUpdate = {
        variantId,
        images: newImages as any,
      };

      await updateProductImages.mutateAsync(
        { productId: String(id), payload },
        {
          onSuccess: () => {
            toast.success("Cập nhật hình ảnh thành công");
          },
        }
      );
    } catch (error) {
      toast.error("Cập nhật hình ảnh thất bại");
    }
  };

  const handleProductImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = createFormData(file);
      const result = await uploadImage.mutateAsync(formData);
      const imageUrl = result?.data?.imageUrl;

      if (imageUrl) {
        const newImages = [...(productUpdate.images || []), imageUrl];
        setProductUpdate({ ...productUpdate, images: newImages });

        // Cập nhật luôn lên server
        await updateProduct.mutateAsync({
          productId: String(id),
          payload: { ...productUpdate, images: newImages },
        });
        toast.success("Tải ảnh lên thành công");
      }
    } catch (error) {
      toast.error("Tải ảnh lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveProductImage = (index: number) => {
    const newImages = (productUpdate.images || []).filter(
      (_, i) => i !== index
    );
    setProductUpdate({ ...productUpdate, images: newImages });

    // Cập nhật luôn lên server
    updateProduct.mutate(
      {
        productId: String(id),
        payload: { ...productUpdate, images: newImages },
      },
      {
        onSuccess: () => toast.success("Xóa ảnh thành công"),
      }
    );
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProduct.mutateAsync(
        { productId: String(id), payload: productUpdate },
        {
          onSuccess: () => {
            toast.success("Cập nhật thông tin thành công");
          },
        }
      );
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">Sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chi tiết sản phẩm</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-28" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !productData?.data?.product) {
    return (
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">Sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chi tiết sản phẩm</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chi tiết sản phẩm</h1>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <Icon path={mdiArrowLeft} size={0.8} />
            Quay lại
          </Button>
        </div>

        <Card className="text-center p-4">
          <p className="text-red-500 mb-4">
            Đã xảy ra lỗi khi tải thông tin sản phẩm.
          </p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  const product = productData.data.product;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">
                Quản lý sản phẩm
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chỉnh sửa sản phẩm</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <Icon path={mdiArrowLeft} size={0.8} />
          Quay lại
        </Button>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full md:w-[600px] grid-cols-4">
          <TabsTrigger value="info">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="media">Hình ảnh</TabsTrigger>
          <TabsTrigger value="variants">Biến thể</TabsTrigger>
          <TabsTrigger value="status">Trạng thái</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 text-gray-700">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <form onSubmit={handleUpdateInfo}>
              <CardContent className="space-y-6 text-gray-700">
                {/* Image Preview Quick Access */}
                {(productUpdate.images || []).length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {(productUpdate.images || []).map((img, i) => (
                      <div
                        key={i}
                        className="relative flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border"
                      >
                        <img
                          src={
                            typeof img === "string"
                              ? img
                              : (img as any).imageUrl
                          }
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-24 h-24 flex-shrink-0 border-dashed"
                      onClick={() => setActiveTab("media")}
                    >
                      <div className="flex flex-col items-center">
                        <Icon path={mdiUpload} size={0.6} />
                        <span className="text-[10px] mt-1">Thêm ảnh</span>
                      </div>
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên sản phẩm</Label>
                    <Input
                      id="name"
                      name="name"
                      value={productUpdate.name || ""}
                      onChange={handleInputChange}
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <Select
                      value={productUpdate.category || ""}
                      onValueChange={(value) =>
                        setProductUpdate({ ...productUpdate, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Giày thể thao",
                          "Giày chạy bộ",
                          "Giày đá bóng",
                          "Giày thời trang",
                        ].map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Trọng lượng (gram)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      value={productUpdate.weight || ""}
                      onChange={handleInputChange}
                      placeholder="Nhập trọng lượng"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    <Select
                      value={productUpdate.gender || ""}
                      onValueChange={(value) =>
                        setProductUpdate({ ...productUpdate, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions?.data?.genders?.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        )) || (
                          <>
                            <SelectItem value="Men">Men</SelectItem>
                            <SelectItem value="Women">Women</SelectItem>
                            <SelectItem value="Unisex">Unisex</SelectItem>
                            <SelectItem value="Boys">Boys</SelectItem>
                            <SelectItem value="Girls">Girls</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="masterCategory">Danh mục chính</Label>
                    <Input
                      id="masterCategory"
                      name="masterCategory"
                      value={productUpdate.masterCategory || ""}
                      onChange={handleInputChange}
                      placeholder="Nhập danh mục chính"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subCategory">Danh mục phụ</Label>
                    <Input
                      id="subCategory"
                      name="subCategory"
                      value={productUpdate.subCategory || ""}
                      onChange={handleInputChange}
                      placeholder="Nhập danh mục phụ"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="articleType">Loại sản phẩm</Label>
                    <Select
                      value={productUpdate.articleType || ""}
                      onValueChange={(value) =>
                        setProductUpdate({
                          ...productUpdate,
                          articleType: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại sản phẩm" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions?.data?.articleTypes?.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        )) || (
                          <SelectItem
                            value={productUpdate.articleType || "None"}
                          >
                            {productUpdate.articleType}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baseColour">Màu nền</Label>
                    <Select
                      value={productUpdate.baseColour || ""}
                      onValueChange={(value) =>
                        setProductUpdate({
                          ...productUpdate,
                          baseColour: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn màu nền" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions?.data?.baseColours?.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        )) || (
                          <SelectItem
                            value={productUpdate.baseColour || "None"}
                          >
                            {productUpdate.baseColour}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="season">Mùa</Label>
                    <Select
                      value={productUpdate.season || ""}
                      onValueChange={(value) =>
                        setProductUpdate({ ...productUpdate, season: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mùa" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions?.data?.seasons?.map((season) => (
                          <SelectItem key={season} value={season}>
                            {season}
                          </SelectItem>
                        )) || (
                          <>
                            <SelectItem value="Summer">Summer</SelectItem>
                            <SelectItem value="Fall">Fall</SelectItem>
                            <SelectItem value="Winter">Winter</SelectItem>
                            <SelectItem value="Spring">Spring</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Năm</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      value={productUpdate.year || ""}
                      onChange={(e) =>
                        setProductUpdate({
                          ...productUpdate,
                          year: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usage">Sử dụng</Label>
                    <Select
                      value={productUpdate.usage || ""}
                      onValueChange={(value) =>
                        setProductUpdate({ ...productUpdate, usage: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mục đích sử dụng" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions?.data?.usages?.map((usage) => (
                          <SelectItem key={usage} value={usage}>
                            {usage}
                          </SelectItem>
                        )) || (
                          <>
                            <SelectItem value="Casual">Casual</SelectItem>
                            <SelectItem value="Formal">Formal</SelectItem>
                            <SelectItem value="Ethnic">Ethnic</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả sản phẩm</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={productUpdate.description || ""}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả sản phẩm"
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateProduct.isPending}
                  className="flex items-center gap-2"
                >
                  {updateProduct.isPending ? (
                    <>
                      <Icon
                        path={mdiLoading}
                        size={0.8}
                        className="animate-spin"
                      />
                      Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật thông tin"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4 text-gray-700">
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    id="product-image-upload"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        handleProductImageUpload(files[0]);
                        e.target.value = "";
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("product-image-upload")?.click()
                    }
                    disabled={uploading || updateProduct.isPending}
                    className="flex items-center gap-2"
                  >
                    {uploading ? (
                      <Icon
                        path={mdiLoading}
                        size={0.8}
                        className="animate-spin"
                      />
                    ) : (
                      <>
                        <Icon path={mdiUpload} size={0.8} />
                        Tải lên hình ảnh sản phẩm
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {(productUpdate.images || []).length > 0 ? (
                    (productUpdate.images || []).map((image, index) => (
                      <div
                        key={index}
                        className="relative group rounded-[6px] overflow-hidden border border-gray-200"
                        style={{ aspectRatio: "1/1" }}
                      >
                        <img
                          src={
                            typeof image === "string"
                              ? image
                              : (image as any).imageUrl
                          }
                          alt={`Product image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveProductImage(index)}
                          >
                            <Icon path={mdiTrashCan} size={0.8} />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 border border-dashed rounded-[6px] flex flex-col items-center justify-center text-gray-500">
                      <Icon path={mdiImageMultiple} size={2} />
                      <p className="mt-2 text-sm">Chưa có hình ảnh sản phẩm</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-4 text-gray-700">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Biến thể sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence>
                {product.variants.map((variant) => (
                  <motion.div
                    key={variant._id || (variant as any).id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border p-4 rounded-[6px]"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          {variant.color} - {variant.size}
                        </h3>
                        <p className="text-sm text-gray-700">
                          Giá:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 0,
                          }).format(variant.price)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`stock-${variant.id}`}
                          className="text-gray-700"
                        >
                          Số lượng tồn kho
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`stock-${variant._id || (variant as any).id}`}
                            type="number"
                            min="0"
                            defaultValue={variant.stock}
                            placeholder="Nhập số lượng tồn kho"
                          />
                          <Button
                            type="button"
                            onClick={(e) => {
                              const input = e.currentTarget
                                .previousElementSibling as HTMLInputElement;
                              handleUpdateStock(
                                variant._id || (variant as any).id,
                                parseInt(input.value) || 0
                              );
                            }}
                            disabled={updateProductStock.isPending}
                          >
                            {updateProductStock.isPending &&
                            updateProductStock.variables?.payload
                              .variantUpdates[0]?.variantId ===
                              (variant._id || (variant as any).id) ? (
                              <Icon
                                path={mdiLoading}
                                size={0.8}
                                className="animate-spin"
                              />
                            ) : (
                              "Cập nhật"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">Hình ảnh sản phẩm</Label>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            id={`file-upload-${
                              variant._id || (variant as any).id
                            }`}
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                handleImageUpload(
                                  files[0],
                                  variant._id || (variant as any).id
                                );
                                e.target.value = "";
                              }
                            }}
                            accept="image/*"
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById(
                                  `file-upload-${
                                    variant._id || (variant as any).id
                                  }`
                                )
                                ?.click()
                            }
                            disabled={
                              uploading || updateProductImages.isPending
                            }
                            className="flex items-center gap-2"
                          >
                            {uploading ? (
                              <>
                                <Icon
                                  path={mdiLoading}
                                  size={0.8}
                                  className="animate-spin"
                                />
                                Đang tải...
                              </>
                            ) : (
                              <>
                                <Icon path={mdiUpload} size={0.8} />
                                Tải lên hình ảnh
                              </>
                            )}
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          {variant.images && variant.images.length > 0 ? (
                            variant.images.map((image, index) => (
                              <div
                                key={index}
                                className="relative group rounded-[6px] overflow-hidden border border-gray-200"
                                style={{ aspectRatio: "1/1" }}
                              >
                                <img
                                  src={
                                    typeof image === "string"
                                      ? image
                                      : (image as any).imageUrl
                                  }
                                  alt={`Variant image ${index + 1}`}
                                  className="object-cover w-full h-full"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() =>
                                      handleRemoveImage(
                                        variant._id || (variant as any).id,
                                        index
                                      )
                                    }
                                    disabled={updateProductImages.isPending}
                                  >
                                    {updateProductImages.isPending ? (
                                      <Icon
                                        path={mdiLoading}
                                        size={0.8}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Icon path={mdiTrashCan} size={0.8} />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div
                              className="flex items-center justify-center border border-dashed border-gray-300 rounded-[6px] text-gray-700"
                              style={{ aspectRatio: "1/1" }}
                            >
                              <div className="flex flex-col items-center p-4">
                                <Icon path={mdiImageMultiple} size={1.5} />
                                <p className="text-xs mt-2">Chưa có hình ảnh</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4 text-gray-700">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Trạng thái sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between px-4 py-3 border rounded-[6px]">
                <div>
                  <h3 className="font-medium text-gray-700">
                    Trạng thái hoạt động
                  </h3>
                  <p className="text-sm text-gray-700">
                    {productUpdate.status === "ACTIVE"
                      ? "Sản phẩm đang được hiển thị và có thể mua"
                      : "Sản phẩm đang bị ẩn và không thể mua"}
                  </p>
                </div>
                <Switch
                  checked={productUpdate.status === "ACTIVE"}
                  onCheckedChange={handleStatusChange}
                  disabled={updateProductStatus.isPending}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
