import React, { useState, useEffect } from 'react';
import { Plus, User as UserIcon } from 'lucide-react';
import moment from 'moment';
import StoryModal from './StoryModal';
import StoryViewer from './StoryViewer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const StoriesBar = () => {

    const [stories, setStories] = useState([]);
    const [showStoryModal, setShowStoryModal] = useState(false);
    const [viewStory, setViewStory] = useState(null);

    const fetchStories = async () => {
        try {
            const res = await axiosInstance.get(API_PATHS.MEDIA.GET_STORIES);
            const storyList = (res?.data?.data || []).map((story) => ({
                ...story,
                user: story.user ? {
                    ...story.user,
                    profile_picture: story.user.profileImageUrl || story.user.profile_picture || '',
                } : null,
            }));
            setStories(storyList);
        } catch (err) {
            console.error(err);
            setStories([]);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);


    return (
        <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>
            <div className='flex gap-4 pb-5'>
                {/* 添加故事卡片 */}
                <div onClick={() => setShowStoryModal(true)} className='rounded-lg shadow-sm min-w-30 max-2-30 max-h-40 aspect-[3/4] cursor-pointer
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
                    stories.map((story, index) => (
                        <div 
                        onClick={() => setViewStory(story)}
                        key={index} className={`relative rounded-lg shadow min-w-30 max-w-30 max-h-40 cursor-pointer
                        hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-50 to-purple-600
                        hover:from-indigo-700 hover:to-purple-800 active:scale-95`}>
                            {story.user?.profile_picture ? (
                                <img src={story.user.profile_picture} alt=""
                                className='absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow object-cover'
                                />
                            ) : (
                                <div className='absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow bg-white/90 flex items-center justify-center text-slate-400'>
                                    <UserIcon className='size-4' />
                                </div>
                            )}
                            <p className='absolute top-18 left-3 text-white/60 text-sm truncate max-w-24'>
                                {story.content}
                            </p>
                            <p className='text-white absolute bottom-1 right-2 z-10 text-xs'>
                                {moment(story.createdAt).fromNow()}
                            </p>
                            {
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