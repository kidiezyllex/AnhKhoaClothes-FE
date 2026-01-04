import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { getSizeLabel } from "@/utils/sizeMapping";
import { toast } from "react-toastify";
import {
  useBrands,
  useCategories,
  useColors,
  useSizes,
  useFilterOptions,
} from "@/hooks/product";
import type { IProductFilter } from "@/interface/request/product";

interface ProductFiltersProps {
  filters: IProductFilter;
  onChange: (filters: Partial<IProductFilter>) => void;
  formatPrice: (price: number) => string;
}

export const ProductFilters = ({
  filters,
  onChange,
  formatPrice,
}: ProductFiltersProps) => {
  const { data: brandsData, isLoading: isLoadingBrands } = useBrands();
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();
  const { data: colorsData, isLoading: isLoadingColors } = useColors();
  const { data: sizesData, isLoading: isLoadingSizes } = useSizes();
  const { data: filterOptionsData, isLoading: isLoadingFilterOptions } =
    useFilterOptions();

  // State cho các bộ lọc hiện có
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    filters.brands
      ? Array.isArray(filters.brands)
        ? filters.brands[0]
        : filters.brands
      : undefined
  );

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    filters.categories
      ? Array.isArray(filters.categories)
        ? filters.categories[0]
        : filters.categories
      : undefined
  );

  // State cho các bộ lọc mới từ filter options API
  const [selectedArticleType, setSelectedArticleType] = useState<
    string | undefined
  >(filters.articleType);

  const [selectedGender, setSelectedGender] = useState<string | undefined>(
    filters.gender
  );

  const [selectedBaseColour, setSelectedBaseColour] = useState<
    string | undefined
  >(filters.baseColour);

  const [selectedSeason, setSelectedSeason] = useState<string | undefined>(
    filters.season
  );

  const [selectedUsage, setSelectedUsage] = useState<string | undefined>(
    filters.usage
  );

  // Sync state với filters prop
  useEffect(() => {
    if (filters.brands) {
      setSelectedBrand(
        Array.isArray(filters.brands) ? filters.brands[0] : filters.brands
      );
    } else {
      setSelectedBrand(undefined);
    }
  }, [filters.brands]);

  useEffect(() => {
    if (filters.categories) {
      setSelectedCategory(
        Array.isArray(filters.categories)
          ? filters.categories[0]
          : filters.categories
      );
    } else {
      setSelectedCategory(undefined);
    }
  }, [filters.categories]);

  // Handlers cho các bộ lọc hiện có
  const handleBrandChange = (brandId: string) => {
    if (selectedBrand === brandId) {
      setSelectedBrand(undefined);
      onChange({ brands: undefined });
    } else {
      setSelectedBrand(brandId);
      onChange({ brands: brandId });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(undefined);
      onChange({ categories: undefined });
    } else {
      setSelectedCategory(categoryId);
      onChange({ categories: categoryId });
    }
  };

  const handleColorChange = (colorId: string) => {
    onChange({
      color: filters.color === colorId ? undefined : colorId,
    });
  };

  const handleSizeChange = (sizeId: string) => {
    onChange({
      size: filters.size === sizeId ? undefined : sizeId,
    });
  };

  // Handlers cho các bộ lọc mới
  const handleArticleTypeChange = (articleType: string) => {
    const newValue =
      selectedArticleType === articleType ? undefined : articleType;
    setSelectedArticleType(newValue);
    onChange({ articleType: newValue });
  };

  const handleGenderChange = (gender: string) => {
    const newValue = selectedGender === gender ? undefined : gender;
    setSelectedGender(newValue);
    onChange({ gender: newValue });
  };

  const handleBaseColourChange = (baseColour: string) => {
    const newValue = selectedBaseColour === baseColour ? undefined : baseColour;
    setSelectedBaseColour(newValue);
    onChange({ baseColour: newValue });
  };

  const handleSeasonChange = (season: string) => {
    const newValue = selectedSeason === season ? undefined : season;
    setSelectedSeason(newValue);
    onChange({ season: newValue });
  };

  const handleUsageChange = (usage: string) => {
    const newValue = selectedUsage === usage ? undefined : usage;
    setSelectedUsage(newValue);
    onChange({ usage: newValue });
  };

  // Memoized data
  const brands = useMemo(() => {
    return brandsData?.data?.brands || [];
  }, [brandsData]);

  const categories = useMemo(() => {
    return categoriesData?.data?.categories || [];
  }, [categoriesData]);

  const colors = useMemo(() => {
    return colorsData?.data?.colors || [];
  }, [colorsData]);

  const sizes = useMemo(() => {
    const allowedLabels = ["S", "M", "L", "XL", "XXL"];
    const rawSizes = sizesData?.data?.sizes || [];

    return allowedLabels.map((label) => {
      const found = rawSizes.find((s) => {
        const numericValue = parseFloat(s.name || "");
        const sizeLabel = !isNaN(numericValue)
          ? getSizeLabel(numericValue)
          : s.name;
        return sizeLabel === label;
      });
      return {
        id: found?.id,
        displayName: label,
      };
    });
  }, [sizesData]);

  const filterOptions = useMemo(() => {
    return (
      filterOptionsData?.data || {
        articleTypes: [],
        genders: [],
        baseColours: [],
        seasons: [],
        usages: [],
      }
    );
  }, [filterOptionsData]);

  const priceRange = useMemo(() => {
    return { min: 0, max: 10000000 };
  }, []);

  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([filters.minPrice || priceRange.min, filters.maxPrice || priceRange.max]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePriceChange = (values: number[]) => {
    setSelectedPriceRange(values as [number, number]);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onChange({
        minPrice: values[0],
        maxPrice: values[1],
      });
    }, 500);
  };

  const handleResetFilters = () => {
    setSelectedPriceRange([priceRange.min, priceRange.max]);
    setSelectedBrand(undefined);
    setSelectedCategory(undefined);
    setSelectedArticleType(undefined);
    setSelectedGender(undefined);
    setSelectedBaseColour(undefined);
    setSelectedSeason(undefined);
    setSelectedUsage(undefined);

    onChange({
      brands: undefined,
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      color: undefined,
      size: undefined,
      articleType: undefined,
      gender: undefined,
      baseColour: undefined,
      season: undefined,
      usage: undefined,
    });

    toast.info("Đã đặt lại bộ lọc");
  };

  if (
    isLoadingBrands ||
    isLoadingCategories ||
    isLoadingColors ||
    isLoadingSizes ||
    isLoadingFilterOptions
  ) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Price Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Giá</h3>
        <div className="px-2">
          <Slider
            defaultValue={[priceRange.min, priceRange.max]}
            min={priceRange.min}
            max={priceRange.max}
            step={100000}
            value={selectedPriceRange}
            onValueChange={(value) =>
              handlePriceChange(value as [number, number])
            }
          />
          <div className="flex justify-between mt-2 text-sm text-maintext">
            <span>{formatPrice(selectedPriceRange[0])}</span>
            <span>{formatPrice(selectedPriceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Article Type Filter */}
      {filterOptions.articleTypes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Loại sản phẩm</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {filterOptions.articleTypes.map((articleType) => (
              <div key={articleType} className="flex items-center gap-2">
                <Checkbox
                  id={`articleType-${articleType}`}
                  checked={selectedArticleType === articleType}
                  onCheckedChange={() => handleArticleTypeChange(articleType)}
                />
                <label
                  htmlFor={`articleType-${articleType}`}
                  className="text-sm cursor-pointer"
                >
                  {articleType}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Size Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Kích cỡ</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button
              key={size.displayName}
              variant={filters.size === size.id ? "default" : "outline"}
              size="sm"
              className="h-9 w-12 transition-all duration-300"
              onClick={() => size.id && handleSizeChange(size.id)}
              disabled={!size.id}
            >
              {size.displayName}
            </Button>
          ))}
        </div>
      </div>

      {/* Season Filter */}
      {filterOptions.seasons.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Mùa</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.seasons.map((season) => (
              <Button
                key={season}
                variant={selectedSeason === season ? "default" : "outline"}
                size="sm"
                className="h-8 transition-colors"
                onClick={() => handleSeasonChange(season)}
              >
                {season}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Usage Filter */}
      {filterOptions.usages.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Mục đích sử dụng</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.usages.map((usage) => (
              <Button
                key={usage}
                variant={selectedUsage === usage ? "default" : "outline"}
                size="sm"
                className="h-8 transition-colors"
                onClick={() => handleUsageChange(usage)}
              >
                {usage}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Reset Button */}
      <Button variant="outline" className="w-full" onClick={handleResetFilters}>
        Đặt lại tất cả bộ lọc
      </Button>
    </div>
  );
};
