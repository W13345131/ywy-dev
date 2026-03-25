// 在前端创建一个统一的 Axios 请求实例，用于和你的 Node.js 后端 API 通信
// axios 是一个 HTTP 请求库，用于：前端 → 请求后端 API
import axios from 'axios'
import { BASE_URL } from './apiPaths'

// 创建一个 Axios 实例，用于和后端 API 通信
const axiosInstance = axios.create({
    // 设置基础 URL,所有请求自动加上这个前缀
    baseURL: BASE_URL,
    // 设置请求超时时间(60秒)
    timeout: 60000,
    // 设置请求头
    headers: {
        // 告诉服务器发送的是 JSON
        'Content-Type': 'application/json',
        // 告诉服务器接受 JSON 响应
        Accept: 'application/json'
    }
});

// 请求拦截器，在请求发送之前进行拦截
axiosInstance.interceptors.request.use( 

    (config) => {
        // 从浏览器本地存储读取 token
        const accessToken = localStorage.getItem('token');
        // 如果 token 存在，则添加到请求头
        if (accessToken) {
            // 添加 Authorization 请求头，值为 Bearer + token
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        // 发送 FormData 时移除 Content-Type，让浏览器自动设置 multipart/form-data
        // FormData 是浏览器内置的类，用于构建表单数据
        // instanceof 运算符用于检查 config.data 是否是 FormData 的实例
        // 如果 config.data 是 FormData 的实例，则删除 Content-Type 请求头
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        // 返回配置，继续发送请求
        return config;
    },
    (error) => {
        // 返回错误，停止请求
        return Promise.reject(error);
    }
);

// 响应拦截器，在服务器返回响应之前进行拦截
axiosInstance.interceptors.response.use(
    // 直接把服务器返回的数据传给调用者
    (response) => {
        return response;
    },
    // 如果服务器返回错误，则返回错误
    (error) => {
        if (error.response){
            // 如果服务器返回 500 错误，则打印错误信息
            if (error.response.status === 500) {
                console.error("Server error, please try again later")
            }
        } else if (error.code === 'ECONNABORTED') {
            // 如果请求超时，则打印错误信息
            console.error("Request timed out, please try again later")
        }
        // 返回错误，停止请求
        return Promise.reject(error);
    }
);

export default axiosInstance;