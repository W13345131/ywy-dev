import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';


// 在 React 中创建一个 Context（上下文）对象，通常用于 全局共享数据
const AuthContext = createContext();


// 方便组件获取 AuthContext 里的认证信息（用户、token、登录状态等）
// React 规定：自定义 Hook 的名字必须以 use 开头
export const useAuth = () => {
    // 从 AuthContext 中获取共享的数据
    const context = useContext(AuthContext);
    // 如果 useAuth() 在 没有被 AuthProvider 包裹的组件中使用
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


// 管理用户登录状态、token、本地存储、以及给整个应用提供认证信息
// children 指的是：AuthProvider 包裹的所有组件
export const AuthProvider = ({ children }) => {
    // 保存当前登录用户的信息
    const [user, setUser] = useState(null);
    // 保存当前是否已登录
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // 保存当前是否正在加载认证状态
    const [loading, setLoading] = useState(true);

    // 检查用户是否已登录
    useEffect(() => {
        checkAuthStatus();
    }, []);


    // 检查 localStorage 是否有 token 和 user
    const checkAuthStatus = async () => {
        try {
            // 获取本地存储数据
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            // 如果 token 和 user 都存在，则设置用户信息和登录状态
            if (token && storedUser) {
                // 把字符串（string）格式的 JSON 数据转换成 JavaScript 对象
                const parsedUser = JSON.parse(storedUser);
                // 设置用户信息
                setUser(parsedUser);
                // 设置已登录状态
                setIsAuthenticated(true);
                // 拉取最新 profile（含 profileImageUrl），同步到全局状态
                try {
                    // 调用 authService 的 getProfile 方法，获取用户信息
                    const res = await authService.getProfile();
                    // 把获取到的数据设置到 profile 中
                    const profile = res?.data ?? res;
                    // 如果 profile 中有 profileImageUrl 或 username，则合并到 parsedUser 中，并更新到本地存储
                    if (profile?.profileImageUrl !== undefined || profile?.username) {
                        // 合并 parsedUser 和 profile
                        const merged = { ...parsedUser, ...profile };
                        // 设置用户信息
                        setUser(merged);
                        // 更新本地存储
                        localStorage.setItem('user', JSON.stringify(merged));
                    }
                } catch (e) {
                    // 拉取失败不影响登录状态
                }
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            setLoading(false);
        }
    }

    // 登录
    const login = async (userData, token) => {
        // 保存 token 和 user 到本地存储
        localStorage.setItem('token', token);
        // 保存 user 到本地存储
        // 把 JavaScript 对象转换成字符串（string）格式的 JSON 数据
        localStorage.setItem('user', JSON.stringify(userData));
        // 设置用户信息和登录状态
        setUser(userData);
        // 设置已登录状态
        setIsAuthenticated(true);
    }

    const logout = () => {
        // 删除 token 和 user 从本地存储
        localStorage.removeItem('token');
        // 删除 user 从本地存储
        localStorage.removeItem('user');
        // 设置用户信息为空
        setUser(null);
        // 设置已登录状态为 false
        setIsAuthenticated(false);
        // 跳转至首页
        window.location.href = '/';
    }

    // 更新用户信息（使用函数式更新避免闭包中的 user 过期）
    const updateUser = (updatedData) => {
        setUser(prev => {
            // 如果 prev 存在，则合并 prev 和 updatedData
            // 否则返回 updatedData
            const newUserData = prev ? { ...prev, ...updatedData } : updatedData;
            // 更新本地存储
            localStorage.setItem('user', JSON.stringify(newUserData));
            return newUserData;
        });
    }

    // 上下文值
    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
        checkAuthStatus,
    };

    // 返回 AuthContext.Provider 组件，用于包裹需要共享数据的组件
    return (
        <AuthContext.Provider value={value}>
            {/* children 指的是：AuthProvider 包裹的所有组件 */}
            {children}
        </AuthContext.Provider>
    )
};