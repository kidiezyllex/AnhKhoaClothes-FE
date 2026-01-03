import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProductData {
  id: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  colors: string[];
  sizes: string[];
  image: string;
}

export interface FilterState {
  brands: string[];
  categories: string[];
  sizes: string[];
  colors: string[];
  products: ProductData[];
  selectedBrands: string[];
  selectedCategories: string[];
  selectedColors: string[];
  selectedSizes: string[];
  priceRange: [number, number];
  sortOption: string;
  filteredProducts: ProductData[];
  addBrandFilter: (brand: string) => void;
  removeBrandFilter: (brand: string) => void;
  addCategoryFilter: (category: string) => void;
  removeCategoryFilter: (category: string) => void;
  addColorFilter: (color: string) => void;
  removeColorFilter: (color: string) => void;
  addSizeFilter: (size: string) => void;
  removeSizeFilter: (size: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortOption: (option: string) => void;
  resetFilters: () => void;
  addCategoryFilterFromUrl: (category: string) => void;
  addColorFilterFromUrl: (color: string) => void;
  addSizeFilterFromUrl: (size: string) => void;
  loadData: () => void;
}

const brands = [
  "Prada",
  "Uniqlo",
  "Balenciaga",
  "New Balance",
  "Chanel",
  "Louis Vuitton",
  "Reebok",
  "Under Armour",
];

const categories = [
  "Running",
  "Basketball",
  "Tennis",
  "Training",
  "Lifestyle",
  "Soccer",
  "Skateboarding",
  "Walking",
];

const sizes = [
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
];

const colors = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
  "Gray",
  "Brown",
];

const products = [
  {
    id: "1",
    name: "Prada Air Max",
    price: 129.99,
    brand: "Prada",
    category: "Running",
    colors: ["Black", "White", "Red"],
    sizes: ["38", "39", "40", "41", "42"],
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-300x300.jpg",
  },
  {
    id: "2",
    name: "Uniqlo Ultraboost",
    price: 179.99,
    brand: "Uniqlo",
    category: "Running",
    colors: ["Blue", "White", "Black"],
    sizes: ["39", "40", "41", "42", "43"],
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-1-300x300.jpg",
  },
  {
    id: "3",
    name: "Balenciaga RS-X",
    price: 109.99,
    brand: "Balenciaga",
    category: "Lifestyle",
    colors: ["Yellow", "Black", "White"],
    sizes: ["37", "38", "39", "40", "41"],
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-2-300x300.jpg",
  },
  {
    id: "4",
    name: "New Balance 990",
    price: 174.99,
    brand: "New Balance",
    category: "Running",
    colors: ["Gray", "Navy"],
    sizes: ["40", "41", "42", "43", "44"],
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-4-300x300.jpg",
  },
  {
    id: "5",
    name: "Chanel Chuck 70",
    price: 84.99,
    brand: "Chanel",
    category: "Lifestyle",
    colors: ["Black", "White", "Red"],
    sizes: ["36", "37", "38", "39", "40"],
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-5-300x300.jpg",
  },
  {
    id: "6",
    name: "Louis Vuitton Old Skool",
    price: 64.99,
    brand: "Louis Vuitton",
    category: "Skateboarding",
    colors: ["Black", "White"],
    sizes: ["38", "39", "40", "41", "42"],
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-7-300x300.jpg",
  },
  {
    id: "7",
    name: "Reebok Classic",
    price: 74.99,
    brand: "Reebok",
    category: "Lifestyle",
    colors: ["White", "Gray", "Red"],
    sizes: ["37", "38", "39", "40", "41"],
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-6-300x300.jpg",
  },
  {
    id: "8",
    name: "Under Armour HOVR",
    price: 119.99,
    brand: "Under Armour",
    category: "Running",
    colors: ["Black", "Red", "Gray"],
    sizes: ["41", "42", "43", "44", "45"],
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-3-300x300.jpg",
  },
  {
    id: "9",
    name: "Prada Air Force 1",
    price: 99.99,
    brand: "Prada",
    category: "Lifestyle",
    colors: ["White", "Black"],
    sizes: ["38", "39", "40", "41", "42"],
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-300x300.jpg",
  },
  {
    id: "10",
    name: "Uniqlo NMD",
    price: 139.99,
    brand: "Uniqlo",
    category: "Lifestyle",
    colors: ["Black", "White", "Red"],
    sizes: ["39", "40", "41", "42", "43"],
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-1-300x300.jpg",
  },
  {
    id: "11",
    name: "Balenciaga Suede",
    price: 69.99,
    brand: "Balenciaga",
    category: "Lifestyle",
    colors: ["Blue", "Red", "Black"],
    sizes: ["37", "38", "39", "40", "41"],
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-2-300x300.jpg",
  },
  {
    id: "12",
    name: "New Balance 574",
    price: 79.99,
    brand: "New Balance",
    category: "Lifestyle",
    colors: ["Gray", "Navy", "Red"],
    sizes: ["40", "41", "42", "43", "44"],
    image: "https://templatekits.themewarrior.com/champz/wp-content/uploads/sites/45/2022/01/product-dummy-4-300x300.jpg",
  },
];

