import React, { useState } from 'react';
import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const StoryModal = ({ setShowStoryModal, fetchStories }) => {

    const bgColors = ['#4f46e5', '#7c3aed', '#db2777', '#e11d48', '#ca8a04', '#0d9488'];

    // 默认模式为文本
    const [mode, setMode] = useState('text');

    // 背景颜色默认设置为紫色
    const [background, setBackground] = useState(bgColors[0]);

    // 文本内容
    const [text, setText] = useState('');

    // 媒体文件
    const [media, setMedia] = useState(null);

    // 媒体文件预览 URL
    const [previewUrl, setPreviewUrl] = useState(null);


    // 处理媒体文件上传
    const handleMediaUpload = (e) => {

        // 获取上传的第一个文件
        const file = e.target.files?.[0];

        if (file) {
            // 设置媒体文件
            setMedia(file);
            // 设置媒体文件预览 URL
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    // 处理创建故事
    const handleCreateStory = async () => {

        // 如果模式为文本，则让isTextMode为true，否则为false
        const isTextMode = mode === 'text';

        // 如果模式为文本，则判断文本内容是否为空
        // 如果文本内容为空，则抛出错误
        // trim() 方法用于去除字符串两端的空格
        if (isTextMode && !text.trim()) {
            throw new Error('Story content is required');
        }

        // 如果模式为媒体，则判断媒体文件是否为空
        // 如果媒体文件为空，则抛出错误
        if (!isTextMode && !media) {
            throw new Error('Please select a media file');
        }

        // 创建表单数据
        const formData = new FormData();
        // 添加文本内容
        formData.append('content', text.trim());
        // 添加媒体类型
        // 如果模式为文本，则添加文本类型，否则添加媒体类型
        // media.type.startsWith('video') 方法用于判断媒体文件是否为视频
        formData.append('media_type', isTextMode ? 'text' : media.type.startsWith('video') ? 'video' : 'image');
        // 添加背景颜色
        formData.append('background_color', background);

        // 如果媒体文件不为空，则添加媒体文件
        if (media) {
            formData.append('media', media);
        }

        // 调用 axiosInstance 的 post 方法，添加故事
        await axiosInstance.post(API_PATHS.MEDIA.ADD_STORY, formData);
        // 重新获取故事列表
        await fetchStories();
        // 关闭故事模态框
        setShowStoryModal(false);
    }





    return (
        <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-4 flex items-center justify-between'>
                    <button className='text-white p-2 cursor-pointer' onClick={() => setShowStoryModal(false)}>
                        <ArrowLeft />
                    </button>

                    <h2 className='text-lg font-semibold'>
                        Create Story
                    </h2>
                    <span className='w-10'>

                    </span>
                </div>

                <div className='rounde-lg h-96 flex items-center justify-center relative' style={{ backgroundColor: background }}>
                    {
                        // 如果模式为文本，则显示文本输入框
                        mode === 'text' && (
                            <textarea name='' id='' className='bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none'
                            placeholder="What's on your mind?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            />
                        )
                    }
                    {
                        // 如果模式为媒体，则显示媒体文件预览
                        mode === 'media' && previewUrl && (
                            // 如果媒体文件为图片，则显示图片
                            media?.type.startsWith('image') ? (
                                <img src={previewUrl} alt="" className='object-contain max-h-full' />
                            ) : (
                                // 否则显示视频
                                <video src={previewUrl} className='object-contain max-h-full' />
                            )
                        )
                    }
                </div>

                <div className='flex mt-4 gap-2'>
                    {
                        // 遍历背景颜色，生成背景颜色按钮
                        bgColors.map((color) => (
                            <button key={color} className='size-6 rounded-full ring cursor-pointer' style={{ backgroundColor: color }} onClick={() => setBackground(color)}>

                            </button>
                        ))
                    }
                </div>

                <div className='flex gap-2 mt-4'>
                    <button
                    // 点击文本按钮，设置模式为文本，清空媒体文件和媒体文件预览 URL
                    onClick={() => {setMode('text'); setMedia(null); setPreviewUrl(null);}}
                    className={`flex flex-1 items-center justify-center gap-2 p-2 rounded cursor-pointer
                    ${
                        // 如果模式为文本，则设置按钮的样式为白色，否则设置按钮的样式为灰色
                        mode === 'text' ? 'bg-white text-black' : 'bg-zinc-800'
                    }
                    `}>
                        <TextIcon size={18}/> Text
                    </button>

                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer
                    ${
                        // 如果模式为媒体，则设置按钮的样式为白色，否则设置按钮的样式为灰色
                        mode === 'media' ? 'bg-white text-black' : 'bg-zinc-800'
                    }
                    `}>
                        <input type="file" accept='image/*, video/*' className='hidden' onChange={(e) => {handleMediaUpload(e); setMode('media');}}  />
                        <Upload size={18}/> Photo/Video
                    </label>
                </div>
                <button className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500
                to-purple-600 hover:from-indigo-800 active:scale-95 transition cursor-pointer' 
                // 点击创建故事按钮，显示加载状态，成功状态，错误状态
                onClick={() => toast.promise(handleCreateStory(), {
                    // 加载状态
                    loading: 'Saving...',
                    // 成功状态
                    success: <p>Story Added</p>,
                    // 错误状态
                    error: e => <p>{e.message}</p>
                })}>
                    <Sparkle size={18}/> Create Story
                </button>
            </div>
        </div>
    );
};

export default StoryModal;