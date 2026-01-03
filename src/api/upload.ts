// Import hàm sendPost từ file axios, dùng để gửi request HTTP POST
import { sendPost } from "./axios";

// Định nghĩa interface cho phản hồi khi upload ảnh thành công
export interface IUploadResponse {
  success: boolean;        // Trạng thái thành công hay không
  data: {
    url: string;           // Đường dẫn truy cập ảnh đã upload
    publicId: string;      // ID công khai để quản lý ảnh (ví dụ dùng xóa, cập nhật,...)
  };
}

/**
 * Hàm uploadImage: Dùng để tải hình ảnh lên server
 * @param file - Dữ liệu hình ảnh (FormData, thường gồm file hình và các metadata nếu có)
 * @returns Promise<IUploadResponse> - Trả về đối tượng chứa thông tin ảnh đã upload
 */
export const uploadImage = async (file: FormData): Promise<IUploadResponse> => {
  const res = await sendPost("/upload/image", file);  // Gửi POST request đến /upload/image với dữ liệu file
  return res as IUploadResponse;                      // Ép kiểu kết quả trả về về IUploadResponse
};