const useFilterStore = create<FilterState>((set, get) => ({
  brands,
  categories,
  sizes,
  colors,
  products,
  selectedBrands: [],
  selectedCategories: [],
  selectedColors: [],
  selectedSizes: [],
  priceRange: [0, 200],
  sortOption: "default",
  filteredProducts: products,

  addBrandFilter: (brand) => {
    set((state) => ({
      selectedBrands: [...state.selectedBrands, brand],
      filteredProducts: filterAndSortProducts({
        ...state,
        selectedBrands: [...state.selectedBrands, brand],
      }),
    }));
  },

  removeBrandFilter: (brand) => {
    set((state) => ({
      selectedBrands: state.selectedBrands.filter((b) => b !== brand),
      filteredProducts: filterAndSortProducts({
        ...state,
        selectedBrands: state.selectedBrands.filter((b) => b !== brand),
      }),
    }));
  },

  addCategoryFilter: (category) => {
    set((state) => ({
      selectedCategories: [...state.selectedCategories, category],
      filteredProducts: filterAndSortProducts({
        ...state,
        selectedCategories: [...state.selectedCategories, category],
      }),
    }));
  },

  removeCategoryFilter: (category) => {
    set((state) => ({
      selectedCategories: state.selectedCategories.filter((c) => c !== category),
      filteredProducts: filterAndSortProducts({
        ...state,
        selectedCategories: state.selectedCategories.filter((c) => c !== category),
      }),
    }));
  },

  addColorFilter: (color) => {
    set((state) => ({
      selectedColors: [...state.selectedColors, color],
      filteredProducts: filterAndSortProducts({
        ...state,
        selectedColors: [...state.selectedColors, color],
      }),
    }));
  },

  removeColorFilter: (color) => {
    set((state) => ({
      selectedColors: state.selectedColors.filter((c) => c !== color),
      filteredProducts: filterAndSortProducts({
        ...state,
        selectedColors: state.selectedColors.filter((c) => c !== color),
      }),
    }));
  },

  addSizeFilter: (size) => {
    set((state) => ({
      selectedSizes: [...state.selectedSizes, size],
      filteredProducts: filterAndSortProducts({
        ...state,
        selectedSizes: [...state.selectedSizes, size],
      }),
    }));
  },

  removeSizeFilter: (size) => {
    set((state) => ({
      selectedSizes: state.selectedSizes.filter((s) => s !== size),
      filteredProducts: filterAndSortProducts({
        ...state,
        selectedSizes: state.selectedSizes.filter((s) => s !== size),
      }),
    }));
  },

  setPriceRange: (range) => {
    set((state) => ({
      priceRange: range,
      filteredProducts: filterAndSortProducts({
        ...state,
        priceRange: range,
      }),
    }));
  },

  setSortOption: (option) => {
    set((state) => ({
      sortOption: option,
      filteredProducts: filterAndSortProducts({
        ...state,
        sortOption: option,
      }),
    }));
  },

  resetFilters: () => {
    set((state) => ({
      selectedBrands: [],
      selectedCategories: [],
      selectedColors: [],
      selectedSizes: [],
      priceRange: [0, 200],
      sortOption: "default",
      filteredProducts: state.products,
    }));
  },

  addCategoryFilterFromUrl: (category) => {
    if (category && !get().selectedCategories.includes(category)) {
      set((state) => ({
        selectedCategories: [...state.selectedCategories, category],
        filteredProducts: filterAndSortProducts({
          ...state,
          selectedCategories: [...state.selectedCategories, category],
        }),
      }));
    }
  },

  addColorFilterFromUrl: (color) => {
    if (color && !get().selectedColors.includes(color)) {
      set((state) => ({
        selectedColors: [...state.selectedColors, color],
        filteredProducts: filterAndSortProducts({
          ...state,
          selectedColors: [...state.selectedColors, color],
        }),
      }));
    }
  },

  addSizeFilterFromUrl: (size) => {
    if (size && !get().selectedSizes.includes(size)) {
      set((state) => ({
        selectedSizes: [...state.selectedSizes, size],
        filteredProducts: filterAndSortProducts({
          ...state,
          selectedSizes: [...state.selectedSizes, size],
        }),
      }));
    }
  },

  loadData: () => {
    set((state) => ({
      filteredProducts: filterAndSortProducts(state),
    }));
  },
}));

const filterAndSortProducts = (state: FilterState): ProductData[] => {
  let filtered = state.products;

  if (state.selectedBrands.length > 0) {
    filtered = filtered.filter((product) =>
      state.selectedBrands.includes(product.brand)
    );
  }

  if (state.selectedCategories.length > 0) {
    filtered = filtered.filter((product) =>
      state.selectedCategories.includes(product.category)
    );
  }

  if (state.selectedColors.length > 0) {
    filtered = filtered.filter((product) =>
      product.colors.some((color) => state.selectedColors.includes(color))
    );
  }

  if (state.selectedSizes.length > 0) {
    filtered = filtered.filter((product) =>
      product.sizes.some((size) => state.selectedSizes.includes(size))
    );
  }

  filtered = filtered.filter(
    (product) =>
      product.price >= state.priceRange[0] &&
      product.price <= state.priceRange[1]
  );

  switch (state.sortOption) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }

  return filtered;
};

export default useFilterStore; 