// ===== Import các thư viện cần thiết ===== //
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"; // axios và các kiểu liên quan
import cookies from "js-cookie"; // Thư viện thao tác cookie trên trình duyệt

// ===== Interface mở rộng để thêm tuỳ chọn notify vào request config ===== //
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  shouldNotify?: boolean; // Có hiển thị thông báo lỗi hay không (tùy ý)
}

// ===== Hàm lấy access token từ cookie ===== //
function getLocalAccessToken() {
  const accessToken = cookies.get("accessToken"); // Lấy token từ cookie có tên 'accessToken'
  return accessToken;
}

// ===== Khởi tạo instance axios mặc định ===== //
const instance = axios.create({
  timeout: 3 * 60 * 1000, // Timeout 3 phút
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"}`, // Base URL từ biến môi trường hoặc fallback localhost
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ===== Interceptor để tự động gắn Authorization header nếu có token ===== //
instance.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Gắn token vào header Authorization
    }
    return config; // Trả về config đã chỉnh sửa
  },
  (error) => {
    return Promise.reject(error); // Trả về lỗi nếu có
  }
);

// ===== Hàm đăng xuất: xóa token và chuyển hướng về trang đăng nhập ===== //
export function logout() {
  cookies.remove("accessToken"); // Xóa token khỏi cookie
  localStorage?.clear(); // Xóa toàn bộ localStorage

  if (location.pathname !== "/auth/login") {
    window.location.replace("/auth/login"); // Chuyển hướng về trang login nếu chưa ở đó
  }
}

// ===== Các hàm gửi HTTP đơn giản dùng chung cho toàn ứng dụng ===== //

// Gửi GET request
export const sendGet = async (url: string, params?: any): Promise<any> => {
  const response = await instance.get(url, { params }); // Gửi GET với query params
  return response?.data; // Trả về phần data
};

// Gửi POST request (có hỗ trợ FormData và query string)
export const sendPost = (url: string, params?: any, queryParams?: any) => {
  const config: AxiosRequestConfig = { params: queryParams }; // Gắn query params nếu có

  if (params instanceof FormData) {
    config.headers = {
      "Content-Type": "multipart/form-data", // Nếu là FormData thì đổi content-type
    };
  }

  return instance.post(url, params, config).then((res) => res?.data);
};

// Gửi PUT request
export const sendPut = (url: string, params?: any) =>
  instance.put(url, params).then((res) => res?.data);

// Gửi PATCH request
export const sendPatch = (url: string, params?: any) =>
  instance.patch(url, params).then((res) => res?.data);

// Gửi DELETE request (dữ liệu được truyền qua body)
export const sendDelete = (url: string, params?: any) =>
  instance.delete(url, { data: params }).then((res) => res?.data);

// ======= Class ApiClient với cách gọi linh hoạt hơn ======= //
class ApiClient {
  // Gửi GET request với config đầy đủ
  get<T = any>(
    config: AxiosRequestConfig,
    options?: { shouldNotify: boolean }
  ): Promise<T> {
    return this.request({
      ...config,
      method: "GET",
      withCredentials: false, // Không gửi cookie (có thể thay đổi nếu backend yêu cầu)
      shouldNotify: options?.shouldNotify,
    });
  }

  // Gửi POST request
  post<T = any>(
    config: AxiosRequestConfig,
    options?: { shouldNotify: boolean }
  ): Promise<T> {
    return this.request({
      ...config,
      method: "POST",
      withCredentials: false,
      shouldNotify: options?.shouldNotify,
    });
  }

  // Gửi PUT request
  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "PUT", withCredentials: false });
  }

  // Gửi DELETE request
  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({
      ...config,
      method: "DELETE",
      withCredentials: false,
    });
  }

  // Gửi PATCH request
  patch<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "PATCH", withCredentials: false });
  }

  // ===== Hàm trung tâm gọi request bằng axios instance ===== //
  private request<T = any>(config: CustomAxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      instance
        .request<any, AxiosResponse<any>>(config) // Gửi request bằng axios với kiểu generic
        .then((res: AxiosResponse<any>) => {
          resolve(res as unknown as Promise<T>); // Trả về dữ liệu đã ép kiểu
        })
        .catch((e: Error | AxiosError) => {
          reject(e); // Trả về lỗi nếu có
        });
    });
  }
}

// ===== Xuất một instance duy nhất của ApiClient ===== //
// eslint-disable-next-line import/no-anonymous-default-export
export default new ApiClient();
