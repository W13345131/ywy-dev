import React, { useState } from 'react';
import { Search } from 'lucide-react';
import UserCard from '../../components/Media/UserCard';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Spinner from '../../components/common/Spinner';

const Discover = () => {

    // 搜索输入
    const [input, setInput] = useState('');
    // 用户列表
    const [users, setUsers] = useState([]);
    // 加载状态
    const [loading, setLoading] = useState(false);
    // 是否已搜索
    const [hasSearched, setHasSearched] = useState(false);
    // 连接状态
    const [connectionState, setConnectionState] = useState({
        connectedIds: [],
        pendingIncomingIds: [],
        pendingSentIds: [],
    });

    // 获取用户列表
    const fetchUsers = async (searchInput = '') => {
        try {
            // 新搜索开始前先清空旧结果
            setUsers([]);
            // 设置加载状态
            setLoading(true);

            // 同时发起两个异步请求，并等它们都完成后再继续往下执行。
            const [discoverRes, connectionsRes] = await Promise.all([
                axiosInstance.get(API_PATHS.MEDIA.DISCOVER_USERS, {
                    // 带上查询参数
                    params: { input: searchInput },
                }),
                axiosInstance.get(API_PATHS.MEDIA.GET_CONNECTIONS),
            ]);

            // 获取连接数据
            const connectionData = connectionsRes?.data?.data || {};
            // 更新连接状态
            setConnectionState({
                // 已连接
                connectedIds: (connectionData.connections || []).map((user) => user._id?.toString()),
                // 待接受
                pendingIncomingIds: (connectionData.pendingConnections || []).map((user) => user._id?.toString()),
                // 待发送
                pendingSentIds: (connectionData.sentPendingConnections || []).map((user) => user._id?.toString()),
            });

            // 数据清洗，容错处理
            const list = (discoverRes?.data?.data || []).map((user) => ({
                // 展开 user
                ...user,
                // 头像
                profile_picture: user.profileImageUrl || user.profile_picture || '',
                // 粉丝
                followers: user.followers || [],
                // 关注
                following: user.following || [],
                // 连接
                connections: user.connections || [],
            }));
            // 更新用户列表
            setUsers(list);
        } catch (err) {
            console.error(err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // 搜索
    const handleSearch = async (e) => {
        // 如果按下回车键
        if (e.key === 'Enter') {
            // 设置已搜索
            setHasSearched(true);
            // 获取用户列表
            fetchUsers(input.trim());
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
            <div className='max-w-6xl mx-auto p-6'>

                {/* Title */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover People</h1>
                    <p className='text-slate-600'>Connect with amazing people and grow your network</p>
                </div>

                {/* Search Bar */}
                <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
                    <div className='p-6'>
                        <div className='relative'>
                            {/* top-1/2 -translate-y-1/2 让搜索图标垂直居中 */}
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5' />
                            <input type="text" placeholder='Search people by name, username, bio, or location...'
                            className='pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm'
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            onKeyUp={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                {/* 如果已搜索，则显示用户列表 */}
                {hasSearched && (
                    <div className='flex flex-wrap gap-6'>
                        {/* 遍历用户列表 */}
                        {users.map((user) => (
                            <UserCard
                                key={user._id} // 用户 ID
                                user={user} // 用户信息
                                isConnected={connectionState.connectedIds.includes(user._id?.toString())} // 是否已连接
                                // 是否待接受
                                isPendingConnection={
                                    connectionState.pendingIncomingIds.includes(user._id?.toString()) ||
                                    connectionState.pendingSentIds.includes(user._id?.toString()) // 是否待接受
                                }
                                // 请求连接
                                onConnectionRequested={(userId) => { // 请求连接
                                    setConnectionState((prev) => ({
                                        ...prev,
                                        pendingSentIds: prev.pendingSentIds.includes(userId)
                                            ? prev.pendingSentIds
                                            : [...prev.pendingSentIds, userId],
                                    }));
                                }}
                            />
                        ))}
                    </div>
                )}

                {
                    loading && (
                        <Spinner />
                    )
                }

                {!loading && hasSearched && users.length === 0 && (
                    <div className='text-center text-slate-500 py-10'>No users found</div>
                )}
            </div>
        </div>
    )
};

export default Discover;