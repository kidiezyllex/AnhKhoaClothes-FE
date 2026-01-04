export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
};

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
export const formatDiscountValue = (type: 'PERCENTAGE' | 'FIXED_AMOUNT', value: number): string => {
  if (type === 'PERCENTAGE') {
    return `-${value}%`;
  }
  return `-${formatPrice(value)}`;
};

export const formatCurrency = formatPrice; 