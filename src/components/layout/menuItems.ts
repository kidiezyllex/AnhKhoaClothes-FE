import { MenuItem } from "@/interface/types";
import {
  mdiAccount,
  mdiChartBar,
  mdiDesk,
  mdiHanger,
  mdiOrderBoolDescendingVariant,
  mdiTagMultiple,
} from "@mdi/js";

export const menuItems: MenuItem[] = [
  {
    id: "statistics",
    name: "Thống kê",
    path: "/admin/statistics",
    icon: mdiChartBar,
  },
  {
    id: "pos",
    name: "Bán hàng tại quầy",
    path: "/admin/pos",
    icon: mdiDesk,
  },
  {
    id: "orders",
    name: "Quản lý đơn hàng",
    path: "/admin/orders",
    icon: mdiOrderBoolDescendingVariant,
  },
  {
    id: "products",
    name: "Quản lý sản phẩm",
    path: "/admin/products",
    icon: mdiHanger,
    subMenu: [
      {
        id: "products-list",
        name: "Sản phẩm",
        path: "/admin/products",
      },
      {
        id: "products-categories",
        name: "Danh mục",
        path: "/admin/products/categories",
      },
      {
        id: "products-colors",
        name: "Màu sắc",
        path: "/admin/products/colors",
      },
      {
        id: "products-sizes",
        name: "Kích thước",
        path: "/admin/products/sizes",
      },
    ],
  },
  {
    id: "discounts",
    name: "Giảm giá",
    path: "/admin/discounts",
    icon: mdiTagMultiple,
    subMenu: [
      {
        id: "discounts-vouchers",
        name: "Mã giảm giá",
        path: "/admin/discounts/vouchers",
      },
      {
        id: "discounts-promotions",
        name: "Đợt khuyến mãi",
        path: "/admin/discounts/promotions",
      },
    ],
  },
  {
    id: "accounts",
    name: "Quản lý tài khoản",
    path: "/admin/accounts",
    icon: mdiAccount,
  },
];
