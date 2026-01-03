export interface SubMenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon: string;
  subMenu?: SubMenuItem[];
}

export type OrderStatus = 
  | 'CHO_XAC_NHAN' 
  | 'CHO_GIAO_HANG' 
  | 'DANG_VAN_CHUYEN' 
  | 'DA_GIAO_HANG' 
  | 'HOAN_THANH' 
  | 'DA_HUY';

export type PaymentStatus = 
  | 'PENDING' 
  | 'PAID' 
  | 'REFUNDED' 
  | 'CANCELED';

export type PaymentMethod = 
  | 'CASH' 
  | 'BANK_TRANSFER' 
  | 'COD' 
  | 'MIXED';

export type EntityStatus = 
  | 'ACTIVE' 
  | 'INACTIVE';

export type ReturnStatus = 
  | 'CHO_XU_LY' 
  | 'DA_HOAN_TIEN' 
  | 'DA_HUY'; 