import React, { useEffect, useState } from 'react';
import { MessageSquare, Eye, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Messages = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);

    const fetchConversations = async () => {
        try {
            const res = await axiosInstance.get(API_PATHS.MEDIA.GET_RECENT_MESSAGES);
            const list = (res?.data?.data || []).map((item) => ({
                ...item,
                chatUser: item.chatUser ? {
                    ...item.chatUser,
                    profile_picture: item.chatUser.profileImageUrl || item.chatUser.profile_picture || '',
                } : null,
            }));
            setConversations(list);
        } catch (err) {
            console.error(err);
            setConversations([]);
        }
    };

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
                        conversations.map((conversation) => (
                            <div key={conversation._id} className='max-w-xl flex flex-wrap gap-5 p-6 bg-white shadow rounded-md'>
                                {conversation.chatUser?.profile_picture ? (
                                    <img src={conversation.chatUser.profile_picture} alt="" className='size-12 mx-auto rounded-full object-cover' />
                                ) : (
                                    <div className='size-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
                                        <UserIcon className='size-6' />
                                    </div>
                                )}
                                <div className='flex-1'>
                                    <p className='font-medium text-slate-700'>{conversation.chatUser?.username}</p>
                                    <p className='text-gray-600 text-sm'>{conversation.lastMessage || 'Media'}</p>
                                </div>

                                <div className='flex flex-col gap-2 mt-4'>

                                    <button onClick={() => navigate(`/media/chat-box/${conversation.chatUser?._id}`)} className='size-10 flex items-center justify-center text-sm rounded bg-slate-100
                                    hover:bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer p-1'>
                                        <MessageSquare className='size-4' />
                                    </button>

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