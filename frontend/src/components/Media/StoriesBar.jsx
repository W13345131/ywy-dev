import React, { useState, useEffect } from 'react';
import { Plus, User as UserIcon } from 'lucide-react';
import moment from 'moment';
import StoryModal from './StoryModal';
import StoryViewer from './StoryViewer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';


// 获取故事（stories）数据，并在首页顶部用横向滚动的方式展示；同时支持“创建故事”和“查看故事”
const StoriesBar = () => {

    // 故事列表
    const [stories, setStories] = useState([]);
    // 是否显示故事模态框
    const [showStoryModal, setShowStoryModal] = useState(false);
    // 查看故事
    const [viewStory, setViewStory] = useState(null);

    // 获取故事列表
    const fetchStories = async () => {
        try {
            // 调用 axiosInstance 的 get 方法，获取故事列表
            const res = await axiosInstance.get(API_PATHS.MEDIA.GET_STORIES);

            // 数据清洗，容错处理
            const storyList = (res?.data?.data || []).map((story) => ({
                ...story,
                // 如果 story.user 存在，则展开 story.user
                user: story.user ? {
                    ...story.user,
                    profile_picture: story.user.profileImageUrl || story.user.profile_picture || '',
                } : null, // 如果 story.user 不存在，则设置为 null
            }));
            // 更新故事列表
            setStories(storyList);
        } catch (err) {
            // 如果获取故事列表失败，则清空故事列表
            console.error(err);
            setStories([]);
        }
    };

    // 组件挂载后，获取故事列表
    useEffect(() => {
        fetchStories();
    }, []);


    return (
        <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>
            <div className='flex gap-4 pb-5'>
                {/* 添加故事卡片 */}
                <div onClick={() => setShowStoryModal(true)} className='rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-[3/4] cursor-pointer
                hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300
                bg-gradient-to-b from-indigo-50 to-white'>
                    <div className='h-full flex flex-col items-center justify-center p-4'>
                        <div className='size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3'>
                            <Plus className='size-5 text-white' />
                        </div>
                        <p className='text-sm font-medium text-slate-700 text-center'>Create story</p>
                    </div>
                </div>
                {/* 故事卡片 */}
                {
                    // 遍历故事列表，生成故事卡片
                    stories.map((story, index) => (
                        <div 
                        // 点击故事卡片，设置查看故事
                        onClick={() => setViewStory(story)}
                        key={index} className={`relative rounded-lg shadow min-w-30 max-w-30 max-h-40 cursor-pointer
                        hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-50 to-purple-600
                        hover:from-indigo-700 hover:to-purple-800 active:scale-95`}>
                            {/* 如果 story.user.profile_picture 存在，则显示用户头像 */}
                            {story.user?.profile_picture ? (
                                <img src={story.user.profile_picture} alt=""
                                className='absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow object-cover'
                                />
                            ) : (
                                // 如果 story.user.profile_picture 不存在，则显示默认头像
                                <div className='absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow bg-white/90 flex items-center justify-center text-slate-400'>
                                    <UserIcon className='size-4' />
                                </div>
                            )}
                            {/* 显示故事内容 */}
                            <p className='absolute top-18 left-3 text-white/60 text-sm truncate max-w-24'>
                                {story.content}
                            </p>
                            <p className='text-white absolute bottom-1 right-2 z-10 text-xs'>
                                {moment(story.createdAt).fromNow()}
                            </p>
                            {
                                // 如果 story.media_type 不是文本，则显示故事内容
                                story.media_type !== 'text' && (
                                    <div className='absolute inset-0 z-1 rounded-lg bg-black overflow-hidden'>
                                    {
                                        story.media_type === 'image' 
                                        ?
                                        <img src={story.media_url} alt="" className='h-full w-full object-cover hover:scale-110
                                        transition duration-500 opacity-70 hover:opacity-80' />
                                        :
                                        <video src={story.media_url} className='h-full w-full object-cover hover:scale-110 transition
                                        duration-500 opacity-70 hover:opacity-80' />
                                    }
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            </div>

            {/* 故事模态框 */}
            {
                showStoryModal && <StoryModal setShowStoryModal={setShowStoryModal} fetchStories={fetchStories} />
            }
            {/* 故事查看器 */}
            {
                viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
            }
        </div>
    );
};

export default StoriesBar;