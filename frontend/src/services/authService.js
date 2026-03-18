import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';


// 调用后端 API 登录
const login = async (email, password) => {
    try {
        // 调用 axiosInstance 的 post 方法，登录
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'An unexpected error occurred'};
    }
};


// 调用后端 API 注册
const register = async (username, email, password, adminInviteToken) => {
    try {
        // 调用 axiosInstance 的 post 方法，注册
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, { username, email, password, adminInviteToken });
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'An unexpected error occurred'};
    }
};


// 调用后端 API 获取用户信息
const getProfile = async () => {
    try {
        // 调用 axiosInstance 的 get 方法，获取用户信息
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'An unexpected error occurred'};
    }
};


// 调用后端 API 更新用户信息
const updateProfile = async (userData) => {
    try {
        // 调用 axiosInstance 的 put 方法，更新用户信息
        const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, userData);
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'An unexpected error occurred'};
    }
};


// 上传头像：先上传图片获取 URL，再更新用户 profile
const uploadAvatar = async (file) => {
    try {
        // 创建 FormData 对象，用于上传图片
        const formData = new FormData();
        // 将文件添加到 FormData 对象中
        formData.append('image', file);
        // 调用后端 API 上传图片
        const uploadResponse = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData);
        // 获取图片 URL
        const imageUrl = uploadResponse?.data?.data ?? uploadResponse?.data;
        // 更新用户 profile
        await updateProfile({ profileImageUrl: imageUrl });
        // 返回图片 URL
        return { profileImageUrl: imageUrl };
    } catch (error) {
        const errData = error.response?.data;
        throw {
            error: errData?.error || errData?.message || 'Failed to upload avatar',
            message: errData?.message || errData?.error,
        };
    }
};


// 调用后端 API 修改密码
const changePassword = async (passwords) => {
    try {
        // 调用 axiosInstance 的 put 方法，修改密码
        const response = await axiosInstance.put(API_PATHS.AUTH.CHANGE_PASSWORD, passwords);
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'An unexpected error occurred'};
    }
};

// 导出 authService
const authService = {
    login,
    register,
    getProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
};

export default authService;