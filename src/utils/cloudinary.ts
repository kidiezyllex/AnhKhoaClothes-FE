/**
 * Phương thức tạo form data cho file upload
 */
export const createFormData = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");
  formData.append("cloud_name", "dv4iqmqrm");
  formData.append("folder", "clothes");
  return formData;
};

/**
 * Xác định loại resource dựa vào mime type
 */
export const getResourceType = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "raw";
};

/**
 * Tạo tên file duy nhất
 */
export const generateUniqueFileName = (originalName: string) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomString}-${originalName}`;
};

/**
 * Tạo đường dẫn thư mục lưu trữ
 */
export const generateUploadPath = (resourceType: string, fileName: string) => {
  return `clothes/${resourceType}s/${fileName}`;
};

/**
 * Định dạng kích thước file
 */
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}; 