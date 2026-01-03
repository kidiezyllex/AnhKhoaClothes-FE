import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkImageUrl = (imageUrl: any): string => {
  const placeholder = "/images/white-image.png";
  
  if (!imageUrl) {
    return placeholder;
  }

  if (typeof imageUrl === 'string') {
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    if (imageUrl.startsWith("/")) {
      return imageUrl;
    }
    return placeholder;
  }

  if (typeof imageUrl === 'object' && imageUrl.imageUrl && typeof imageUrl.imageUrl === 'string') {
    if (imageUrl.imageUrl.startsWith("http://") || imageUrl.imageUrl.startsWith("https://")) {
      return imageUrl.imageUrl;
    }
    if (imageUrl.imageUrl.startsWith("/")) {
      return imageUrl.imageUrl;
    }
  }
  
  return placeholder;
}

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) return '';
  
  //                                                                                                                     Định dạng ngày theo tiếng Việt: DD/MM/YYYY
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};