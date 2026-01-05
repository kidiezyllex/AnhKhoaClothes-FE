"use client";

import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAccounts } from "@/hooks/account";
import { useProducts, useSearchProducts } from "@/hooks/product";
import { usePromotions } from "@/hooks/promotion";
import { useIncrementVoucherUsage } from "@/hooks/voucher";
import { IProductFilter } from "@/interface/request/product";
import {
  applyPromotionsToProducts,
  filterActivePromotions,
} from "@/lib/promotions";
import { checkImageUrl, cn } from "@/lib/utils";
import { POSCartItem, usePOSCartStore } from "@/stores/usePOSCartStore";
import { usePendingCartsStore } from "@/stores/usePendingCartsStore";
import { getSizeLabel } from "@/utils/sizeMapping";
import {
  mdiCart,
  mdiCartPlus,
  mdiCheck,
  mdiChevronDown,
  mdiChevronLeft,
  mdiClose,
  mdiEye,
  mdiInformationSlabCircle,
  mdiInvoicePlus,
  mdiMagnify,
  mdiPackageVariant,
  mdiPalette,
  mdiPlus,
  mdiRuler,
  mdiTableLarge,
  mdiViewGrid,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CardSkeleton = () => (
  <div className="bg-white rounded-[6px] border border-border shadow-sm overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <div className="flex -space-x-1">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-8 w-full mt-3" />
    </div>
  </div>
);

interface ApiVariant {
  id: string;
  colorId?: { id: string; name: string; code: string; images?: string[] };
  sizeId?: { id: string; name: string; value?: string };
  price: number;
  stock: number;
  images?: string[];
  sku?: string;
  actualSizeId?: string;
}

interface ApiProduct {
  id: string;
  name: string;
  category: { id: string; name: string } | string;
  description?: string;
  variants: ApiVariant[];
  status?: string;
  createdAt: string;
}

interface InvoiceShopInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface InvoiceCustomerInfo {
  name: string;
  phone: string;
}

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  color: string;
  size: string;
}

interface InvoiceData {
  shopInfo: InvoiceShopInfo;
  customerInfo: InvoiceCustomerInfo;
  orderId: string;
  employee: string;
  createdAt: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  voucherCode?: string;
  total: number;
  cashReceived: number;
  changeGiven: number;
  paymentMethod: string;
}

const getVariantImageUrl = (variant: any) => {
  if (
    !variant?.images ||
    !Array.isArray(variant.images) ||
    variant.images.length === 0
  ) {
    return "/images/white-image.png";
  }

  // Handle both string arrays and object arrays
  const firstImage = variant.images[0];
  if (typeof firstImage === "string") {
    return firstImage;
  } else if (typeof firstImage === "object" && firstImage?.imageUrl) {
    return firstImage.imageUrl;
  } else if (typeof firstImage === "object" && firstImage?.url) {
    return firstImage.url;
  }

  return "/images/white-image.png";
};

const convertVariantToApiVariant = (variant: any): ApiVariant => {
  // Handle case where variant might be null or undefined
  if (!variant) {
    return {
      id: "",
      price: 0,
      stock: 0,
      images: [],
    };
  }

  // Handle color data - check for populated vs non-populated
  let colorData = undefined;
  if (variant.color) {
    // Populated format - color data is directly available
    colorData = {
      id: variant.color.id?.toString() || "",
      name: variant.color.name || "N/A",
      code: variant.color.code || "#000000",
      images: variant.color.images || [],
    };
  } else if (variant.colorId) {
    // Non-populated format - colorId might be string or object
    if (typeof variant.colorId === "object") {
      colorData = {
        id: variant.colorId.id?.toString() || "",
        name: variant.colorId.name || "N/A",
        code: variant.colorId.code || "#000000",
        images: variant.colorId.images || [],
      };
    } else {
      colorData = {
        id: variant.colorId.toString(),
        name: "N/A",
        code: "#000000",
        images: [],
      };
    }
  }

  // Handle size data - check for populated vs non-populated
  let sizeData = undefined;
  if (variant.size) {
    // Populated format - size data is directly available
    sizeData = {
      id: variant.size.id?.toString() || "",
      name:
        variant.size.name ||
        (variant.size.value ? getSizeLabel(Number(variant.size.value)) : "N/A"),
      value: variant.size.value?.toString(),
    };
  } else if (variant.sizeId) {
    // Non-populated format - sizeId might be string or object
    if (typeof variant.sizeId === "object") {
      sizeData = {
        id: variant.sizeId.id?.toString() || "",
        name:
          variant.sizeId.name ||
          (variant.sizeId.value
            ? getSizeLabel(Number(variant.sizeId.value))
            : "N/A"),
        value: variant.sizeId.value?.toString(),
      };
    } else {
      sizeData = {
        id: variant.sizeId.toString(),
        name: "N/A",
        value: undefined,
      };
    }
  }

  // Return standardized variant data
  return {
    id: variant.id?.toString() || variant._id?.toString() || "",
    colorId: colorData,
    sizeId: sizeData,
    price: parseFloat(variant.price?.toString() || "0"),
    stock: parseInt(variant.stock?.toString() || "0"),
    images:
      variant.images?.map((img: any) =>
        typeof img === "string" ? img : img.imageUrl || img.url
      ) || [],
    sku: variant.sku || "",
    actualSizeId: sizeData?.id || "",
  };
};

