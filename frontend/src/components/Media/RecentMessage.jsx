import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { User as UserIcon } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const RecentMessage = () => {

    const [messages, setMessages] = useState([]);

    const fetchRecentMessages = async () => {
        try {
            const res = await axiosInstance.get(API_PATHS.MEDIA.GET_RECENT_MESSAGES);
            const list = (res?.data?.data || []).map((item) => ({
                ...item,
                chatUser: item.chatUser ? {
                    ...item.chatUser,
                    profile_picture: item.chatUser.profileImageUrl || item.chatUser.profile_picture || '',
                } : null,
            }));
            setMessages(list);
        } catch (err) {
            console.error(err);
            setMessages([]);
        }
    };

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
                        <Link to={`/media/chat-box/${message.chatUser?._id}`} key={index} className='flex items-start gap-2 py-2 hover:bg-slate-100'>
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