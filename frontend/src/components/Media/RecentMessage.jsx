import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { User as UserIcon } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const RecentMessage = () => {

    // 最近消息列表
    const [messages, setMessages] = useState([]);

    // 获取最近消息列表
    const fetchRecentMessages = async () => {
        try {
            // 调用 axiosInstance 的 get 方法，获取最近消息列表
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
            // 更新最近消息列表
            setMessages(list);
        } catch (err) {
            console.error(err);
            setMessages([]);
        }
    };

    // 组件挂载后，获取最近消息列表
    useEffect(() => {
        fetchRecentMessages();
    }, []);

    return (
        <div className='bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800'>
            <h3 className='font-semibold text-slate-8 mb-4'>
                Recent messages
            </h3>
            <div className='flex flex-col max-h-56 overflow-y-scroll no-scrollbar'>
                {
                    messages.map((message, index) => (
                        // 跳转到聊天页面
                        <Link to={`/media/chat-box/${message.chatUser?._id}`} key={index} className='flex items-start gap-2 py-2 hover:bg-slate-100'>
                            {/* 如果消息用户有头像，则显示头像 */}
                            {message.chatUser?.profile_picture ? (
                                <img src={message.chatUser.profile_picture} alt="" className='block size-8 min-w-8 min-h-8 shrink-0 rounded-full object-cover' />
                            ) : (
                                <div className='size-8 min-w-8 min-h-8 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
                                    <UserIcon className='size-4' />
                                </div>
                            )}
                            <div className='w-full'>
                                <div className='flex justify-between'>
                                <p className='font-medium'>
                                    {message.chatUser?.username}
                                </p>
                                <p className='text-[10px] text-slate-400'>
                                    {moment(message.createdAt).fromNow()}
                                </p>
                                </div>
                                <div className='flex justify-between'>
                                    <p className='text-gray-500'>
                                        {message.lastMessage ? message.lastMessage : 'Media'}
                                    </p>
                                    {
                                        // 如果未读消息数大于0，则显示未读消息数
                                        message.unreadCount > 0 && (
                                            <p className='bg-indigo-500 text-white size-4 flex items-center justify-center rounded-full text-[10px]'>
                                                {message.unreadCount}
                                            </p>
                                        )
                                    }
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
};

export default RecentMessage;