import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const getDashboard = async () => {
    try {
        // 发送请求，获取Dashboard数据
        const response = await axiosInstance.get(API_PATHS.PROGRESS.GET_DASHBOARD);
        // 返回数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to get dashboard'};
    }
};

// 对象简写，用于导出 getDashboard 方法
const progressService = {
    getDashboard,
};

export default progressService;