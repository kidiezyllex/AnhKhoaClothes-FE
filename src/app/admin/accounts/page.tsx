"use client";

import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAccounts,
  useDeleteAccount,
  useUpdateAccountStatus,
} from "@/hooks/account";
import {
  IAccountFilter,
  IAccountStatusUpdate,
} from "@/interface/request/account";
import { IAccount } from "@/interface/response/account";
import {
  mdiCheck,
  mdiDelete,
  mdiDotsVertical,
  mdiFilterMultiple,
  mdiLoading,
  mdiLock,
  mdiLockReset,
  mdiMagnify,
  mdiPencil,
  mdiPhone,
  mdiPlus,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<IAccountFilter>({
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<IAccount | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [accountToUpdateStatus, setAccountToUpdateStatus] =
    useState<IAccount | null>(null);
  const [newStatus, setNewStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const { data, isLoading, error } = useAccounts(filters);
  const deleteAccount = useDeleteAccount();
  const updateAccountStatus = useUpdateAccountStatus(
    accountToUpdateStatus?.id || ""
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery.trim()) {
        setFilters((prev) => ({ ...prev, search: searchQuery, page: 1 }));
      } else {
        const { search, ...rest } = filters;
        setFilters({ ...rest, page: 1 });
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleFilterChange = (
    key: keyof IAccountFilter,
    value: string | number | undefined
  ) => {
    if (value === "") {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters({ ...newFilters, page: 1 });
    } else {
      setFilters({ ...filters, [key]: value, page: 1 });
    }
  };

  const handleChangePage = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa xác định";
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  };

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge variant="ADMIN">Quản trị viên</Badge>;
      case "STAFF":
        return <Badge variant="STAFF">Nhân viên</Badge>;
      case "CUSTOMER":
        return <Badge variant="CUSTOMER">Khách hàng</Badge>;
      default:
        return <Badge variant="default">{role}</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="ACTIVE">Hoạt động</Badge>;
      case "INACTIVE":
        return <Badge variant="INACTIVE">Không hoạt động</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleDeleteAccount = (account: IAccount) => {
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = async () => {
    if (!accountToDelete) return;

    try {
      await deleteAccount.mutateAsync(accountToDelete.id, {
        onSuccess: () => {
          toast.success("Xóa tài khoản thành công");
          setIsDeleteDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: (error) => {
          toast.error(
            "Xóa tài khoản thất bại: " + (error.message || "Không xác định")
          );
        },
      });
    } catch (error) {
      toast.error("Xóa tài khoản thất bại");
    }
  };

  const handleUpdateStatus = (
    account: IAccount,
    status: "ACTIVE" | "INACTIVE"
  ) => {
    setAccountToUpdateStatus(account);
    setNewStatus(status);
    setIsStatusDialogOpen(true);
  };

  const confirmUpdateStatus = async () => {
    if (!accountToUpdateStatus) return;

    const statusUpdate: IAccountStatusUpdate = {
      status: newStatus,
    };

    try {
      await updateAccountStatus.mutateAsync(statusUpdate, {
        onSuccess: () => {
          toast.success(`Cập nhật trạng thái tài khoản thành công`);
          setIsStatusDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: (error) => {
          toast.error(
            "Cập nhật trạng thái tài khoản thất bại: " +
              (error.message || "Không xác định")
          );
        },
      });
    } catch (error) {
      toast.error("Cập nhật trạng thái tài khoản thất bại");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Quản lý người dùng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Danh sách tài khoản</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <a href="/admin/accounts/create" className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <Icon path={mdiPlus} size={0.8} />
            Thêm tài khoản mới
          </Button>
        </a>
      </div>

      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center gap-2">
            <div className="relative flex-1 max-w-4xl">
              <Icon
                path={mdiMagnify}
                size={0.8}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700"
              />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                className="pl-10 pr-4 py-2 w-full border rounded-[6px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon path={mdiFilterMultiple} size={0.8} className="mr-2" />
              {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Vai trò
                    </label>
                    <Select
                      value={filters.role || ""}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "role",
                          value === "all" ? undefined : value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả vai trò</SelectItem>
                        <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                        <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-semibold">
                      Trạng thái
                    </label>
                    <Select
                      value={filters.status || ""}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "status",
                          value === "all" ? undefined : value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                        <SelectItem value="INACTIVE">
                          Không hoạt động
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Icon
                path={mdiLoading}
                size={2}
                className="animate-spin text-primary"
              />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <h2 className="text-xl font-bold text-red-500">Đã xảy ra lỗi</h2>
              <p className="text-gray-700">
                {error.message || "Không thể tải dữ liệu tài khoản"}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tài khoản</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.accounts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-700"
                      >
                        Không có tài khoản nào được tìm thấy
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.data.accounts.map((account) => (
                      <TableRow key={account.id} className="hover:bg-gray-50">
                        <TableCell className="py-3 px-4">
                          <div className="flex items-center space-x-4">
                            <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                              <Avatar className="h-10 w-10 border-2 border-white rounded-full">
                                <AvatarImage
                                  src={
                                    account.avatar ||
                                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                                      account.name || account.fullName
                                    }`
                                  }
                                  alt={`${
                                    account.name || account.fullName
                                  } avatar`}
                                />
                                <AvatarFallback>
                                  {(account.name || account.fullName)?.charAt(
                                    0
                                  ) || "?"}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div>
                              <div className="font-medium text-gray-700">
                                {account.name || account.fullName}
                              </div>
                              <div className="text-sm text-gray-700">
                                {account.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm text-gray-700">
                          {account.phoneNumber && (
                            <div className="flex items-center">
                              <Icon
                                path={mdiPhone}
                                size={0.8}
                                className="mr-2 text-gray-700"
                              />
                              {account.phoneNumber}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {getRoleBadge(account.role)}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {getStatusBadge(
                            account.is_active
                              ? "ACTIVE"
                              : account.status || "INACTIVE"
                          )}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-sm text-gray-700">
                          {formatDate(account.created_at || account.createdAt)}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="outline">
                                <Icon path={mdiDotsVertical} size={0.8} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <a href={`/admin/accounts/edit/${account.id}`}>
                                <DropdownMenuItem className="cursor-pointer text-gray-700">
                                  <Icon
                                    path={mdiPencil}
                                    size={0.8}
                                    className="mr-2"
                                  />
                                  <span className="text-gray-700">
                                    Chỉnh sửa
                                  </span>
                                </DropdownMenuItem>
                              </a>
                              <DropdownMenuSeparator />
                              {account.status === "ACTIVE" ? (
                                <DropdownMenuItem
                                  className="cursor-pointer text-gray-700"
                                  onClick={() =>
                                    handleUpdateStatus(account, "INACTIVE")
                                  }
                                >
                                  <Icon
                                    path={mdiLock}
                                    size={0.8}
                                    className="mr-2"
                                  />
                                  <span className="text-gray-700">
                                    Vô hiệu hóa
                                  </span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="cursor-pointer text-gray-700"
                                  onClick={() =>
                                    handleUpdateStatus(account, "ACTIVE")
                                  }
                                >
                                  <Icon
                                    path={mdiLockReset}
                                    size={0.8}
                                    className="mr-2"
                                  />
                                  <span className="text-gray-700">
                                    Kích hoạt
                                  </span>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600"
                                onClick={() => handleDeleteAccount(account)}
                              >
                                <Icon
                                  path={mdiDelete}
                                  size={0.8}
                                  className="mr-2"
                                />
                                <span className="text-red-600">
                                  Xóa tài khoản
                                </span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {data?.data.pagination && data.data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-gray-700">
                    Hiển thị{" "}
                    {(data.data.pagination.currentPage - 1) *
                      (filters.limit || 10) +
                      1}{" "}
                    đến{" "}
                    {Math.min(
                      data.data.pagination.currentPage * (filters.limit || 10),
                      data.data.pagination.count
                    )}{" "}
                    trong tổng số {data.data.pagination.count} tài khoản
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleChangePage(data.data.pagination.currentPage - 1)
                      }
                      disabled={data.data.pagination.currentPage === 1}
                    >
                      Trước
                    </Button>
                    {Array.from(
                      { length: data.data.pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <Button
                        key={page}
                        variant={
                          page === data.data.pagination.currentPage
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleChangePage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleChangePage(data.data.pagination.currentPage + 1)
                      }
                      disabled={
                        data.data.pagination.currentPage ===
                        data.data.pagination.totalPages
                      }
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Account Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa tài khoản</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tài khoản{" "}
              <span className="font-semibold">
                {accountToDelete?.name || accountToDelete?.fullName}
              </span>
              ?
              <br />
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteAccount}
              disabled={deleteAccount.isPending}
              className="flex items-center gap-2"
            >
              {deleteAccount.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.8} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Icon path={mdiDelete} size={0.8} />
                  Xác nhận xóa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === "ACTIVE"
                ? "Kích hoạt tài khoản"
                : "Vô hiệu hóa tài khoản"}
            </DialogTitle>
            <DialogDescription>
              {newStatus === "ACTIVE" ? (
                <>
                  Bạn có chắc chắn muốn kích hoạt tài khoản{" "}
                  <span className="font-semibold">
                    {accountToUpdateStatus?.fullName}
                  </span>
                  ?
                  <br />
                  Tài khoản này sẽ có thể đăng nhập và sử dụng hệ thống.
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn vô hiệu hóa tài khoản{" "}
                  <span className="font-semibold">
                    {accountToUpdateStatus?.fullName}
                  </span>
                  ?
                  <br />
                  Tài khoản này sẽ không thể đăng nhập và sử dụng hệ thống cho
                  đến khi được kích hoạt lại.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant={newStatus === "ACTIVE" ? "default" : "destructive"}
              onClick={confirmUpdateStatus}
              disabled={updateAccountStatus.isPending}
              className="flex items-center gap-2"
            >
              {updateAccountStatus.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.8} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : newStatus === "ACTIVE" ? (
                <>
                  <Icon path={mdiCheck} size={0.8} />
                  Kích hoạt
                </>
              ) : (
                <>
                  <Icon path={mdiLock} size={0.8} />
                  Vô hiệu hóa
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
