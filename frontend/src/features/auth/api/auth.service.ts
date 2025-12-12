import api from "@/lib/api";
import { ChangePasswordRequest } from "@/features/auth/types";
import { UpdateProfileRequest, User } from "@/features/users/types";

export const authService = {
  /**
   * Đổi mật khẩu.
   */
  changePassword: async (data: ChangePasswordRequest): Promise<string> => {
    const response = await api.post("/auth/change-password", data);
    return response.data;
  },

  /**
   * Cập nhật hồ sơ cá nhân (thông tin + avatar).
   */
  updateProfile: async (
    data: UpdateProfileRequest,
    avatar?: File,
  ): Promise<User> => {
    const formData = new FormData();
    // Check for undefined/null but allow empty strings
    if (data.fullName !== undefined) formData.append("fullName", data.fullName);
    if (data.email !== undefined) formData.append("email", data.email);
    if (data.phoneNumber !== undefined)
      formData.append("phoneNumber", data.phoneNumber);
    if (data.sex !== undefined) formData.append("sex", data.sex.toString());
    if (data.bornDate !== undefined) formData.append("bornDate", data.bornDate);
    if (data.course !== undefined)
      formData.append("course", data.course.toString());
    if (data.className !== undefined)
      formData.append("className", data.className);
    if (data.academicDegree !== undefined)
      formData.append("academicDegree", data.academicDegree);

    if (data.deleteAvatar) {
      formData.append("deleteAvatar", "true");
    }

    if (avatar) {
      formData.append("avatar", avatar);
    }

    const response = await api.post("/auth/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Upload ảnh đại diện riêng biệt.
   */
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/auth/update-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Lấy thông tin người dùng hiện tại (profile).
   */
  getProfile: async (): Promise<any> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  getCurrentUser: async (): Promise<any> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * Đăng xuất (Xóa token khỏi localStorage).
   */
  logout: () => {
    localStorage.removeItem("token");
  },

  /**
   * Quên mật khẩu.
   */
  forgotPassword: async (username: string): Promise<string> => {
    const response = await api.post("/auth/forgot-password", { username });
    return response.data;
  },
};
