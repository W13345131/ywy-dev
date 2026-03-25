import React, { useEffect, useMemo, useState } from 'react';
import { Users, UserCheck, UserPlus, UserRoundPen, MessageSquare, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Connection = () => {

    // 当前标签
    const [currentTab, setCurrentTab] = useState('Followers');
    // 连接数据
    const [connectionData, setConnectionData] = useState({
        followers: [],
        following: [],
        pendingConnections: [],
        connections: [],
    });

    // 导航
    const navigate = useNavigate();

    // 获取连接数据
    const fetchConnections = async () => {
        try {
            // 调用 axiosInstance 的 get 方法，获取连接数据
            const res = await axiosInstance.get(API_PATHS.MEDIA.GET_CONNECTIONS);
            const data = res?.data?.data || {};
            const normalizeUsers = (users = []) =>
                users.map((user) => ({
                    // 展开 user
                    ...user,
                    profile_picture: user.profileImageUrl || user.profile_picture || '',
                }));

            // 更新连接数据
            setConnectionData({
                // 粉丝
                followers: normalizeUsers(data.followers),
                // 关注
                following: normalizeUsers(data.following),
                // 待接受
                pendingConnections: normalizeUsers(data.pendingConnections),
                // 连接
                connections: normalizeUsers(data.connections),
            });
        } catch (err) {
            console.error(err);
            setConnectionData({
                followers: [],
                following: [],
                pendingConnections: [],
                connections: [],
            });
        }
    };

    // 组件挂载后，获取连接数据
    useEffect(() => {
        fetchConnections();
    }, []);

    // 取消关注
    const handleUnfollow = async (userId) => {
        try {
            // 调用 axiosInstance 的 post 方法，取消关注
            await axiosInstance.post(API_PATHS.MEDIA.UNFOLLOW_USER, { userId });
            // 重新获取连接数据
            fetchConnections();
        } catch (err) {
            console.error(err);
        }
    };

    // 接受连接
    const handleAccept = async (userId) => {
        try {
            // 调用 axiosInstance 的 post 方法，接受连接
            await axiosInstance.post(API_PATHS.MEDIA.ACCEPT_CONNECTION, { userId });
            // 重新获取连接数据
            fetchConnections();
        } catch (err) {
            console.error(err);
        }
    };

    // 连接数据数组
    const dataArray = useMemo(() => [
        {
            label: 'Followers',
            // 粉丝
            value: connectionData.followers,
            icon: Users
        },
        {
            label: 'Following',
            // 关注
            value: connectionData.following,
            icon: UserCheck
        },
        {
            label: 'Pending',
            // 待接受
            value: connectionData.pendingConnections,
            icon: UserRoundPen
        },
        {
            label: 'Connections',
            // 连接
            value: connectionData.connections,
            icon: UserPlus
        }
    ], [connectionData])

    
    return (
        <div className='min-h-screen bg-slate-50'>
            <div className='max-w-6xl mx-auto p-6'>

                {/* Title */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-slate-900 mb-2'>Connections</h1>
                    <p className='text-slate-600'>Manage your network and discover new connections</p>
                </div>

                {/* Counts */}
                <div className='mb-8 flex flex-wrap gap-6'>
                    {
                        // 遍历连接数据数组
                        dataArray.map((item, index) => (
                            <div key={index} className='flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-200
                            bg-white rounded-md shadow'>
                                <b>{item.value.length}</b>
                                <p className='text-slate-600'>
                                    {item.label}
                                </p>
                            </div>
                        ))
                    }
                </div>

                {/* Tabs */}
                <div className='inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm'>
                    {
                        // 遍历连接数据数组
                        dataArray.map((tab) => (
                            <button key={tab.label} className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${
                            currentTab === tab.label ? 'bg-white font-medium text-black' : 'text-gray-500 hover:text-black'
                            }`} onClick={() => setCurrentTab(tab.label)}>
                                {/* 显示图标 */}
                                <tab.icon className='size-4' />
                                {/* 显示标签 */}
                                <span className='ml-1'>{tab.label}</span>
                                {/* 显示计数 */}
                                {
                                    // 如果计数存在，则显示计数
                                    tab.count !== undefined && (
                                        <span className='ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>
                                            {tab.count}
                                        </span>
                                    )
                                }
                            </button>
                        ))
                    }
                </div>

                {/* Connections List */}
                <div className='flex flex-wrap gap-6 mt-6'>
                    {
                        // 遍历当前标签的连接数据
                        // 如果当前标签等于标签的 label，则返回标签的 value，否则返回空数组
                        (dataArray.find((tab) => tab.label === currentTab)?.value ?? []).map((user) => (
                            <div key={user._id} className='w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md'>
                                {/* 如果用户有头像，则显示头像 */}
                                {user.profile_picture ? (
                                    <img src={user.profile_picture} alt="" className='size-12 rounded-full shadow-md mx-auto object-cover' />
                                ) : (
                                    <div className='size-12 rounded-full shadow-md mx-auto bg-slate-100 flex items-center justify-center text-slate-400'>
                                        <UserIcon className='size-6' />
                                    </div>
                                )}
                                <div className='flex-1'>
                                    <p className='font-medium text-slate-700'>
                                        {user.username}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        {user.bio ? `${user.bio.slice(0, 30)}...` : 'No bio'}
                                    </p>
                                    <div className='flex max-sm:flex-col gap-2 mt-4'>
                                        {
                                            <button onClick={() => navigate(`/media/profile/${user._id}`)} className='w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500
                                            to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'>
                                                View Profile
                                            </button>
                                        }
                                        {
                                            currentTab === 'Following' && (
                                                <button onClick={() => handleUnfollow(user._id)} className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200
                                                text-black active:scale-95 transition cursor-pointer'>
                                                    Unfollow
                                                </button>
                                            )
                                        }
                                        {
                                            currentTab === 'Pending' && (
                                                <button onClick={() => handleAccept(user._id)} className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200
                                                text-black active:scale-95 transition cursor-pointer'>
                                                    Accept
                                                </button>
                                            )
                                        }
                                        {
                                            currentTab === 'Connections' && (
                                                <button onClick={() => navigate(`/media/chat-box/${user._id}`)} className='w-full p-2 text-sm rounded bg-slate-100 hover:bg-slate-200
                                                text-slate-800 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1'>
                                                    <MessageSquare className='size-4' />
                                                    Message
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Connection;