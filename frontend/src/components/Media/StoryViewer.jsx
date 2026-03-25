import React, { useEffect, useState } from 'react';
import { BadgeCheck, X, User as UserIcon } from 'lucide-react';

const StoryViewer = ({ viewStory, setViewStory }) => {


    // 进度条
    const [progress, setProgress] = useState(0);

    // 组件挂载后，设置进度条
    useEffect(() => {

        // 定时器，进度条间隔
        let timer, progressInterval;

        // 如果故事存在，并且故事类型不是视频，则设置进度条
        if (viewStory && viewStory.media_type !== 'video') {

            // 设置进度条为0
            setProgress(0);

            // 设置进度条间隔10秒
            const duration = 10000; // 10 seconds

            // 设置进度条间隔100毫秒
            const setTime = 100;

            // 设置进度条已过去的时间
            let elapsed = 0;

            // 设置进度条间隔100毫秒
            progressInterval = setInterval(() => {
                // 已过去的时间等于已过去的时间加上进度条间隔
                elapsed += setTime;
                // 设置进度条进度：已过去的时间除以总时间，再乘以100，得到进度百分比
                setProgress((elapsed / duration) * 100);
            }, setTime);

            // 10秒后, 关闭故事查看器
            timer = setTimeout(() => {
                setViewStory(null);
            }, duration);
        }

        return () => {
            // 清除进度条间隔
            clearInterval(progressInterval);
            // 清除定时器
            clearTimeout(timer);
        }

        // [viewStory, setViewStory]表示依赖于 viewStory 和 setViewStory 的值，当这两个值发生变化时，重新执行 useEffect
    }, [viewStory, setViewStory]);

    // 处理关闭故事查看器
    const handleClose = () => {
        // 设置故事为 null
        setViewStory(null);
    }

    // 如果故事不存在，则返回 null
    if (!viewStory) return null;

    // 渲染故事内容
    const renderContent = () => {
        // 根据故事类型，渲染故事内容
        switch (viewStory.media_type) {
            // 如果故事类型为图片，则渲染图片
            case 'image':
                return (
                    <img src={viewStory.media_url} alt="" className='max-w-full max-h-screen object-contain' />
                );
            // 如果故事类型为视频，则渲染视频
            case 'video':
                // 视频播放结束后，关闭故事查看器
                // controls 表示显示视频播放器控制栏
                // autoPlay 表示自动播放视频
                return (
                    <video onEnded={() => setViewStory(null)} src={viewStory.media_url} className='max-h-screen' controls autoPlay />
                );
            // 如果故事类型为文本，则渲染文本
            case 'text':
                // 渲染文本
                return (
                    <div className='w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center'>
                        {viewStory.content}
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className='fixed inset-0 z-110 min-h-screen bg-black bg-opacity-90 z-110 flex items-center justify-center'
        style={{ backgroundColor: viewStory.media_type === 'text' ? viewStory.background_color : '#000000' }}>

            {/* 进度条 */}
            <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
                <div className='h-full bg-white transition-all duration-100 ease-linear'
                // 设置进度条宽度：进度百分比
                style={{ width: `${progress}%` }}
                >

                </div>
            </div>

            {/* User Info */}
            <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50'>
            {/* 如果故事用户头像存在，则显示用户头像 */}
            {viewStory.user?.profile_picture ? (
                // 显示用户头像
                <img src={viewStory.user.profile_picture} alt="" className='size-7 sm:size-8 rounded-full object-cover border border-white' />
            ) : (
                // 否则显示默认头像
                <div className='size-7 sm:size-8 rounded-full border border-white bg-white/90 flex items-center justify-center text-slate-400'>
                    <UserIcon className='size-4' />
                </div>
            )}
            {/* 显示用户名和认证标志 */}
            <div className='text-white font-medium flex items-center gap-1.5'>
                <span>{viewStory.user?.username}</span>
                <BadgeCheck size={18} />
            </div>
            </div>

            {/* Close Button */}
            <button className='absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none' onClick={handleClose}>
                <X className='size-8 hover:scale-110 transition cursor-pointer' />
            </button>


            {/* Media Content */}
            <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
                {renderContent()}
            </div>
        </div>
    );
};

export default StoryViewer;