// ====== Import các interface cho Request ====== //
import {
  INotificationFilter,          // Bộ lọc thông báo
  INotificationCreate,          // Dữ liệu tạo mới thông báo
  INotificationUpdate,          // Dữ liệu cập nhật thông báo
  INotificationStatusUpdate,    // Dữ liệu cập nhật trạng thái thông báo (nếu dùng)
  ISendToAllCustomers           // Dữ liệu gửi thông báo đến tất cả khách hàng
} from "@/interface/request/notification";

// ====== Import các interface cho Response ====== //
import {
  INotificationsResponse,      // Response danh sách thông báo
  INotificationResponse,       // Response một thông báo
  IActionResponse              // Response cho hành động như xóa, gửi...
} from "@/interface/response/notification";

// ====== Import các hàm gửi request HTTP ====== //
import { sendGet, sendPost, sendPut, sendDelete } from "./axios";

// === Admin Notification API ===

// Lấy tất cả thông báo với bộ lọc (dành cho admin)
export const getAllNotifications = async (params: INotificationFilter): Promise<INotificationsResponse> => {
  const res = await sendGet("/notifications", { params }); // Gửi GET với params lọc
  return res as INotificationsResponse;
};

// Lấy chi tiết một thông báo theo ID
export const getNotificationById = async (notificationId: string): Promise<INotificationResponse> => {
  const res = await sendGet(`/notifications/${notificationId}`); // Gửi GET tới ID thông báo
  return res as INotificationResponse;
};

// Tạo mới một thông báo
export const createNotification = async (payload: INotificationCreate): Promise<INotificationResponse> => {
  const res = await sendPost("/notifications", payload); // Gửi POST để tạo thông báo mới
  return res as INotificationResponse;
};

// Cập nhật nội dung/thông tin của một thông báo theo ID
export const updateNotification = async (
  notificationId: string,
  payload: INotificationUpdate
): Promise<INotificationResponse> => {
  const res = await sendPut(`/notifications/${notificationId}`, payload); // Gửi PUT để cập nhật
  return res as INotificationResponse;
};

// Xóa một thông báo theo ID
export const deleteNotification = async (notificationId: string): Promise<IActionResponse> => {
  const res = await sendDelete(`/notifications/${notificationId}`); // Gửi DELETE để xóa
  return res as IActionResponse;
};

// Gửi một thông báo cụ thể đến các người nhận
export const sendNotification = async (notificationId: string): Promise<INotificationResponse> => {
  const res = await sendPost(`/notifications/${notificationId}/send`); // Gửi POST để gửi thông báo
  return res as INotificationResponse;
};

// Gửi một thông báo đến toàn bộ khách hàng
export const sendNotificationToAllCustomers = async (
  payload: ISendToAllCustomers
): Promise<INotificationResponse> => {
  const res = await sendPost("/notifications/send-all", payload); // Gửi POST để gửi đến tất cả khách hàng
  return res as INotificationResponse;
};

// === User Notification API ===

// Người dùng (customer) lấy danh sách thông báo cá nhân
export const getUserNotifications = async (
  params: INotificationFilter = {}
): Promise<INotificationsResponse> => {
  const res = await sendGet("/notifications/user", { params }); // Gửi GET đến endpoint thông báo của người dùng
  return res as INotificationsResponse;
};
