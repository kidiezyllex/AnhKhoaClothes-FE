import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import {
  Loader2,
  X,
  Shirt,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import {
  FaFemale,
  FaShoePrints,
  FaGem,
  FaMagic,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { PiPants } from "react-icons/pi";
import { checkImageUrl, formatPriceVND } from "@/lib/utils";
import { useSaveOutfit } from "@/hooks/outfit";
import {
  IModelRecommendationResponse,
  IPersonalizedProduct,
  IOutfitResult,
} from "@/interface/response/recommend";

// --- Types ---
interface CompleteTheLookModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  productId: string;
  user?: any;
  recommendationData?: IModelRecommendationResponse;
  isLoading: boolean;
  error: any;
}

// --- Icons & Constants ---
const ICON_COLOR = "var(--primary)";

const getCategoryIcon = (categoryName: string, iconClassName?: string) => {
  const key = categoryName.trim().toLowerCase();
  const defaultClass = iconClassName || "w-5 h-5 text-primary";
  switch (key) {
    case "tops":
      return <Shirt className={defaultClass} />;
    case "dresses":
      return <FaFemale className={defaultClass} />;
    case "bottoms":
      return <PiPants className={defaultClass} />;
    case "shoes":
      return <FaShoePrints className={defaultClass} />;
    case "accessories":
      return <FaGem className={defaultClass} />;
    case "innerwear":
      return <Shirt className={defaultClass} />;
    default:
      return <FaMagic className={defaultClass} />;
  }
};

const normalizeCategoryName = (categoryName: string) => {
  if (!categoryName) return "Other";
  const normalized = categoryName.trim();
  const lower = normalized.toLowerCase();

  const categoryMap: Record<string, string> = {
    top: "Tops",
    tops: "Tops",
    shirt: "Tops",
    shirts: "Tops",
    "t-shirt": "Tops",
    "t-shirts": "Tops",
    apparel_topwear: "Tops",
    topwear: "Tops",
    dress: "Dresses",
    dresses: "Dresses",
    bottom: "Bottoms",
    bottoms: "Bottoms",
    pants: "Bottoms",
    trousers: "Bottoms",
    apparel_bottomwear: "Bottoms",
    bottomwear: "Bottoms",
    shoe: "Shoes",
    shoes: "Shoes",
    footwear: "Shoes",
    accessory: "Accessories",
    accessories: "Accessories",
    innerwear: "Innerwear",
  };

  return (
    categoryMap[lower] ||
    normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()
  );
};

const parseImages = (images: any): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return [];
};

const getCategoryFromProductMeta = (product: any) => {
  if (!product) return "Other";

  const master = (product.masterCategory || "").toLowerCase();
  const sub = (product.subCategory || "").toLowerCase();
  const article = (product.articleType || "").toLowerCase();

  if (sub === "topwear") {
    if (article === "dress" || article === "dresses") {
      return "Dresses";
    }
    return "Tops";
  }

  if (
    sub === "bottomwear" ||
    ["jeans", "shorts", "trousers", "pants"].includes(article)
  ) {
    return "Bottoms";
  }

  if (
    master === "footwear" ||
    sub === "shoes" ||
    article.includes("shoe") ||
    article.includes("flip flops")
  ) {
    return "Shoes";
  }

  if (
    master === "accessories" ||
    sub === "accessories" ||
    sub === "watches" ||
    article === "watches"
  ) {
    return "Accessories";
  }

  return normalizeCategoryName(article || sub || master || "Other");
};

const LazyProductImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">(
    "loading"
  );

  useEffect(() => {
    if (!src) {
      setImageState("error");
      return;
    }
    const img = new Image();
    img.onload = () => setImageState("loaded");
    img.onerror = () => setImageState("error");
    img.src = src;
  }, [src]);

  if (imageState === "error") {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-400 text-xs ${className}`}
      >
        No Image
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gray-50 ${className}`}>
      {imageState === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageState === "loaded" ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
      />
    </div>
  );
};

const getScoreChip = (score: number) => {
  // Determine color based on score
  let colorClass = "bg-gray-100 text-gray-700 border-gray-200";
  if (score >= 0.8) colorClass = "bg-green-100 text-green-700 border-green-200";
  else if (score >= 0.5)
    colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";

  return (
    <Badge variant="outline" className={`${colorClass} whitespace-nowrap`}>
      Điểm: {(score * 100).toFixed(0)}%
    </Badge>
  );
};

