/**
 * Định dạng giá tiền theo định dạng VND
 * @param price Số tiền cần định dạng
 * @returns Chuỗi đã định dạng theo VND
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Định dạng ngày tháng theo định dạng Việt Nam
 * @param dateString Chuỗi ngày cần định dạng
 * @returns Chuỗi ngày đã định dạng theo Việt Nam
 */
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
};

/**
 * Định dạng ngày tháng có giờ theo định dạng Việt Nam
 * @param dateString Chuỗi ngày giờ cần định dạng
 * @returns Chuỗi ngày giờ đã định dạng theo Việt Nam
 */
export const formatDateTime = (dateString: string): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(dateString));
};

/**
 * Chuyển đổi chuỗi thành slug URL
 * @param text Chuỗi cần chuyển đổi
 * @returns Chuỗi slug
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Định dạng số điện thoại Việt Nam
 * @param phone Số điện thoại cần định dạng 
 * @returns Chuỗi số điện thoại đã định dạng
 */
export const formatPhoneNumber = (phone: string): string => {
  // Loại bỏ tất cả ký tự không phải số
  const cleaned = phone.replace(/\D/g, '');
  
  // Kiểm tra độ dài và định dạng tùy theo loại số điện thoại
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  // Trả về nguyên bản nếu không phù hợp các mẫu trên
  return phone;
};

/**
 * Định dạng số lượng sản phẩm còn lại trong kho
 * @param stock Số lượng sản phẩm
 * @returns Chuỗi định dạng tình trạng kho
 */
export const formatStockStatus = (stock: number): { text: string; className: string } => {
  if (stock <= 0) {
    return { text: 'Hết hàng', className: 'text-red-500' };
  } else if (stock <= 5) {
    return { text: `Còn ${stock} sản phẩm`, className: 'text-orange-500' };
  } else if (stock <= 10) {
    return { text: `Sắp hết hàng (${stock})`, className: 'text-amber-500' };
  } else {
    return { text: 'Còn hàng', className: 'text-green-500' };
  }
};
/**
 * Định dạng giá trị giảm giá dựa trên loại (phần trăm hoặc số tiền cố định)
 * @param type Loại giảm giá (PERCENTAGE hoặc FIXED_AMOUNT)
 * @param value Giá trị giảm giá
 * @returns Chuỗi đã định dạng
 */
export const formatDiscountValue = (type: 'PERCENTAGE' | 'FIXED_AMOUNT', value: number): string => {
  if (type === 'PERCENTAGE') {
    return `-${value}%`;
  }
  return `-${formatPrice(value)}`;
};

/**
 * Alias cho formatPrice để tương thích ngược
 */
export const formatCurrency = formatPrice; 