const convertProductToApiProduct = (product: any): ApiProduct => {
  if (!product) {
    return {
      id: "",
      name: "Unknown Product",
      category: "Unknown",
      variants: [],
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id:
      (product as any)?.id?.toString() ||
      (product as any)?._id?.toString() ||
      "",
    name: (product as any)?.name || "Unknown Product",
    category: (product as any)?.category || "Unknown",
    description: (product as any)?.description,
    variants: (product as any)?.variants?.map(convertVariantToApiVariant) || [],
    status: (product as any)?.status,
    createdAt: (product as any)?.createdAt || new Date().toISOString(),
  };
};

export default function POSPage() {
  // State for product selection and search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(
    null
  );
  const [selectedApiVariant, setSelectedApiVariant] =
    useState<ApiVariant | null>(null);

  // Initialize cart management from store
  const {
    carts: pendingCarts, // All pending shopping carts
    activeCartId, // Currently active cart ID
    createNewCart, // Function to create a new cart
    setActiveCart, // Function to switch active cart
    addItemToCart: addItemToPendingCart, // Add item to pending cart
    updateItemQuantityInCart: updateItemQuantityInPendingCart, // Update item quantity
    clearCartItems: clearPendingCartItems, // Clear all items from cart
    getActiveCart, // Get currently active cart
  } = usePendingCartsStore();

  // Get active cart data
  const activeCart = getActiveCart();
  const cartItems = activeCart?.items || [];
  const appliedVoucher = activeCart?.appliedVoucher || null;

  const {
    items: mainCartItems,
    addToCart: addToCartStore,
    updateQuantity: updateQuantityStore,
    clearCart: clearCartStore,
    setDiscount,
    setVoucher,
    setCouponCode,
  } = usePOSCartStore();

  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [showCheckoutDialog, setShowCheckoutDialog] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("guest");
  const [checkoutIsLoading, setCheckoutIsLoading] = useState<boolean>(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] =
    useState<boolean>(false);
  const [transferPaymentCompleted, setTransferPaymentCompleted] =
    useState<boolean>(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 6 });
  const [filters, setFilters] = useState<IProductFilter>({ status: "ACTIVE" });
  const [sortOption, setSortOption] = useState<string>("newest");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeCategoryName, setActiveCategoryName] =
    useState<string>("Tất cả sản phẩm");
  const [showVouchersDialog, setShowVouchersDialog] = useState<boolean>(false);

  const [cashReceived, setCashReceived] = useState<number | string>("");
  const [showInvoiceDialog, setShowInvoiceDialog] = useState<boolean>(false);
  const [currentInvoiceData, setCurrentInvoiceData] =
    useState<InvoiceData | null>(null);
  const [showDeleteCartDialog, setShowDeleteCartDialog] =
    useState<boolean>(false);
  const [cartToDelete, setCartToDelete] = useState<string | null>(null);
  const [showCartItemsDialog, setShowCartItemsDialog] =
    useState<boolean>(false);
  const [selectedCartForView, setSelectedCartForView] = useState<string | null>(
    null
  );

  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: "TX-1234",
      customer: "Nguyễn Văn A",
      amount: 1250000,
      time: "10:25",
      status: "completed",
    },
    {
      id: "TX-1233",
      customer: "Trần Thị B",
      amount: 850000,
      time: "09:40",
      status: "completed",
    },
    {
      id: "TX-1232",
      customer: "Lê Văn C",
      amount: 2100000,
      time: "09:15",
      status: "pending",
    },
  ]);

  const { mutate: incrementVoucherUsageMutation } = useIncrementVoucherUsage();

  const accountsParams = useMemo(
    () => ({
      role: "CUSTOMER" as const,
      status: "ACTIVE" as const,
      limit: 100,
    }),
    []
  );

  const { data: usersData } = useAccounts(accountsParams);

  // Debounced search with better performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsSearching(searchQuery.trim().length > 0);
    }, 300); // Reduce from 500ms to 300ms for better UX

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Optimize category filter effect
  useEffect(() => {
    setFilters((prevFilters) => {
      const isAllProducts = activeCategoryName === "Tất cả sản phẩm";

      if (isAllProducts) {
        // Remove categories filter if "All products" is selected
        const { categories, ...restFilters } = prevFilters;
        return categories ? restFilters : prevFilters;
      } else {
        // Add/update categories filter
        const newCategories = [activeCategoryName];
        if (prevFilters.categories?.[0] === activeCategoryName) {
          return prevFilters; // No change needed
        }
        return { ...prevFilters, categories: newCategories };
      }
    });

    // Reset pagination only when actually changing category
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [activeCategoryName]);

  // Optimize pagination params with stable reference
  const productsHookParams: IProductFilter = useMemo(
    () => ({
      ...pagination,
      ...filters,
    }),
    [pagination.page, pagination.limit, filters.status, filters.categories]
  );

  const productsQuery = useProducts(productsHookParams);

  // Optimize search params with stable reference
  const searchQueryParams = useMemo(() => {
    if (!isSearching) return { keyword: "" };
    return {
      keyword: searchQuery,
      status: "ACTIVE" as const,
      page: pagination.page,
      limit: pagination.limit,
      ...(filters.categories && { categories: filters.categories }),
    };
  }, [
    isSearching,
    searchQuery,
    pagination.page,
    pagination.limit,
    filters.categories,
  ]);

  const searchQueryHook = useSearchProducts(searchQueryParams);

  const {
    data: rawData,
    isLoading: apiIsLoading,
    isError: apiIsError,
  } = isSearching ? searchQueryHook : productsQuery;

  // Get promotions data with stable params
  const promotionsParams = useMemo(() => ({ status: "ACTIVE" as const }), []);
  const { data: promotionsData } = usePromotions(promotionsParams);
  // Optimize promotions application - only when data changes
  const dataWithPromotions = useMemo(() => {
    if (!rawData?.data?.products) return rawData;

    let products = rawData.data.products;

    if (promotionsData?.data?.promotions?.length > 0) {
      const activePromotions = filterActivePromotions(
        promotionsData.data.promotions
      );
      products = applyPromotionsToProducts([...products], activePromotions);
    }

    return {
      ...rawData,
      data: {
        ...rawData.data,
        products,
      },
    };
  }, [rawData?.data?.products, promotionsData?.data?.promotions]);

  // Optimize product sorting with early return
  const processedProducts = useMemo(() => {
    const products = dataWithPromotions?.data?.products;
    if (!products?.length) return [];

    // Return early if no sorting needed
    if (sortOption === "default" || sortOption === "newest") {
      return products;
    }

    // Only sort if explicitly needed
    return [...products].sort((a, b) => {
      const priceA = (a as any).hasDiscount
        ? (a as any).discountedPrice
        : a.variants[0]?.price || 0;
      const priceB = (b as any).hasDiscount
        ? (b as any).discountedPrice
        : b.variants[0]?.price || 0;

      switch (sortOption) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        default:
          return 0;
      }
    });
  }, [dataWithPromotions?.data?.products, sortOption]);

  // Optimize categories calculation - only when products change
  const dynamicCategories = useMemo(() => {
    const baseCategories = [{ id: "all", name: "Tất cả sản phẩm" }];
    const products = dataWithPromotions?.data?.products;

    if (!products?.length) return baseCategories;

    const uniqueCatObjects = new Map<string, { id: string; name: string }>();

    for (const product of products) {
      if (
        (product as any)?.category &&
        typeof (product as any)?.category === "object" &&
        ((product as any)?.category as any).id &&
        (product as any)?.category.name
      ) {
        if (!uniqueCatObjects.has(((product as any)?.category as any).id)) {
          uniqueCatObjects.set(((product as any)?.category as any).id, {
            id: ((product as any)?.category as any).id,
            name: (product as any)?.category.name,
          });
        }
      } else if (
        typeof (product as any)?.category === "string" &&
        !uniqueCatObjects.has((product as any)?.category)
      ) {
        uniqueCatObjects.set((product as any)?.category, {
          id: (product as any)?.category,
          name: (product as any)?.category,
        });
      }
    }

    return [...baseCategories, ...Array.from(uniqueCatObjects.values())];
  }, [dataWithPromotions?.data?.products?.length]);

  const handleProductSelect = (product: any) => {
    // Keep the product with promotion info intact

    // Convert only for variant handling, but preserve promotion info
    const convertedProduct = convertProductToApiProduct(product);

    // Merge promotion info back to the converted product
    if ((product as any).hasDiscount) {
      (convertedProduct as any).hasDiscount = (product as any)?.hasDiscount;
      (convertedProduct as any).discountedPrice = (
        product as any
      ).discountedPrice;
      (convertedProduct as any).originalPrice = (product as any)?.originalPrice;
      (convertedProduct as any).discountPercent = (
        product as any
      ).discountPercent;
      (convertedProduct as any).appliedPromotion = (
        product as any
      ).appliedPromotion;
    }

    setSelectedProduct(convertedProduct);

    if (convertedProduct.variants && convertedProduct.variants.length > 0) {
      // Prioritize variants with stock, but still allow selection of out-of-stock variants
      const variantWithStock = convertedProduct.variants.find(
        (v) => v.stock > 0
      );
      const selectedVariant = variantWithStock || convertedProduct.variants[0];
      setSelectedApiVariant(selectedVariant);

      if (!variantWithStock) {
        toast.warn("Sản phẩm này hiện tại đã hết hàng.");
      }
    } else {
      setSelectedApiVariant(null);
      toast.warn("Sản phẩm này không có biến thể.");
    }
  };

  const handleColorSelectFromDetail = (colorId: string) => {
    if (!selectedProduct) return;

    // Find variants with the selected color
    const variantsWithThisColor = selectedProduct.variants.filter(
      (v) => v.colorId?.id === colorId
    );
    if (variantsWithThisColor.length === 0) return;

    // Try to find a variant with stock first
    const variantWithStock = variantsWithThisColor.find((v) => v.stock > 0);
    if (variantWithStock) {
      setSelectedApiVariant(variantWithStock);
    } else {
      // If no variants with stock, select the first one
      setSelectedApiVariant(variantsWithThisColor[0]);
      toast.warn("Màu này đã hết hàng.");
    }
  };

  const handleSizeSelectFromDetail = (sizeId: string) => {
    if (!selectedProduct || !selectedApiVariant?.colorId) return;

    // Find variant with selected color and size
    const variantWithThisSizeAndColor = selectedProduct.variants.find(
      (v) =>
        v.colorId?.id === selectedApiVariant.colorId?.id &&
        v.sizeId?.id === sizeId
    );

    if (variantWithThisSizeAndColor) {
      setSelectedApiVariant(variantWithThisSizeAndColor);
      if (variantWithThisSizeAndColor.stock === 0) {
        toast.warn("Kích thước này với màu đã chọn đã hết hàng.");
      }
    }
  };

  const addItemToCorrectCart = (
    product: any,
    variant: any,
    isAlreadyConverted = false
  ) => {
    // Convert product and variant data to standard format if needed
    const convertedProduct = isAlreadyConverted
      ? product
      : convertProductToApiProduct(product);
    const convertedVariant = isAlreadyConverted
      ? variant
      : convertVariantToApiVariant(variant);

    // Create unique cart item identifier
    const cartItemId = `${convertedProduct.id}-${convertedVariant.id}`;

    // Initialize pricing variables
    let finalPrice = convertedVariant.price;
    let originalPrice = undefined;
    let discountPercent = undefined;
    let hasDiscount = false;

    // Check for promotion and apply discount if applicable
    if ((product as any).hasDiscount) {
      // If product has a discount, use the discounted price
      finalPrice = (product as any)?.discountedPrice;
      originalPrice = (product as any)?.originalPrice;
      discountPercent = (product as any)?.discountPercent;
      hasDiscount = true;
    } else if (promotionsData?.data?.promotions?.length > 0) {
      // If no discount applied, check for active promotions
      const activePromotions = filterActivePromotions(
        promotionsData.data.promotions
      );
      const productWithPromotions = applyPromotionsToProducts(
        [convertedProduct],
        activePromotions
      );
      const promotedProduct = productWithPromotions[0];

      if (promotedProduct?.hasDiscount) {
        finalPrice = promotedProduct.discountedPrice;
        originalPrice = promotedProduct.originalPrice;
        discountPercent = promotedProduct.discountPercent;
        hasDiscount = true;
      }
    }

    // Create new cart item
    const newItem: POSCartItem = {
      id: cartItemId,
      productId: convertedProduct.id,
      variantId: convertedVariant.id,
      name: convertedProduct.name,
      colorName: convertedVariant.colorId?.name || "N/A",
      colorCode: convertedVariant.colorId?.code || "#000000",
      sizeName: convertedVariant.sizeId?.name || "N/A",
      price: finalPrice,
      originalPrice: originalPrice,
      discountPercent: discountPercent,
      hasDiscount: hasDiscount,
      quantity: 1,
      image: getVariantImageUrl(convertedVariant) || "/placeholder.svg",
      stock: convertedVariant.stock,
      actualColorId: convertedVariant.colorId?.id || "",
      actualSizeId: convertedVariant.sizeId?.id || "",
    };

    if (activeCartId) {
      const existingItem = cartItems.find((item) => item.id === cartItemId);
      const activeCartName =
        pendingCarts.find((cart) => cart.id === activeCartId)?.name ||
        "Giỏ hàng";

      if (existingItem) {
        if (existingItem.quantity < convertedVariant.stock) {
          updateItemQuantityInPendingCart(activeCartId, cartItemId, 1);
          toast.success(
            `Đã cập nhật số lượng sản phẩm trong ${activeCartName}.`
          );
        } else {
          toast.warn("Số lượng sản phẩm trong kho không đủ.");
        }
      } else {
        // If new item, add to cart
        addItemToPendingCart(activeCartId, newItem);
        toast.success(`Đã thêm sản phẩm vào ${activeCartName}`);
      }
    } else {
      // Add to main cart if no active cart
      const existingItem = mainCartItems.find((item) => item.id === cartItemId);
      if (existingItem) {
        if (existingItem.quantity < convertedVariant.stock) {
          updateQuantityStore(cartItemId, 1);
          toast.success("Đã cập nhật số lượng sản phẩm.");
        } else {
          toast.warn("Số lượng sản phẩm trong kho không đủ.");
        }
      } else {
        addToCartStore(newItem);
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
      }
    }
  };

  const addToCart = () => {
    if (!selectedProduct || !selectedApiVariant) {
      toast.error("Vui lòng chọn sản phẩm và biến thể.");
      return;
    }

    if (selectedApiVariant.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng.");
      return;
    }

    addItemToCorrectCart(selectedProduct, selectedApiVariant, true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleProceedToCheckout = () => {
    const itemsToCheck = activeCart?.items || mainCartItems;
    if (itemsToCheck.length === 0) {
      toast.error("Giỏ hàng đang trống");
      return;
    }
    syncActiveCartToMainCart();
    setCashReceived("");
    setSelectedUserId("guest");
    setCustomerName("");
    setCustomerPhone("");
    setTransferPaymentCompleted(false);
    setShowCheckoutDialog(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "p") {
        handleProceedToCheckout();
      }

      if (e.altKey && e.key === "c") {
        if (cartItems.length > 0 || appliedVoucher) {
          clearCartStore();
          if (activeCartId) {
            clearPendingCartItems(activeCartId);
          }
          setSelectedProduct(null);
          setSelectedApiVariant(null);
          toast.success("Đã xóa giỏ hàng và mã giảm giá.");
        }
      }

      if (e.altKey && e.key === "s") {
        const searchInput = document.getElementById("product-search");
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cartItems, appliedVoucher, handleProceedToCheckout]);

  // Optimize variant calculations with memoization
  const uniqueColorsForSelectedProduct = useMemo(() => {
    if (!selectedProduct?.variants?.length) return [];
    const colorMap = new Map<string, ApiVariant["colorId"]>();

    for (const variant of selectedProduct.variants) {
      if (variant.colorId?.id && !colorMap.has(variant.colorId.id)) {
        colorMap.set(variant.colorId.id, variant.colorId);
      }
    }

    return Array.from(colorMap.values()).filter(Boolean) as NonNullable<
      ApiVariant["colorId"]
    >[];
  }, [selectedProduct?.id, selectedProduct?.variants?.length]);

  const availableSizesForSelectedColor = useMemo(() => {
    if (!selectedProduct?.variants?.length || !selectedApiVariant?.colorId?.id)
      return [];
    const sizeMap = new Map<string, ApiVariant["sizeId"]>();

    for (const variant of selectedProduct.variants) {
      if (
        variant.colorId?.id === selectedApiVariant.colorId.id &&
        variant.sizeId?.id &&
        !sizeMap.has(variant.sizeId.id)
      ) {
        sizeMap.set(variant.sizeId.id, variant.sizeId);
      }
    }

    return Array.from(sizeMap.values()).filter(Boolean) as NonNullable<
      ApiVariant["sizeId"]
    >[];
  }, [selectedProduct?.id, selectedApiVariant?.colorId?.id]);
  // Helper function to safely get color info from variants
  const getColorInfo = useCallback((colorId: any) => {
    if (!colorId) return null;
    if (typeof colorId === "object" && colorId.id) {
      return colorId;
    }
    return null;
  }, []);

  // Helper function to safely get unique colors from variants
  const getUniqueColors = useCallback(
    (variants: any[]) => {
      if (!variants?.length) return [];
      const colorMap = new Map();

      variants.forEach((v) => {
        const colorInfo = getColorInfo(v.colorId);
        if (colorInfo) {
          colorMap.set(colorInfo.id, colorInfo);
        }
      });

      return Array.from(colorMap.values());
    },
    [getColorInfo]
  );

  const handleCreateNewCart = () => {
    const newCartId = createNewCart();
    if (!newCartId) {
      toast.warn("Không thể tạo thêm giỏ hàng. Tối đa 5 Hoá đơn chờ!");
      return;
    }
    toast.success(`Đã tạo giỏ hàng mới: Giỏ hàng ${pendingCarts.length + 1}`);
  };

  const handleDeleteCart = (cartId: string) => {
    setCartToDelete(cartId);
    setShowDeleteCartDialog(true);
  };

  const handleSwitchCart = (cartId: string) => {
    setActiveCart(cartId);
    const cart = pendingCarts.find((c) => c.id === cartId);
    if (cart) {
      toast.info(`Đã chuyển sang ${cart.name}`);
    }
  };

  // Sync active cart to main cart before checkout
  const syncActiveCartToMainCart = () => {
    if (activeCart) {
      // Clear main cart first
      clearCartStore();

      // Add all items from active cart to main cart
      activeCart.items.forEach((item) => {
        addToCartStore(item);
      });

      // Set discount and voucher
      setDiscount(activeCart.appliedDiscount);
      setVoucher(activeCart.appliedVoucher);
      setCouponCode(activeCart.couponCode);
    }
  };
  return (
    <div className="h-full">
      {/* Header với breadcrumb navigation */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/statistics">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bán hàng tại quầy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Phần quản lý các giỏ hàng đang chờ */}
      <div className="bg-white rounded-[6px] p-4 mb-4 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <Icon path={mdiCart} size={1} className="text-primary" />
            Hoá đơn chờ ({pendingCarts.length}/5)
          </h3>
          <Button
            onClick={handleCreateNewCart}
            disabled={pendingCarts.length >= 5}
          >
            <Icon path={mdiInvoicePlus} size={0.8} />
            Thêm mới
          </Button>
        </div>

        {/* Danh sách các giỏ hàng đang chờ */}
        {pendingCarts.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {pendingCarts.slice(0, 5).map((cart) => (
              <motion.button
                key={cart.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "relative flex items-center gap-2 p-2 rounded-sm border-2 transition-all duration-200 min-w-[140px] group",
                  activeCartId === cart.id
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-border bg-white text-gray-700 hover:border-primary/50 hover:bg-primary/5"
                )}
                onClick={() => handleSwitchCart(cart.id)}
              >
                {/* Hiển thị thông tin giỏ hàng */}
                <div className="flex items-center gap-1 flex-1">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      cart.items.length > 0 ? "bg-[#EAEBF2]0" : "bg-gray-300"
                    )}
                  />
                  <span className="text-sm font-medium truncate">
                    {cart.name}{" "}
                    <span className="text-sm text-gray-700 font-semibold">
                      (
                      {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                      )
                    </span>
                  </span>
                </div>
                {/* Nút xóa giỏ hàng */}
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity border border-red-500/70 p-1 hover:bg-red-400 bg-red-400 rounded-full hover:!text-white text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCart(cart.id);
                  }}
                >
                  <Icon
                    path={mdiClose}
                    size={0.8}
                    className="hover:!text-white"
                  />
                </button>
              </motion.button>
            ))}

            {/* Dropdown menu cho các giỏ hàng phụ (nếu có nhiều hơn 5) */}
            {pendingCarts.length > 5 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-w-[100px] h-[46px] border-2 border-primary/50 flex items-center justify-center text-sm"
                  >
                    +{pendingCarts.length - 4} khác
                    <Icon path={mdiChevronDown} size={0.8} className="ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {pendingCarts.slice(4).map((cart) => (
                    <DropdownMenuItem
                      key={cart.id}
                      className="flex items-center justify-between"
                      onClick={() => handleSwitchCart(cart.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            cart.items.length > 0
                              ? "bg-[#EAEBF2]0"
                              : "bg-gray-300"
                          )}
                        />
                        <span>{cart.name}</span>
                        {cart.items.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {cart.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}
                          </Badge>
                        )}
                      </div>
                      <button
                        className="p-1 hover:bg-red-100 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCart(cart.id);
                        }}
                      >
                        <Icon
                          path={mdiClose}
                          size={0.4}
                          className="text-red-500"
                        />
                      </button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Layout chính chia làm 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cột trái - Danh sách sản phẩm */}
        <div className="lg:col-span-2 overflow-hidden flex flex-col">
          {/* Thanh tìm kiếm và lọc */}
          <div className="bg-white rounded-[6px] p-4 mb-4 shadow-sm border border-border hover:shadow-sm transition-shadow duration-300">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Icon
                  path={mdiMagnify}
                  size={1}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700"
                />
                <Input
                  id="product-search"
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-[6px] border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Danh sách danh mục sản phẩm */}
            <div className="flex overflow-x-auto pb-2 scrollbar-thin gap-2">
              {dynamicCategories.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    "whitespace-nowrap px-4 py-2 rounded-[6px] text-sm font-medium transition-all duration-200",
                    activeCategoryName === category.name
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-primary"
                  )}
                  onClick={() => {
                    setActiveCategoryName(category.name);
                    setSelectedProduct(null);
                    setSelectedApiVariant(null);
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Khu vực hiển thị sản phẩm */}
          <div className="bg-white rounded-xl p-4 flex-1 shadow-sm border border-border/50 hover:shadow-sm transition-all duration-300 min-h-[400px]">
            {/* Nút quay lại khi đang xem chi tiết sản phẩm */}
            {selectedProduct && (
              <div className="w-full flex items-center justify-between mb-4">
                <motion.button
                  className="text-sm text-primary font-medium flex items-center gap-2 hover:text-primary/80 transition-colors bg-primary/5 px-4 py-2 rounded-full border border-primary/50"
                  onClick={() => {
                    setSelectedProduct(null);
                    setSelectedApiVariant(null);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon path={mdiChevronLeft} size={0.8} />
                  Quay lại danh sách sản phẩm
                </motion.button>
              </div>
            )}

            {/* Chi tiết sản phẩm hoặc danh sách sản phẩm */}
            {selectedProduct && selectedApiVariant ? (
              // Hiển thị chi tiết sản phẩm khi có sản phẩm được chọn
              <div className="mb-4">
                <div className="flex flex-col lg:flex-row gap-6">
                  <motion.div
                    className="lg:w-1/2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white border group">
                      <img
                        src={checkImageUrl(
                          getVariantImageUrl(selectedApiVariant) ||
                            getVariantImageUrl(selectedProduct.variants[0])
                        )}
                        alt={selectedProduct.name}
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    </div>
                    {selectedApiVariant && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full mt-4"
                          onClick={addToCart}
                          disabled={selectedApiVariant.stock === 0}
                        >
                          <Icon path={mdiCartPlus} size={0.8} />
                          Thêm vào giỏ hàng POS
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Enhanced Product Information Section */}
                  <motion.div
                    className="lg:w-1/2 space-y-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {/* Product Header */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-gray-700">
                          Admin POS
                        </Badge>
                        {(selectedProduct as any).hasDiscount && (
                          <Badge
                            variant="destructive"
                            className="bg-[#EAEBF2]0"
                          >
                            -{(selectedProduct as any).discountPercent}% OFF
                          </Badge>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-gray-700 leading-tight">
                        {selectedProduct.name}
                      </h2>

                      {(selectedProduct as any).hasDiscount &&
                        (selectedProduct as any).appliedPromotion && (
                          <div className="text-sm text-green-600 bg-[#EAEBF2] px-3 py-2 rounded-lg border border-green-200">
                            🎉 Đang áp dụng khuyến mãi:{" "}
                            <span className="font-semibold">
                              {(selectedProduct as any).appliedPromotion.name}
                            </span>
                          </div>
                        )}

                      <motion.div
                        className="space-y-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-4xl font-bold text-primary">
                          {formatCurrency(
                            (selectedProduct as any).hasDiscount
                              ? (selectedProduct as any).discountedPrice
                              : selectedApiVariant.price
                          )}
                        </div>
                        {(selectedProduct as any).hasDiscount && (
                          <div className="flex items-center gap-2">
                            <span className="text-xl text-gray-700 line-through">
                              {formatCurrency(
                                (selectedProduct as any).originalPrice
                              )}
                            </span>
                            <Badge
                              variant="destructive"
                              className="bg-[#EAEBF2]0"
                            >
                              -{(selectedProduct as any).discountPercent}% OFF
                            </Badge>
                          </div>
                        )}
                      </motion.div>
                    </div>
                    {/* Enhanced Color Selection */}
                    {uniqueColorsForSelectedProduct.length > 0 && (
                      <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Icon
                            path={mdiPalette}
                            size={1}
                            className="text-primary"
                          />
                          <h3 className="text-base font-semibold text-gray-700">
                            Màu sắc
                          </h3>
                          {selectedApiVariant?.colorId && (
                            <Badge
                              variant="secondary"
                              className="bg-primary/10 text-primary border-primary/20"
                            >
                              {selectedApiVariant.colorId.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-4 flex-wrap">
                          {uniqueColorsForSelectedProduct.map((color) => (
                            <motion.button
                              key={color.id}
                              className={cn(
                                "relative group flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 border-2",
                                selectedApiVariant?.colorId?.id === color.id
                                  ? "border-primary ring-4 ring-primary/20 scale-110"
                                  : "border-gray-200 hover:border-gray-300 hover:scale-105"
                              )}
                              style={{ backgroundColor: color.code }}
                              onClick={() =>
                                handleColorSelectFromDetail(color.id)
                              }
                              title={color.name}
                              whileHover={{
                                scale:
                                  selectedApiVariant?.colorId?.id === color.id
                                    ? 1.1
                                    : 1.05,
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {selectedApiVariant?.colorId?.id === color.id && (
                                <Icon
                                  path={mdiCheck}
                                  size={1}
                                  className="text-white drop-shadow-sm"
                                />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {/* Enhanced Size Selection */}
                    {availableSizesForSelectedColor.length > 0 &&
                      selectedApiVariant?.colorId && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Icon
                              path={mdiRuler}
                              size={1}
                              className="text-primary"
                            />
                            <h3 className="text-base font-semibold text-gray-700">
                              Kích thước
                            </h3>
                            {selectedApiVariant?.sizeId && (
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary border-primary/20"
                              >
                                {selectedApiVariant.sizeId.name ||
                                  (selectedApiVariant.sizeId.value
                                    ? getSizeLabel(
                                        Number(selectedApiVariant.sizeId.value)
                                      )
                                    : "N/A")}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4">
                            {availableSizesForSelectedColor.map((size) => {
                              const variantForThisSize =
                                selectedProduct.variants.find(
                                  (v) =>
                                    v.colorId?.id ===
                                      selectedApiVariant.colorId?.id &&
                                    v.sizeId?.id === size.id
                                );
                              const stockForThisSize =
                                variantForThisSize?.stock || 0;
                              const isSelected =
                                selectedApiVariant?.sizeId?.id === size.id;
                              return (
                                <Button
                                  key={size.id}
                                  variant={isSelected ? "outline" : "ghost"}
                                  className={cn(
                                    "transition-all duration-300 min-w-[60px] h-auto py-2 px-4 flex flex-col items-center border-2",
                                    stockForThisSize === 0 &&
                                      "opacity-50 cursor-not-allowed"
                                  )}
                                  onClick={() =>
                                    handleSizeSelectFromDetail(size.id)
                                  }
                                  disabled={stockForThisSize === 0}
                                >
                                  <span className="font-medium">
                                    {size.name ||
                                      (size.value
                                        ? getSizeLabel(Number(size.value))
                                        : "N/A")}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-xs mt-1",
                                      stockForThisSize === 0
                                        ? "text-red-500"
                                        : "text-gray-500"
                                    )}
                                  >
                                    {stockForThisSize === 0
                                      ? "Hết hàng"
                                      : `Kho: ${stockForThisSize}`}
                                  </span>
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    <div className="flex items-center gap-2">
                      <Icon
                        path={mdiPackageVariant}
                        size={1}
                        className="text-primary"
                      />
                      <h3 className="text-base font-semibold text-gray-700">
                        Tồn kho
                      </h3>
                      <Badge
                        variant={
                          selectedApiVariant.stock > 10
                            ? "secondary"
                            : selectedApiVariant.stock > 0
                            ? "outline"
                            : "destructive"
                        }
                        className={cn(
                          selectedApiVariant.stock > 10
                            ? "bg-green-100 text-green-700 border-green-200"
                            : selectedApiVariant.stock > 0
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        )}
                      >
                        {selectedApiVariant.stock > 0
                          ? `${selectedApiVariant.stock} sản phẩm`
                          : "Hết hàng"}
                      </Badge>
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : (
              // Hiển thị danh sách sản phẩm
              <Tabs defaultValue="grid" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger
                      value="grid"
                      className="flex items-center gap-1 text-gray-700"
                    >
                      <Icon path={mdiViewGrid} size={0.8} />
                      Lưới
                    </TabsTrigger>
                    <TabsTrigger
                      value="table"
                      className="flex items-center gap-1 text-gray-700"
                    >
                      <Icon path={mdiTableLarge} size={0.8} />
                      Bảng
                    </TabsTrigger>
                  </TabsList>

                  <div className="text-sm text-gray-700">
                    Hiển thị{" "}
                    {apiIsLoading ? (
                      <Skeleton className="h-4 w-5 inline-block" />
                    ) : (
                      processedProducts.length
                    )}{" "}
                    / {rawData?.data?.pagination?.totalItems || 0} sản phẩm
                  </div>
                </div>

                {apiIsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(pagination.limit)].map((_, index) => (
                      <CardSkeleton key={index} />
                    ))}
                  </div>
                ) : apiIsError ? (
                  <div className="text-center py-10 text-red-500">
                    Lỗi khi tải sản phẩm. Vui lòng thử lại.
                  </div>
                ) : processedProducts.length === 0 ? (
                  <div className="text-center py-10 text-gray-700">
                    Không tìm thấy sản phẩm nào.
                  </div>
                ) : (
                  <>
                    <TabsContent value="grid" className="mt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {processedProducts.map((product) => {
                          const firstVariant = (product as any)?.variants?.[0];
                          const uniqueColors = getUniqueColors(
                            (product as any)?.variants
                          );
                          return (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-white rounded-[6px] border border-border shadow-sm overflow-hidden hover:shadow-sm transition-all duration-300 group"
                            >
                              <div
                                className="relative h-48 w-full bg-gray-50 overflow-hidden cursor-pointer"
                                onClick={() => handleProductSelect(product)}
                              >
                                <img
                                  src={checkImageUrl(
                                    getVariantImageUrl(firstVariant)
                                  )}
                                  alt={product.name}
                                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 flex flex-col gap-1">
                                  {(product as any).hasDiscount && (
                                    <Badge
                                      variant="destructive"
                                      className="bg-[#EAEBF2]0 text-white"
                                    >
                                      -{(product as any).discountPercent}% OFF
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="p-4">
                                <h3
                                  className="font-medium text-gray-700 group-hover:text-primary transition-colors truncate cursor-pointer"
                                  onClick={() => handleProductSelect(product)}
                                >
                                  {product.name}
                                </h3>
                                <div className="flex justify-between items-center">
                                  <div className="flex flex-col">
                                    <p
                                      className={`font-medium ${
                                        (product as any)?.hasDiscount
                                          ? "text-primary"
                                          : "text-primary"
                                      }`}
                                    >
                                      {firstVariant
                                        ? formatCurrency(
                                            (product as any)?.hasDiscount
                                              ? (product as any)
                                                  ?.discountedPrice
                                              : firstVariant.price
                                          )
                                        : "N/A"}
                                    </p>
                                    {(product as any).hasDiscount && (
                                      <p className="text-xs text-gray-700 line-through">
                                        {formatCurrency(
                                          (product as any)?.originalPrice
                                        )}
                                      </p>
                                    )}
                                  </div>
                                  {uniqueColors.length > 0 && (
                                    <div className="flex -space-x-1">
                                      {uniqueColors
                                        .slice(0, 3)
                                        .map((color, idx) => (
                                          <div
                                            key={color.id || `color-${idx}`}
                                            className="h-5 w-5 rounded-full border border-white"
                                            style={{
                                              backgroundColor: color.code,
                                            }}
                                            title={color.name}
                                          />
                                        ))}
                                      {uniqueColors.length > 3 && (
                                        <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs text-gray-700">
                                          +{uniqueColors.length - 3}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  className="w-full mt-3 flex items-center justify-center gap-2"
                                  onClick={() => handleProductSelect(product)}
                                  disabled={product.variants.every(
                                    (v) => v.stock === 0
                                  )}
                                >
                                  <Icon path={mdiEye} size={0.8} />
                                  Xem chi tiết
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="table" className="mt-0">
                      <div className="border border-border rounded-[6px] overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="text-left py-3 px-4 font-medium text-gray-700">
                                Sản phẩm
                              </th>

                              <th className="text-left py-3 px-4 font-medium text-gray-700">
                                Giá
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">
                                Màu sắc
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">
                                Kho
                              </th>
                              <th className="text-center py-3 px-4 font-medium text-gray-700">
                                Thao tác
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {processedProducts.map((product) => {
                              const firstVariant = (product as any)
                                .variants?.[0];
                              const totalStock = (
                                product as any
                              ).variants.reduce((sum, v) => sum + v.stock, 0);
                              const uniqueColorsCount = new Set(
                                (product as any)?.variants.map(
                                  (v) => (v as any)?.colorId?.id
                                )
                              ).size;
                              return (
                                <tr
                                  key={product.id}
                                  className="border-t border-border hover:bg-muted/20 transition-colors cursor-pointer"
                                >
                                  <td
                                    className="py-3 px-4"
                                    onClick={() => handleProductSelect(product)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="relative h-10 w-10 rounded-[6px] overflow-hidden bg-gray-50">
                                        <img
                                          src={checkImageUrl(
                                            getVariantImageUrl(firstVariant)
                                          )}
                                          alt={product.name}
                                          className="object-contain"
                                        />
                                      </div>
                                      <span className="font-medium text-gray-700 truncate max-w-[150px]">
                                        {product.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td
                                    className="py-3 px-4"
                                    onClick={() => handleProductSelect(product)}
                                  >
                                    <div className="flex flex-col">
                                      <span
                                        className={`font-medium ${
                                          (product as any)?.hasDiscount
                                            ? "text-primary"
                                            : "text-primary"
                                        }`}
                                      >
                                        {firstVariant
                                          ? formatCurrency(
                                              (product as any)?.hasDiscount
                                                ? (product as any)
                                                    .discountedPrice
                                                : firstVariant.price
                                            )
                                          : "N/A"}
                                      </span>
                                      {(product as any).hasDiscount && (
                                        <span className="text-xs text-gray-700 line-through">
                                          {formatCurrency(
                                            (product as any)?.originalPrice
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td
                                    className="py-3 px-4"
                                    onClick={() => handleProductSelect(product)}
                                  >
                                    {product.variants.length > 0 && (
                                      <div className="flex -space-x-1">
                                        {Array.from(
                                          new Map(
                                            (product as any)?.variants.map(
                                              (v) => [
                                                (v as any)?.colorId?.id,
                                                (v as any)?.colorId,
                                              ]
                                            )
                                          ).values()
                                        )
                                          .slice(0, 3)
                                          .map(
                                            (color, idx) =>
                                              color && (
                                                <div
                                                  key={
                                                    (color as any).id ||
                                                    `table-color-${idx}`
                                                  }
                                                  className="h-5 w-5 rounded-full border"
                                                  style={{
                                                    backgroundColor: (
                                                      color as any
                                                    ).code,
                                                  }}
                                                  title={(color as any).name}
                                                />
                                              )
                                          )}
                                        {uniqueColorsCount > 3 && (
                                          <div className="h-5 w-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-xs text-gray-700">
                                            +{uniqueColorsCount - 3}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td
                                    className="py-3 px-4"
                                    onClick={() => handleProductSelect(product)}
                                  >
                                    <Badge
                                      variant={
                                        totalStock > 10
                                          ? "secondary"
                                          : totalStock > 0
                                          ? "outline"
                                          : "destructive"
                                      }
                                      className="text-xs !flex-shrink-0"
                                    >
                                      <span className="flex-shrink-0">
                                        {totalStock > 10
                                          ? "Còn hàng"
                                          : totalStock > 0
                                          ? "Sắp hết"
                                          : "Hết hàng"}
                                      </span>
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleProductSelect(product);
                                              }}
                                            >
                                              <Icon
                                                path={mdiInformationSlabCircle}
                                                size={0.8}
                                                className="text-gray-700"
                                              />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Chi tiết</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0"
                                              disabled={product.variants.every(
                                                (v) => v.stock === 0
                                              )}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                // Use the product from the list (which already has promotions applied)
                                                const firstAvailableVariant = (
                                                  product as any
                                                ).variants.find(
                                                  (v: any) => v.stock > 0
                                                );
                                                if (firstAvailableVariant) {
                                                  addItemToCorrectCart(
                                                    product,
                                                    firstAvailableVariant,
                                                    false
                                                  );
                                                } else {
                                                  toast.warn(
                                                    "Sản phẩm này đã hết hàng."
                                                  );
                                                }
                                              }}
                                            >
                                              <Icon
                                                path={mdiPlus}
                                                size={0.8}
                                                className="text-gray-700"
                                              />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Thêm vào giỏ</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>

                    {dataWithPromotions?.data?.pagination &&
                      dataWithPromotions.data.pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (pagination.page > 1) {
                                      setPagination((p) => ({
                                        ...p,
                                        page: p.page - 1,
                                      }));
                                    }
                                  }}
                                  disabled={pagination.page <= 1}
                                />
                              </PaginationItem>
                              {(() => {
                                const pages = [];
                                const totalPages =
                                  dataWithPromotions.data.pagination.totalPages;
                                const currentPage = pagination.page;
                                const pageLimit = 5;

                                if (totalPages <= pageLimit) {
                                  for (let i = 1; i <= totalPages; i++) {
                                    pages.push(
                                      <PaginationItem key={i}>
                                        <PaginationLink
                                          href="#"
                                          isActive={currentPage === i}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setPagination((p) => ({
                                              ...p,
                                              page: i,
                                            }));
                                          }}
                                        >
                                          {i}
                                        </PaginationLink>
                                      </PaginationItem>
                                    );
                                  }
                                } else {
                                  pages.push(
                                    <PaginationItem key={1}>
                                      <PaginationLink
                                        href="#"
                                        isActive={currentPage === 1}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setPagination((p) => ({
                                            ...p,
                                            page: 1,
                                          }));
                                        }}
                                      >
                                        1
                                      </PaginationLink>
                                    </PaginationItem>
                                  );

                                  if (currentPage > 3) {
                                    pages.push(
                                      <PaginationItem key="start-ellipsis">
                                        <PaginationEllipsis />
                                      </PaginationItem>
                                    );
                                  }

                                  let startPage = Math.max(2, currentPage - 1);
                                  let endPage = Math.min(
                                    totalPages - 1,
                                    currentPage + 1
                                  );

                                  if (currentPage <= 2) {
                                    endPage = Math.min(totalPages - 1, 3);
                                  }
                                  if (currentPage >= totalPages - 1) {
                                    startPage = Math.max(2, totalPages - 2);
                                  }

                                  for (let i = startPage; i <= endPage; i++) {
                                    pages.push(
                                      <PaginationItem key={i}>
                                        <PaginationLink
                                          href="#"
                                          isActive={currentPage === i}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setPagination((p) => ({
                                              ...p,
                                              page: i,
                                            }));
                                          }}
                                        >
                                          {i}
                                        </PaginationLink>
                                      </PaginationItem>
                                    );
                                  }

                                  if (currentPage < totalPages - 2) {
                                    pages.push(
                                      <PaginationItem key="end-ellipsis">
                                        <PaginationEllipsis />
                                      </PaginationItem>
                                    );
                                  }

                                  pages.push(
                                    <PaginationItem key={totalPages}>
                                      <PaginationLink
                                        href="#"
                                        isActive={currentPage === totalPages}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setPagination((p) => ({
                                            ...p,
                                            page: totalPages,
                                          }));
                                        }}
                                      >
                                        {totalPages}
                                      </PaginationLink>
                                    </PaginationItem>
                                  );
                                }
                                return pages;
                              })()}
                              <PaginationItem>
                                <PaginationNext
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (
                                      pagination.page <
                                      (dataWithPromotions?.data?.pagination
                                        ?.totalPages || 1)
                                    ) {
                                      setPagination((p) => ({
                                        ...p,
                                        page: p.page + 1,
                                      }));
                                    }
                                  }}
                                  disabled={
                                    pagination.page >=
                                    (dataWithPromotions?.data?.pagination
                                      ?.totalPages || 1)
                                  }
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                  </>
                )}
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