const CompleteTheLookModal: React.FC<CompleteTheLookModalProps> = ({
  open,
  onClose,
  userId,
  recommendationData,
  isLoading,
  error,
  user,
}) => {
  const [activeTab, setActiveTab] = useState("personalized");
  const [carouselIndices, setCarouselIndices] = useState<
    Record<string, number>
  >({});
  const [savedOutfits, setSavedOutfits] = useState<Set<string>>(new Set());
  const saveOutfitMutation = useSaveOutfit();

  const personalizedData = useMemo(() => {
    if (
      !recommendationData ||
      !Array.isArray(recommendationData.personalized_products)
    )
      return [];
    return recommendationData.personalized_products.map((item) => {
      const product = item.product || {};
      const images = parseImages(product.images);
      const firstVariantPrice =
        product.variants && product.variants.length > 0
          ? product.variants[0].price || 0
          : product.price || 0;

      return {
        _id: item.product_id,
        product_id: item.product_id,
        name: product.productDisplayName || product.name || "Product",
        images,
        price: firstVariantPrice,
        sale: product.sale || 0,
        rating: product.rating || 0,
        score: item.priority_score,
        articleType: product.articleType,
        usage: product.usage,
        season: product.season,
      };
    });
  }, [recommendationData]);

  const outfitData = useMemo(() => {
    if (!recommendationData || !Array.isArray(recommendationData.outfits))
      return [];

    return recommendationData.outfits.map((outfit) => {
      const products: any[] = [];
      (outfit.products || []).forEach((item) => {
        const product = item.product;
        if (!product) return;

        const category = getCategoryFromProductMeta(product);
        const images = parseImages(product.images);
        const firstVariantPrice =
          product.variants && product.variants.length > 0
            ? product.variants[0].price || 0
            : product.price || 0;

        products.push({
          _id: item.product_id,
          name: product.productDisplayName || product.name || "Product",
          product_id: item.product_id,
          category,
          price: firstVariantPrice,
          sale: product.sale || 0,
          images,
          articleType: product.articleType,
        });
      });

      const totalPrice = products.reduce((sum, p) => {
        const basePrice = p.price || 0;
        const salePercent = p.sale || 0;
        const salePrice = basePrice * (1 - salePercent / 100); // Fixed calculation logic
        return sum + salePrice;
      }, 0);

      return {
        name: `Outfit ${outfit.outfit_number}`,
        products,
        totalPrice,
        compatibilityScore: outfit.score || 0,
        gender:
          recommendationData.metadata?.user_gender || user?.gender || "Unisex",
        outfitIndex: outfit.outfit_number,
      };
    });
  }, [recommendationData, user]);

  const handleSaveOutfit = async (outfit: any, outfitIndex: number) => {
    if (!userId) {
      toast.warning("Vui lòng đăng nhập để lưu bộ phối đồ");
      return;
    }

    const outfitKey = `outfit-${outfitIndex}`;
    if (savedOutfits.has(outfitKey)) {
      toast.info("Bộ phối đồ này đã được lưu");
      return;
    }

    try {
      const categories = ["Tops", "Dresses", "Bottoms", "Shoes", "Accessories"];
      const productsByCategory: Record<string, any[]> = {
        Tops: [],
        Dresses: [],
        Bottoms: [],
        Shoes: [],
        Accessories: [],
        Other: [],
      };
      outfit.products.forEach((p: any) => {
        const cat = p.category || "Other";
        if (productsByCategory[cat]) productsByCategory[cat].push(p);
        else productsByCategory.Other.push(p);
      });

      const displayedProducts: any[] = [];
      categories.forEach((cat) => {
        const key = `${cat}-${outfitIndex}`;
        const idx = carouselIndices[key] || 0;
        const list = productsByCategory[cat] || [];
        if (list[idx]) displayedProducts.push(list[idx]);
      });

      const payload = {
        name: outfit.name,
        products: displayedProducts.map((p) => ({
          product_id: p.product_id || p._id,
          name: p.name,
          category: p.category,
          price: p.price,
          sale: p.sale,
          images: p.images,
        })),
        totalPrice: outfit.totalPrice, // Note: this total price might be inaccurate if carousel changed selection
        compatibilityScore: outfit.compatibilityScore,
        gender: outfit.gender,
      };

      await saveOutfitMutation.mutateAsync({ userId, body: payload });
      setSavedOutfits((prev) => new Set(prev).add(outfitKey));
      toast.success("Đã lưu bộ phối đồ thành công!");
    } catch (err: any) {
      toast.error(err?.message || "Không thể lưu bộ phối đồ");
    }
  };

  const handleNextItem = (
    category: string,
    outfitIndex: number,
    length: number
  ) => {
    const key = `${category}-${outfitIndex}`;
    setCarouselIndices((prev) => ({
      ...prev,
      [key]: ((prev[key] || 0) + 1) % length,
    }));
  };

  const handlePrevItem = (
    category: string,
    outfitIndex: number,
    length: number
  ) => {
    const key = `${category}-${outfitIndex}`;
    setCarouselIndices((prev) => ({
      ...prev,
      [key]: ((prev[key] || 0) - 1 + length) % length,
    }));
  };

  const renderProductCard = (product: any, showScore = false) => {
    const imageSrc = product.images?.[0] || "/images/placeholder.png";
    const salePrice = product.price
      ? product.price * (1 - (product.sale || 0) / 100)
      : 0;

    return (
      <Card
        className="w-full h-full overflow-hidden border hover:border-primary transition-all cursor-pointer group"
        onClick={() =>
          window.open(
            `/products/product-${product._id || product.product_id}`,
            "_blank"
          )
        }
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <LazyProductImage
            src={checkImageUrl(imageSrc)}
            alt={product.name}
            className="w-full h-full"
          />
          {product.sale > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">
              -{product.sale}%
            </div>
          )}
        </div>
        <div className="p-3">
          {product.articleType && (
            <Badge
              variant="secondary"
              className="mb-2 text-[10px] font-normal bg-primary/10 text-primary border-primary/20"
            >
              {product.articleType}
            </Badge>
          )}
          <h3 className="text-sm font-medium line-clamp-1 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary">
              {formatPriceVND(salePrice)}
            </span>
            {product.sale > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {formatPriceVND(product.price)}
              </span>
            )}
          </div>
          {showScore && product.score !== undefined && (
            <div className="mt-2">{getScoreChip(product.score)}</div>
          )}
          <Button
            size="sm"
            className="w-full mt-2 bg-green-50"
            variant="outline"
          >
            Xem chi tiết <ArrowUpRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-[95vw] gap-0 h-[90vh] p-0 overflow-hidden flex flex-col bg-gray-50">
        <DialogHeader className="px-6 py-3 bg-white border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-primary pl-4 text-xl font-bold">
            <FaMagic /> Gợi ý sản phẩm dành cho bạn
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden p-4 pt-0">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-gray-500">
                Đang tạo gợi ý thời trang phù hợp với bạn...
              </p>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center text-red-500">
              Lỗi khi tải gợi ý: {error.message}
            </div>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full h-full flex flex-col"
            >
              <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto bg-transparent mb-4">
                <TabsTrigger
                  value="personalized"
                  className="px-6 py-3 rounded-none border-b-2 border-transparent text-gray-500 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent"
                >
                  Gợi ý cá nhân
                </TabsTrigger>
                <TabsTrigger
                  value="outfit"
                  className="px-6 py-3 rounded-none border-b-2 border-transparent text-gray-500 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent"
                >
                  Bộ phối đồ (Outfits)
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="personalized"
                className="flex-1 overflow-hidden data-[state=inactive]:hidden"
              >
                {activeTab === "personalized" && (
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-10">
                      {personalizedData.length > 0 ? (
                        personalizedData.map((prod) => (
                          <div key={prod._id} className="h-full">
                            {renderProductCard(prod, true)}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full h-64 flex items-center justify-center text-gray-400">
                          Không tìm thấy sản phẩm gợi ý cá nhân nào.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>

              <TabsContent
                value="outfit"
                className="flex-1 overflow-hidden bg-white rounded-lg border shadow-sm flex flex-col data-[state=inactive]:hidden"
              >
                {activeTab === "outfit" && (
                  <div className="overflow-x-auto flex-1">
                    <Table className="min-w-[1000px] h-full">
                      <TableHeader className="sticky top-0 bg-primary z-10">
                        <TableRow className="hover:bg-primary border-none">
                          {[
                            "Tops",
                            "Dresses",
                            "Bottoms",
                            "Shoes",
                            "Accessories",
                          ].map((cat) => (
                            <TableHead
                              key={cat}
                              className="text-center font-bold text-white min-w-[200px]"
                            >
                              <div className="flex items-center justify-center gap-2 py-4">
                                {getCategoryIcon(cat, "w-5 h-5 text-white")}{" "}
                                {cat}
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {outfitData.length > 0 ? (
                          outfitData.map((outfit, idx) => {
                            const categories = [
                              "Tops",
                              "Dresses",
                              "Bottoms",
                              "Shoes",
                              "Accessories",
                            ];
                            const productsByCategory: Record<string, any[]> = {
                              Tops: [],
                              Dresses: [],
                              Bottoms: [],
                              Shoes: [],
                              Accessories: [],
                              Other: [],
                            };
                            outfit.products.forEach((p: any) => {
                              const cat = p.category || "Other";
                              if (productsByCategory[cat])
                                productsByCategory[cat].push(p);
                              else productsByCategory.Other.push(p);
                            });

                            const isSaved = savedOutfits.has(`outfit-${idx}`);

                            return (
                              <React.Fragment key={idx}>
                                {/* Outfit Header Row */}
                                <TableRow className="bg-primary/5 hover:bg-primary/10">
                                  <TableCell colSpan={5} className="py-3 px-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <span className="font-bold text-primary text-lg">
                                          {outfit.name}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="bg-primary/10 text-primary border-primary/20"
                                        >
                                          Điểm:{" "}
                                          {(
                                            outfit.compatibilityScore * 100
                                          ).toFixed(0)}
                                          %
                                        </Badge>
                                        <span className="text-sm text-gray-500">
                                          Tổng cộng:{" "}
                                          <span className="font-semibold text-primary">
                                            {formatPriceVND(outfit.totalPrice)}
                                          </span>
                                        </span>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant={
                                          isSaved ? "outline" : "default"
                                        }
                                        onClick={() =>
                                          handleSaveOutfit(outfit, idx)
                                        }
                                        className={
                                          isSaved
                                            ? "border-green-500 text-green-600 bg-green-50 hover:bg-green-100"
                                            : "bg-primary hover:bg-primary/90"
                                        }
                                        disabled={isSaved}
                                      >
                                        {isSaved ? (
                                          <>
                                            <BookmarkCheck className="w-4 h-4 mr-2" />{" "}
                                            Đã lưu
                                          </>
                                        ) : (
                                          <>
                                            <Bookmark className="w-4 h-4" /> Lưu
                                            Outfit
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>

                                {/* Outfit Products Row */}
                                <TableRow className="border-b-4 border-gray-100">
                                  {categories.map((cat) => {
                                    const key = `${cat}-${idx}`;
                                    const prods = productsByCategory[cat] || [];
                                    const currentIndex =
                                      carouselIndices[key] || 0;
                                    const currentProd = prods[currentIndex];

                                    return (
                                      <TableCell
                                        key={cat}
                                        className="p-2 align-top h-[320px]"
                                      >
                                        {prods.length > 0 && currentProd ? (
                                          <div className="h-full w-full flex flex-col">
                                            <div className="flex-1 min-h-0 mb-2">
                                              {renderProductCard(currentProd)}
                                            </div>
                                            {prods.length > 1 && (
                                              <div className="flex items-center justify-between bg-gray-100 rounded-md p-1 mt-auto">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6"
                                                  onClick={() =>
                                                    handlePrevItem(
                                                      cat,
                                                      idx,
                                                      prods.length
                                                    )
                                                  }
                                                >
                                                  <FaMinus className="w-3 h-3" />
                                                </Button>
                                                <span className="text-[10px] text-gray-500 font-medium">
                                                  {currentIndex + 1} /{" "}
                                                  {prods.length}
                                                </span>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6"
                                                  onClick={() =>
                                                    handleNextItem(
                                                      cat,
                                                      idx,
                                                      prods.length
                                                    )
                                                  }
                                                >
                                                  <FaPlus className="w-3 h-3" />
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <div className="h-full w-full border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-300 p-4 text-center">
                                            <span className="text-xs">
                                              Không có sản phẩm nào
                                            </span>
                                          </div>
                                        )}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-20 text-gray-400"
                            >
                              Không tìm thấy bộ phối đồ nào
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteTheLookModal;
