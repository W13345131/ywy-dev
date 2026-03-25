import React, { useEffect, useState } from 'react';
import { MessageSquare, Eye, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Messages = () => {

    // 导航
    const navigate = useNavigate();
    // 会话列表
    const [conversations, setConversations] = useState([]);

    // 获取会话列表
    const fetchConversations = async () => {
        try {
            // 调用 axiosInstance 的 get 方法，获取会话列表
            const res = await axiosInstance.get(API_PATHS.MEDIA.GET_RECENT_MESSAGES);
            // 数据清洗，容错处理
            const list = (res?.data?.data || []).map((item) => ({
                ...item,
                // 如果 item.chatUser 存在，则展开 item.chatUser
                chatUser: item.chatUser ? {
                    ...item.chatUser,
                    profile_picture: item.chatUser.profileImageUrl || item.chatUser.profile_picture || '',
                } : null,
            }));
            // 更新会话列表
            setConversations(list);
        } catch (err) {
            console.error(err);
            // 如果获取会话列表失败，则清空会话列表
            setConversations([]);
        }
    };

    // 组件挂载后，获取会话列表
    useEffect(() => {
        fetchConversations();
    }, []);

    return (
        <div className='min-h-screen relative bg-slate-50'>
            <div className='max-w-6xl mx-auto p-6'>
                {/* Title */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-slate-900 mb-2'>Messages</h1>
                    <p className='text-slate-600'>Talk to your friends and family</p>
                </div>

                {/* Connected Users */}
                <div className='flex flex-col gap-3'>
                    {
                        // 遍历会话列表
                        conversations.map((conversation) => (
                            // 会话卡片
                            <div key={conversation._id} className='max-w-xl flex flex-wrap gap-5 p-6 bg-white shadow rounded-md'>
                                {/* 如果会话用户有头像，则显示头像 */}
                                {conversation.chatUser?.profile_picture ? (
                                    <img src={conversation.chatUser.profile_picture} alt="" className='size-12 mx-auto rounded-full object-cover' />
                                ) : (
                                    <div className='size-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
                                        <UserIcon className='size-6' />
                                    </div>
                                )}
                                <div className='flex-1'>
                                    {/* 显示会话用户名 */}
                                    <p className='font-medium text-slate-700'>{conversation.chatUser?.username}</p>
                                    {/* 显示会话最后消息 */}
                                    <p className='text-gray-600 text-sm'>{conversation.lastMessage || 'Media'}</p>
                                </div>

                                <div className='flex flex-col gap-2 mt-4'>
                                    {/* 跳转到聊天页面 */}
                                    <button onClick={() => navigate(`/media/chat-box/${conversation.chatUser?._id}`)} className='size-10 flex items-center justify-center text-sm rounded bg-slate-100
                                    hover:bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer p-1'>
                                        <MessageSquare className='size-4' />
                                    </button>
                                    {/* 跳转到用户个人资料页面 */}
                                    <button onClick={() => navigate(`/media/profile/${conversation.chatUser?._id}`)} className='size-10 flex items-center justify-center text-sm rounded bg-slate-100
                                    hover:bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer'>
                                        <Eye className='size-4' />
                                    </button>
                                </div>
                                
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Messages;