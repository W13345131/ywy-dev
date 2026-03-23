import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon, SendHorizontal, User as UserIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContent';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const ChatBox = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [text,setText] = useState('');
    const [image, setImage] = useState(null);
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const currentUserId = currentUser?._id || currentUser?.id;
    const normalizeMessage = (message) => ({
        ...message,
        from_user_id: typeof message.from_user_id === 'object' ? message.from_user_id?._id : message.from_user_id,
        to_user_id: typeof message.to_user_id === 'object' ? message.to_user_id?._id : message.to_user_id,
    });

    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get(API_PATHS.MEDIA.GET_USER_PROFILE(id));
            const profile = res?.data?.data?.profile;
            setUser(profile ? {
                ...profile,
                profile_picture: profile.profileImageUrl || profile.profile_picture || '',
            } : null);
        } catch (err) {
            console.error(err);
            setUser(null);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await axiosInstance.get(API_PATHS.MEDIA.GET_MESSAGES(id));
            setMessages((res?.data?.data || []).map(normalizeMessage));
        } catch (err) {
            console.error(err);
            setMessages([]);
        }
    };

    const sendMessage = async () => {
        if (!id || (!text.trim() && !image)) return;

        try {
            const formData = new FormData();
            formData.append('to_user_id', id);
            formData.append('text', text.trim());
            if (image) {
                formData.append('image', image);
            }

            const res = await axiosInstance.post(API_PATHS.MEDIA.SEND_MESSAGE, formData);
            setMessages((prev) => [...prev, normalizeMessage(res?.data?.data)]);
            setText('');
            setImage(null);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (id) {
            fetchUser();
            fetchMessages();
        }
    }, [id]);

    return user &&  (
        <div className='flex flex-col h-screen'>
            <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
                {user.profile_picture ? (
                    <img src={user.profile_picture} alt="" className='size-8 rounded-full object-cover' />
                ) : (
                    <div className='size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400'>
                        <UserIcon className='size-4' />
                    </div>
                )}
                <div>
                    <p className='font-medium'>{user.username}</p>
                </div>
            </div>

            <div className='p-5 md:px-10 h-full overflow-y-scroll'>
                <div className='space-y-4 max-w-4xl mx-auto'>
                    {
                        messages.toSorted((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
                          .map((message, index) => (
                            <div className={`flex flex-col ${
                                message.from_user_id !== currentUserId ? 'items-start' : 'items-end'
                            }`} key={index}>
                                <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${
                                    message.from_user_id !== currentUserId ? 'rounded-bl-none' : 'rounded-br-none'
                                }`}>
                                    {
                                        message.message_type === 'image' && <img src={message.media_url}
                                        className='w-full max-w-52 rounded-lg mb-1' />
                                    }
                                    <p>
                                        {message.text}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className='px-4'>
                <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
                    <input type="text" className='flex-1 outline-none text-slate-700'
                    placeholder='Type a message...'
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    />

                    <label htmlFor="image">
                        {
                            image 
                            ? <img src={URL.createObjectURL(image)} alt="" className='h-8 rounded' />
                            : <ImageIcon className='size-7 text-slate-400 cursor-pointer' />
                        }
                        <input type="file" id='image' accept='image/*' hidden onChange={(e) => setImage(e.target.files[0])} />
                    </label>

                    <button onClick={sendMessage} className='bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
                        <SendHorizontal size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;