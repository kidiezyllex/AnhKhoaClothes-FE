"use client";

import { useMemo, useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks/attributes";
import { useDeleteProduct, useProducts } from "@/hooks/product";
import { usePromotions } from "@/hooks/promotion";
import { IProductFilter } from "@/interface/request/product";
import {
  applyPromotionsToProducts,
  calculateProductDiscount,
} from "@/lib/promotions";
import { checkImageUrl } from "@/lib/utils";
import {
  mdiDeleteCircle,
  mdiFilterMultiple,
  mdiMagnify,
  mdiPencilCircle,
  mdiPlus,
  mdiStar,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<IProductFilter>({
    page: 1,
    limit: 10,
  });
  const { data: promotionsData } = usePromotions();
  const [showFilters, setShowFilters] = useState(false);
  const { data: rawData, isLoading, isError } = useProducts(filters);
  const deleteProduct = useDeleteProduct();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState<any[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: categoriesData, isError: isCategoriesError } = useCategories();

  const data = useMemo(() => {
    if (!rawData || !rawData.data || !rawData.data.products) return rawData;

    let products = [...rawData.data.products];

    if (promotionsData?.data?.promotions) {
      products = applyPromotionsToProducts(
        products,
        promotionsData.data.promotions
      );
    }

    return {
      ...rawData,
      data: {
        ...rawData.data,
        products,
      },
    };
  }, [rawData, promotionsData]);

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id, {
        onSuccess: () => {
          toast.success("Đã xóa sản phẩm thành công");
          queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error: any) => {
          toast.error(
            `Xóa sản phẩm thất bại: ${
              error?.response?.data?.message ||
              error.message ||
              "Đã có lỗi xảy ra"
            }`
          );
        },
      });
    } catch (error: any) {
      toast.error(
        `Xóa sản phẩm thất bại: ${
          error?.response?.data?.message || error.message || "Đã có lỗi xảy ra"
        }`
      );
    }
  };

  const handleChangePage = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";

      return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    } catch (error) {
      return "N/A";
    }
  };

  const handleOpenLightbox = (
    product: any,
    _variantIndex: number = 0,
    imageIndex: number = 0
  ) => {
    // Check if images are at product level (new API structure)
    const productImages = (product as any)?.images || [];

    let slides = [];

    if (productImages.length > 0) {
      // Use product-level images
      slides = productImages.map((img: string) => ({
        src: checkImageUrl(img),
        alt:
          (product as any)?.name ||
          (product as any)?.productDisplayName ||
          "Product Image",
        download: checkImageUrl(img),
      }));
    } else {
      // Fallback to variant images (old structure)
      slides = ((product as any)?.variants as any[]).flatMap((variant: any) =>
        (variant.images || []).map((img: any) => ({
          src: checkImageUrl(typeof img === "string" ? img : img.imageUrl),
          alt:
            (product as any)?.name ||
            (product as any)?.productDisplayName ||
            "Product Image",
          download: checkImageUrl(typeof img === "string" ? img : img.imageUrl),
        }))
      );
    }

    setLightboxSlides(slides);
    setLightboxIndex(imageIndex);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">
                Quản lý sản phẩm
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Sản phẩm</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <a href="/admin/products/create">
          <Button>
            <Icon path={mdiPlus} size={0.8} />
            Thêm sản phẩm mới
          </Button>
        </a>
      </div>

      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center gap-2">
            <div className="relative flex-1">
              <Icon
                path={mdiMagnify}
                size={0.8}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700"
              />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm..."
                className="pl-10 py-2 w-full border rounded-[6px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon path={mdiFilterMultiple} size={0.8} className="mr-2" />
              {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="bg-white rounded-[6px] shadow-sm p-4 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-[6px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-[6px] shadow-sm p-4 text-center">
          <p className="text-red-500">
            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["products"] })
            }
          >
            Thử lại
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-[6px] shadow-sm overflow-visible">
          <div
            className="overflow-x-auto"
            style={{
              width: "100%",
              display: "block",
              overflowX: "auto",
              whiteSpace: "nowrap",
              scrollbarWidth: "thin",
              scrollbarColor: "#94a3b8 #e2e8f0",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Màu sắc</TableHead>
                  <TableHead>Mùa</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Ngày cập nhật</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.products.length ? (
                  data.data.products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell className="px-4 py-4 whitespace-nowrap">
                        <div
                          className="relative h-12 w-12 rounded-[6px] overflow-hidden bg-gray-100 cursor-pointer group"
                          onClick={() => handleOpenLightbox(product, 0, 0)}
                          title="Xem ảnh lớn"
                        >
                          <img
                            src={checkImageUrl(
                              (product as any)?.images?.[0] ||
                                (product as any)?.variants[0]?.images?.[0]
                                  ?.imageUrl ||
                                (product as any)?.variants[0]?.images?.[0]
                            )}
                            alt={
                              product.name ||
                              product.productDisplayName ||
                              "Product"
                            }
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="text-base font-medium text-gray-700 max-w-[200px] whitespace-normal">
                          {product.productDisplayName || product.name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-base text-gray-700">
                        {product.gender || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-base text-gray-700">
                        {product.articleType || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-base text-gray-700">
                        {product.baseColour || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-base text-gray-700">
                        {product.season || "N/A"}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-base">
                        {(() => {
                          const basePrice =
                            (product as any)?.variants[0]?.price || 0;
                          const discount = promotionsData?.data?.promotions
                            ? calculateProductDiscount(
                                (product as any)?.id,
                                basePrice,
                                promotionsData.data.promotions
                              )
                            : {
                                originalPrice: basePrice,
                                discountedPrice: basePrice,
                                discountPercent: 0,
                              };

                          return (
                            <div className="space-y-1">
                              <div
                                className={`font-medium ${
                                  discount.discountPercent > 0
                                    ? "text-primary"
                                    : "text-gray-700"
                                }`}
                              >
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(discount.discountedPrice)}
                              </div>
                              {discount.discountPercent > 0 && (
                                <div className="text-xs text-gray-700 line-through">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(discount.originalPrice)}
                                </div>
                              )}
                              {discount.discountPercent > 0 && (
                                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  -{discount.discountPercent}% KM
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-base text-gray-700">
                        <div className="flex items-center gap-1">
                          <Icon
                            path={mdiStar}
                            size={0.8}
                            className="text-yellow-500"
                          />
                          <span>({product.rating?.toFixed(1) || "N/A"})</span>
                        </div>
                      </TableCell>

                      <TableCell className="px-4 py-4 whitespace-nowrap text-base text-gray-700">
                        {formatDate(
                          (product as any)?.updated_at ||
                            (product as any)?.updatedAt
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <a href={`/admin/products/edit/${product.id}`}>
                            <Button variant="outline" size="icon" title="Sửa">
                              <Icon path={mdiPencilCircle} size={0.8} />
                            </Button>
                          </a>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setProductToDelete((product as any)?.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                title="Xóa"
                              >
                                <Icon path={mdiDeleteCircle} size={0.8} />
                              </Button>
                            </DialogTrigger>
                            {isDeleteDialogOpen &&
                              productToDelete === (product as any)?.id && (
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Xác nhận xóa sản phẩm
                                    </DialogTitle>
                                  </DialogHeader>
                                  <p>
                                    Bạn có chắc chắn muốn xóa sản phẩm này
                                    không?
                                  </p>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setIsDeleteDialogOpen(false);
                                        setProductToDelete(null);
                                      }}
                                    >
                                      Hủy
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        if (productToDelete) {
                                          handleDeleteProduct(productToDelete);
                                          setIsDeleteDialogOpen(false);
                                          setProductToDelete(null);
                                        }
                                      }}
                                    >
                                      Xóa
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              )}
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="px-4 py-8 text-center text-gray-700"
                    >
                      Không tìm thấy sản phẩm nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {data?.data &&
            (data.data.pages > 1 || data.data.pagination?.totalPages > 1) && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Hiển thị{" "}
                    <span className="font-medium">
                      {((data.data.page ||
                        data.data.pagination?.currentPage ||
                        1) -
                        1) *
                        (data.data.perPage ||
                          data.data.pagination?.limit ||
                          10) +
                        1}
                    </span>{" "}
                    đến{" "}
                    <span className="font-medium">
                      {Math.min(
                        (data.data.page ||
                          data.data.pagination?.currentPage ||
                          1) *
                          (data.data.perPage ||
                            data.data.pagination?.limit ||
                            10),
                        data.data.count || data.data.pagination?.totalItems || 0
                      )}
                    </span>{" "}
                    của{" "}
                    <span className="font-medium">
                      {data.data.count || data.data.pagination?.totalItems || 0}
                    </span>{" "}
                    sản phẩm
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleChangePage(
                        (data.data.page ||
                          data.data.pagination?.currentPage ||
                          1) - 1
                      )
                    }
                    disabled={
                      (data.data.page ||
                        data.data.pagination?.currentPage ||
                        1) === 1
                    }
                  >
                    Trước
                  </Button>
                  {(() => {
                    const totalPages =
                      data.data.pages || data.data.pagination?.totalPages || 1;
                    const currentPage =
                      data.data.page || data.data.pagination?.currentPage || 1;
                    const pageButtons = [];

                    // Always show first page
                    if (totalPages > 0) {
                      pageButtons.push(
                        <Button
                          key={1}
                          variant={currentPage === 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleChangePage(1)}
                        >
                          1
                        </Button>
                      );
                    }

                    // Show ellipsis if needed
                    if (currentPage > 3) {
                      pageButtons.push(
                        <span
                          key="ellipsis-start"
                          className="px-2 text-gray-500"
                        >
                          ...
                        </span>
                      );
                    }

                    // Show pages around current page
                    for (
                      let i = Math.max(2, currentPage - 1);
                      i <= Math.min(totalPages - 1, currentPage + 1);
                      i++
                    ) {
                      if (i !== 1 && i !== totalPages) {
                        pageButtons.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleChangePage(i)}
                          >
                            {i}
                          </Button>
                        );
                      }
                    }

                    // Show ellipsis if needed
                    if (currentPage < totalPages - 2) {
                      pageButtons.push(
                        <span key="ellipsis-end" className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }

                    // Always show last page if there's more than 1 page
                    if (totalPages > 1) {
                      pageButtons.push(
                        <Button
                          key={totalPages}
                          variant={
                            currentPage === totalPages ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleChangePage(totalPages)}
                        >
                          {totalPages}
                        </Button>
                      );
                    }

                    return pageButtons;
                  })()}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleChangePage(
                        (data.data.page ||
                          data.data.pagination?.currentPage ||
                          1) + 1
                      )
                    }
                    disabled={
                      (data.data.page ||
                        data.data.pagination?.currentPage ||
                        1) >=
                      (data.data.pages || data.data.pagination?.totalPages || 1)
                    }
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxSlides}
          index={lightboxIndex}
          on={{ view: ({ index }) => setLightboxIndex(index) }}
          plugins={[Zoom, Download]}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 2,
          }}
        />
      )}
    </div>
  );
}
