export interface IVoucherFilter {
  code?: string;                                 // Filter by voucher code
  name?: string;                                 // Filter by voucher name
  status?: 'ACTIVE' | 'INACTIVE';     // Filter by voucher status
  startDate?: string;                            // Filter by start date
  endDate?: string;                              // Filter by end date
  page?: number;                                 // Page number for pagination
  limit?: number;                                // Number of items per page
}

export interface IVoucherCreate {
  code: string;                                  // Unique voucher code (uppercase letters, numbers, and dashes)
  name: string;                                  // Display name for the voucher
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';   // Type of voucher (percentage or fixed amount)
  discountValue: number;                         // Value of the voucher (percentage or fixed amount)
  quantity: number;                              // Total number of vouchers available
  startDate: string | Date;                      // Start date (when voucher becomes valid)
  endDate: string | Date;                        // End date (when voucher expires)
  minOrderValue?: number;                        // Minimum order value required to apply voucher
  maxDiscount?: number;                          // Maximum discount amount (for percentage vouchers)
  status?: 'ACTIVE' | 'INACTIVE';     // Voucher status (active or inactive)
}

export interface IVoucherUpdate {
  name?: string;                                 // Display name for the voucher
  quantity?: number;                             // Total number of vouchers available
  startDate?: string | Date;                     // Start date (when voucher becomes valid)
  endDate?: string | Date;                       // End date (when voucher expires)
  minOrderValue?: number;                        // Minimum order value required to apply voucher
  maxDiscount?: number;                          // Maximum discount amount (for percentage vouchers)
  status?: 'ACTIVE' | 'INACTIVE';     // Voucher status (active or inactive)
}

export interface IVoucherValidate {
  code: string;                                  // Voucher code to validate
  orderValue?: number;                           // Order value to calculate discount amount
}

export interface IUserVoucherParams {
  page?: number;    // Page number for pagination
  limit?: number;   // Number of items per page
} 