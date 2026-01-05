import { IPromotion } from "@/interface/response/promotion";

export interface ProductWithDiscount {
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number; // For display purposes, calculated even for FIXED_AMOUNT
  discountAmount: number;
  appliedPromotion?: IPromotion;
}

export const calculateProductDiscount = (
  productId: string,
  originalPrice: number,
  activePromotions: IPromotion[]
): ProductWithDiscount => {
  if (!activePromotions || activePromotions.length === 0) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountPercent: 0,
      discountAmount: 0,
    };
  }

  const now = new Date();

  const applicablePromotions = activePromotions.filter((promotion) => {
    // Check status
    if (promotion.status !== "ACTIVE") {
      return false;
    }

    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (now < startDate || now > endDate) {
      return false;
    }

    // New logic: handle applyTo
    if (promotion.applyTo === "ALL_PRODUCTS") {
      return true;
    }

    // Handle productIds
    let productIds: string[] = [];
    if (Array.isArray(promotion.productIds)) {
      productIds = promotion.productIds;
    } else if (promotion.products) {
      // Fallback for old structure if still exists
      productIds = (promotion.products as any[]).map((p) =>
        typeof p === "string" ? p : (p as any)?.id || p._id
      );
    }

    return productIds.some((pId) => String(pId) === String(productId));
  });

  if (applicablePromotions.length === 0) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountPercent: 0,
      discountAmount: 0,
    };
  }

  // Find the BEST promotion (maximal discount amount)
  const bestPromotionInfo = applicablePromotions
    .map((promo) => {
      let discountAmt = 0;
      const val = parseFloat(String(promo.discountValue));

      if (promo.discountType === "PERCENTAGE") {
        discountAmt = (originalPrice * val) / 100;
      } else {
        // FIXED_AMOUNT
        discountAmt = val;
      }

      return {
        promotion: promo,
        discountAmount: discountAmt,
      };
    })
    .reduce((best, current) => {
      return current.discountAmount > best.discountAmount ? current : best;
    });

  const finalDiscountAmount = Math.min(
    originalPrice,
    bestPromotionInfo.discountAmount
  );
  const discountedPrice = originalPrice - finalDiscountAmount;
  const calculatedPercent =
    originalPrice > 0 ? (finalDiscountAmount / originalPrice) * 100 : 0;

  return {
    originalPrice,
    discountedPrice: Math.max(0, Math.round(discountedPrice)),
    discountPercent: Math.round(calculatedPercent),
    discountAmount: Math.round(finalDiscountAmount),
    appliedPromotion: bestPromotionInfo.promotion,
  };
};

export const applyPromotionsToProducts = (
  products: any[],
  activePromotions: IPromotion[]
): any[] => {
  if (!activePromotions || activePromotions.length === 0) {
    return products.map((p) => ({
      ...p,
      hasDiscount: false,
      discountedPrice: p.variants?.[0]?.price || 0,
      originalPrice: p.variants?.[0]?.price || 0,
      discountPercent: 0,
    }));
  }

  return products.map((product) => {
    const basePrice = (product as any)?.variants?.[0]?.price || 0;

    if (basePrice === 0) {
      return {
        ...product,
        originalPrice: 0,
        discountedPrice: 0,
        discountPercent: 0,
        discountAmount: 0,
        hasDiscount: false,
      };
    }

    const productId = String((product as any)?.id || (product as any)?._id);

    const discountInfo = calculateProductDiscount(
      productId,
      basePrice,
      activePromotions
    );

    return {
      ...product,
      originalPrice: discountInfo.originalPrice,
      discountedPrice: discountInfo.discountedPrice,
      discountPercent: discountInfo.discountPercent,
      discountAmount: discountInfo.discountAmount,
      appliedPromotion: discountInfo.appliedPromotion,
      hasDiscount: discountInfo.discountAmount > 0,
    };
  });
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};

export const isPromotionActive = (promotion: any): boolean => {
  if (promotion.status !== "ACTIVE") return false;

  const now = new Date();

  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);

  // Check if current time is within the promotion period
  return now >= startDate && now <= endDate;
};

export const filterActivePromotions = (promotions: any[]): any[] => {
  if (!promotions || promotions.length === 0) return [];

  const now = new Date();
  const activePromotions = promotions.filter((promotion) => {
    const isActive = isPromotionActive(promotion);
    return isActive;
  });
  return activePromotions;
};
