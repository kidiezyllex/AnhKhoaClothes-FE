import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { useBrands, useCategories, useColors, useSizes } from "@/hooks/product";
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

  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(
    filters.brands
      ? Array.isArray(filters.brands)
        ? filters.brands[0]
        : filters.brands
      : undefined
  );

  useEffect(() => {
    if (filters.brands) {
      setSelectedBrand(
        Array.isArray(filters.brands) ? filters.brands[0] : filters.brands
      );
    } else {
      setSelectedBrand(undefined);
    }
  }, [filters.brands]);

  const handleBrandChange = (brandId: string) => {
    if (selectedBrand === brandId) {
      setSelectedBrand(undefined);
      onChange({ brands: undefined });
    } else {
      setSelectedBrand(brandId);
      onChange({ brands: brandId });
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    filters.categories
      ? Array.isArray(filters.categories)
        ? filters.categories[0]
        : filters.categories
      : undefined
  );

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
    const rawSizes = sizesData?.data?.sizes || [];
    return [...rawSizes].sort((a, b) => {
      const valA = parseFloat(a.name || "0");
      const valB = parseFloat(b.name || "0");
      return valA - valB;
    });
  }, [sizesData]);

  const priceRange = useMemo(() => {
    return { min: 0, max: 10000000 };
  }, []);

  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([filters.minPrice || priceRange.min, filters.maxPrice || priceRange.max]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePriceChange = (values: number[]) => {
    setSelectedPriceRange(values as [number, number]);

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Áp dụng thay đổi giá vào bộ lọc sau một khoảng thời gian ngắn (debouncing)
    timerRef.current = setTimeout(() => {
      onChange({
        minPrice: values[0],
        maxPrice: values[1],
      });
    }, 500);
  };

  const handleResetFilters = () => {
    setSelectedPriceRange([priceRange.min, priceRange.max]);
    setSelectedCategory(undefined);
    onChange({
      categories: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      color: undefined,
      size: undefined,
    });
    toast.info("Đã đặt lại bộ lọc");
  };

  if (
    isLoadingBrands ||
    isLoadingCategories ||
    isLoadingColors ||
    isLoadingSizes
  ) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Giá</h3>
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

      <div>
        <h3 className="text-sm font-medium mb-3">Thương hiệu</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {brands.map((brand) => (
            <div key={(brand as any)?.id} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${(brand as any)?.id}`}
                checked={selectedBrand === (brand as any)?.id}
                onCheckedChange={() => handleBrandChange((brand as any)?.id)}
              />
              <label
                htmlFor={`brand-${(brand as any)?.id}`}
                className="text-sm"
              >
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Danh mục</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {categories.map((category) => (
            <div
              key={(category as any)?.id}
              className="flex items-center gap-2"
            >
              <Checkbox
                id={`category-${(category as any)?.id}`}
                checked={selectedCategory === (category as any)?.id}
                onCheckedChange={() =>
                  handleCategoryChange((category as any)?.id)
                }
              />
              <label
                htmlFor={`category-${(category as any)?.id}`}
                className="text-sm"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Màu sắc</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              className={`w-8 h-8 rounded-full border overflow-hidden relative transition-all duration-300 ${
                filters.color === color.id
                  ? "ring-2 ring-primary ring-offset-2"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.code }}
              title={color.name}
              onClick={() => handleColorChange(color.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Kích cỡ</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size.id}
              className={`px-2 py-1 border rounded text-sm transition-all duration-300 ${
                filters.size === size.id
                  ? "bg-primary text-white border-primary"
                  : "border-gray-300 hover:border-primary"
              }`}
              onClick={() => handleSizeChange(size.id)}
            >
              {size.name || size.id}
            </button>
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={handleResetFilters}>
        Đặt lại
      </Button>
    </div>
  );
};
