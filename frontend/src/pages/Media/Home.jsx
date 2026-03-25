import React, { useState, useEffect } from 'react';
import StoriesBar from '../../components/Media/StoriesBar';
import PostCard from '../../components/Media/PostCard';
import RecentMessage from '../../components/Media/RecentMessage';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Home = () => {

    // 帖子列表
    const [feeds, setFeeds] = useState([]);
    // 加载状态
    const [loading, setLoading] = useState(true);

    // 获取帖子列表
    const fetchFeeds = async () => {
        try {
            // 调用 axiosInstance 的 get 方法，获取帖子列表
            const res = await axiosInstance.get(API_PATHS.MEDIA.GET_POSTS);

            // 数据清洗，容错处理
            const posts = (res?.data?.data || []).map((post) => ({
                // 展开 post
                ...post,
                // 图片数组兜底处理
                image_urls: post.image_urls || [],
                // 点赞数组兜底处理
                likes_count: post.likes_count || [],
                // 评论数组兜底处理
                comments: (post.comments || []).map((comment) => ({
                    ...comment,
                    // 如果 comment.user 存在，则展开 comment.user
                    user: comment.user ? {
                        ...comment.user,
                        profile_picture: comment.user.profileImageUrl || comment.user.profile_picture || '',
                    } : null,
                    replies: (comment.replies || []).map((reply) => ({
                        ...reply,
                        // 如果 reply.user 存在，则展开 reply.user
                        user: reply.user ? {
                            ...reply.user,
                            profile_picture: reply.user.profileImageUrl || reply.user.profile_picture || '',
                        } : null,
                    })),
                })),
                // 如果 post.user 存在，则展开 post.user
                user: post.user ? {
                    ...post.user,
                    profile_picture: post.user.profileImageUrl || post.user.profile_picture || '',
                } : null,
            }));

            // 更新帖子列表
            setFeeds(posts);
        } catch (err) {
            // 如果获取帖子列表失败，则清空帖子列表
            setFeeds([]);
        } finally {
            // 设置加载状态为 false
            setLoading(false);
        }
    };

    // 组件挂载后，获取帖子列表
    useEffect(() => {
        fetchFeeds();
    }, []);

    return (
        <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
            {/* Stories and Post list */}
            <div>
                <StoriesBar />
                {/* space-y-6 表示子元素之间竖向有6个单位的间距 */}
                <div className='p-4 space-y-6'>
                    {
                        feeds.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    }
                </div>
            </div>
            {/* Right Sidebar */}
            {/* max-xl:hidden 表示在小于等于1280px的屏幕上隐藏，sticky 表示元素在滚动时固定在顶部，w-75 表示宽度为75，h-full 表示高度为100% */}
            <div className='max-xl:hidden sticky top-0 w-75 h-full'>
                <RecentMessage />
            </div>
        </div>
    )
};

export default Home;