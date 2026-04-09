import React, { useState } from 'react';
import { X, ImageIcon, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContent';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const CreatePost = () => {

    // 导航
    const navigate = useNavigate();
    // 用户信息
    const { user } = useAuth();
    // 内容
    const [content, setContent] = useState('');
    // 图片
    const [images, setImages] = useState([]);
    // 加载状态
    const [loading, setLoading] = useState(false);

    // 用户头像
    const profilePicture = user?.profileImageUrl || user?.profile_picture || '';

    // 处理提交
    const handleSubmit = async () => {
        // 如果内容为空，且图片数组为空，则抛出错误
        if (!content.trim() && images.length === 0) {
            throw new Error('Post content or image is required');
        }

        setLoading(true);

        // 尝试提交
        try {
            // 创建 FormData 对象
            const formData = new FormData();
            // 如果图片数组长度大于0，且文本内容不为空，则帖子类型为文本和图片
            // 如果图片数组长度大于0，且文本内容为空，则帖子类型为图片
            // 否则帖子类型为文本
            const postType = images.length > 0
                ? (content.trim() ? 'text_with_image' : 'image')
                : 'text';

            // 添加文本内容
            formData.append('content', content.trim());
            // 添加帖子类型
            formData.append('post_type', postType);

            // 遍历图片数组，添加图片
            images.forEach((image) => {
                // 添加图片
                formData.append('images', image);
            });

            // 调用 axiosInstance 的 post 方法，添加帖子
            await axiosInstance.post(API_PATHS.MEDIA.ADD_POST, formData);
            // 清空文本内容
            setContent('');
            // 清空图片数组
            setImages([]);
            // 导航到首页
            navigate('/media/home');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
            <div className='max-w-6xl mx-auto p-6'>
                {/* Title */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-slate-900 mb-2'>
                        Create Post
                    </h1>
                    <p className='text-slate-600'>
                        Share your thoughts, ideas, and experiences with the world
                    </p>
                </div>

                {/* Form */}
                <div className='max-w-xl bg-white p-4 sm:p-6 sm:pb-3 rounded-xl shadow-md space-y-4'>
                    {/* Header */}
                    <div className='flex items-center gap-3'>
                    {/* 如果用户有头像，则显示头像 */}
                    {profilePicture ? (
                        <img src={profilePicture} alt="" className='size-12 rounded-full shadow object-cover' />
                    ) : (
                        <div className='size-12 rounded-full shadow bg-slate-100 flex items-center justify-center text-slate-400'>
                            <UserIcon className='size-6' />
                        </div>
                    )}
                        <div className=''>
                            <h2 className='font-semibold'>{user?.username}</h2>
                        </div>
                    </div>

                    {/* Content */}
                    <textarea
                    className='w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder:text-gray-400'
                    placeholder="What's happening?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    />

                    {/* Images */}
                    {
                        // 如果图片数组长度大于0，则显示图片
                        images.length > 0 && (
                            // flex-wrap 让图片换行
                            <div className='flex flex-wrap gap-2 mt-4'>
                                {
                                    images.map((image, index) => (
                                        // 显示图片
                                        // key 为图片索引
                                        // className 为相对定位，组内元素 hover 时显示删除按钮
                                        <div key={index} className='relative group'>
                                            {/* // 显示图片 */}
                                            <img src={URL.createObjectURL(image)} alt="" className='h-20 rounded-md' />
                                            {/* // 点击删除图片 */}
                                            {/* // 使用 filter 方法过滤掉当前图片，然后更新图片数组 */}
                                            <div onClick={() => setImages(images.filter((_, i) => i !== index))} className='absolute hidden group-hover:flex justify-center items-center inset-0 bg-black/40 rounded-md cursor-pointer'>
                                                <X className='size-6 text-white' />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }

                    {/* Bottom Bar */}
                    <div className='flex items-center justify-between py-3 border-t border-gray-300'>
                        <label htmlFor="images" className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer transition'>
                            <ImageIcon className='size-6' />
                        </label>

                        {/* 选择图片 */}
                        <input
                            type="file"
                            id="images"
                            accept='image/*'
                            hidden
                            multiple
                            onChange={(e) => {
                                // 将文件列表转换为数组
                                const nextFiles = Array.from(e.target.files || []);
                                // 更新图片数组，最多显示4张图片
                                setImages((prev) => [...prev, ...nextFiles].slice(0, 4));
                            }}
                        />

                        {/* 发布帖子按钮 */}
                        <button onClick={() => toast.promise(
                            // 发布帖子
                            handleSubmit(), 
                            {
                                loading: 'uploading...',
                                success: <p>Post Added</p>,
                                error: e => <p>{e.message}</p>
                            }
                        )} disabled={loading} className='text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600
                        hover:to-purple-700 active:scale-95 transition cursor-pointer text-white px-8 py-2 rounded-md cursor-pointer'>
                            Publish Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;