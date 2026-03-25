import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon, SendHorizontal, User as UserIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContent';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const ChatBox = () => {

    // 获取会话 ID
    const { id } = useParams();
    // user命名为currentUser
    const { user: currentUser } = useAuth();
    // 文本消息
    const [text,setText] = useState('');
    // 图片消息
    const [image, setImage] = useState(null);
    // 用户信息
    const [user, setUser] = useState(null);
    // 消息列表
    const [messages, setMessages] = useState([]);
    // 消息列表末尾引用
    const messagesEndRef = useRef(null);

    // 当前用户 ID
    const currentUserId = currentUser?._id || currentUser?.id;
    // 消息数据清洗
    const normalizeMessage = (message) => ({
        ...message,
        // 如果 message.from_user_id 是对象，则取其 _id，否则取其值，表示从哪个用户发送的消息
        from_user_id: typeof message.from_user_id === 'object' ? message.from_user_id?._id : message.from_user_id,
        // 如果 message.to_user_id 是对象，则取其 _id，否则取其值，表示发给哪个用户的消息
        to_user_id: typeof message.to_user_id === 'object' ? message.to_user_id?._id : message.to_user_id,
    });

    // 获取用户信息
    const fetchUser = async () => {
        try {
            // 调用 axiosInstance 的 get 方法，获取用户信息
            const res = await axiosInstance.get(API_PATHS.MEDIA.GET_USER_PROFILE(id));
            // 数据清洗，容错处理
            const profile = res?.data?.data?.profile;
            // 更新用户信息
            setUser(profile ? {
                // 展开 profile
                ...profile,
                profile_picture: profile.profileImageUrl || profile.profile_picture || '',
            } : null);
        } catch (err) {
            console.error(err);
            setUser(null);
        }
    };

    // 获取消息列表
    const fetchMessages = async () => {
        try {
            // 调用 axiosInstance 的 get 方法，获取消息列表
            const res = await axiosInstance.get(API_PATHS.MEDIA.GET_MESSAGES(id));
            // 遍历消息列表，更新消息列表
            setMessages((res?.data?.data || []).map(normalizeMessage));
        } catch (err) {
            console.error(err);
            setMessages([]);
        }
    };

    // 发送消息
    const sendMessage = async () => {

        // 如果会话 ID 不存在，或者文本消息和图片消息都不存在，则返回
        if (!id || (!text.trim() && !image)) return;

        try {
            // 创建 FormData 对象
            const formData = new FormData();
            // 添加会话 ID
            formData.append('to_user_id', id);
            // 添加文本消息
            formData.append('text', text.trim());
            // 添加图片消息
            if (image) {
                formData.append('image', image);
            }

            // 调用 axiosInstance 的 post 方法，发送消息
            const res = await axiosInstance.post(API_PATHS.MEDIA.SEND_MESSAGE, formData);
            // 更新消息列表
            setMessages((prev) => [...prev, normalizeMessage(res?.data?.data)]);
            // 清空文本消息
            setText('');
            // 清空图片消息
            setImage(null);
        } catch (err) {
            // 如果发送消息失败，则打印错误信息
            console.error(err);
        }
    };

    // 消息列表变化时，滚动到消息底部
    useEffect(() => {
        // 滚动到消息底部
        // current 是 messagesEndRef 的引用，表示消息列表末尾的引用
        // scrollIntoView() 是 DOM API，作用是：把元素滚动到浏览器可视区域
        // behavior: 'smooth' → 表示滚动行为是平滑的；默认是瞬间滚动
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 组件挂载后，获取用户信息和消息列表
    useEffect(() => {
        // 如果会话 ID 存在，则获取用户信息和消息列表
        if (id) {
            // 获取用户信息
            fetchUser();
            // 获取消息列表
            fetchMessages();
        }
    }, [id]);


    // 如果用户信息存在，则渲染聊天界面
    return user &&  (
        // 回退1.5rem，使聊天界面与消息列表顶部对齐
        <div className='-mt-6 flex h-[calc(100%+1.5rem)] min-h-0 flex-col overflow-hidden'>
            <div className='shrink-0 flex items-center gap-2 p-2 md:px-10 xl:pl-42 border-b border-gray-200'>
                {/* 如果用户有头像，则显示头像 */}
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

            <div className='flex-1 min-h-0 overflow-y-auto p-5 md:px-10'>
                <div className='space-y-4 max-w-4xl mx-auto'>
                    {
                        // toSorted() 是数组 API，作用是：按照创建时间排序
                        // (a,b) => new Date(a.createdAt) - new Date(b.createdAt) → 按照创建时间排序, 
                        // 返回值为负数，则 a 在 b 之前，返回值为正数，则 a 在 b 之后，返回值为 0，则 a 和 b 相等
                        messages.toSorted((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
                          .map((message, index) => (
                            <div className={`flex flex-col ${
                                // 如果消息来自当前用户，则设置 items-end；否则设置 items-start
                                message.from_user_id !== currentUserId ? 'items-start' : 'items-end'
                            }`} key={index}>
                                <div className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${
                                    // 如果消息来自当前用户，则设置 rounded-bl-none；否则设置 rounded-br-none
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
                    {/* 消息列表末尾引用 */}
                    {/* 用于滚动到消息列表底部 */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* 消息输入框 */}
            <div className='shrink-0 px-4 pt-2 pb-4'>
                <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full'>
                    {/* 文本消息输入框 */}
                    <input type="text" className='flex-1 outline-none text-slate-700'
                    placeholder='Type a message...'
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    />

                    {/* 图片消息输入框 */}
                    <label htmlFor="image">
                        {
                            // 如果图片消息存在，则显示图片
                            image 
                            ? <img src={URL.createObjectURL(image)} alt="" className='h-8 rounded' />
                            : <ImageIcon className='size-7 text-slate-400 cursor-pointer' />
                        }
                        <input type="file" id='image' accept='image/*' hidden onChange={(e) => setImage(e.target.files[0])} />
                    </label>
                    {/* 发送消息按钮 */}
                    <button onClick={sendMessage} className='bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
                        <SendHorizontal size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;