import React, { useState, useEffect } from 'react';
import StoriesBar from '../../components/Media/StoriesBar';
import PostCard from '../../components/Media/PostCard';
import RecentMessage from '../../components/Media/RecentMessage';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Home = () => {
    const [feeds, setFeeds] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeeds = async () => {
        try {
            const res = await axiosInstance.get(API_PATHS.MEDIA.GET_POSTS);
            const posts = (res?.data?.data || []).map((post) => ({
                ...post,
                image_urls: post.image_urls || [],
                likes_count: post.likes_count || [],
                comments: (post.comments || []).map((comment) => ({
                    ...comment,
                    user: comment.user ? {
                        ...comment.user,
                        profile_picture: comment.user.profileImageUrl || comment.user.profile_picture || '',
                    } : null,
                    replies: (comment.replies || []).map((reply) => ({
                        ...reply,
                        user: reply.user ? {
                            ...reply.user,
                            profile_picture: reply.user.profileImageUrl || reply.user.profile_picture || '',
                        } : null,
                    })),
                })),
                user: post.user ? {
                    ...post.user,
                    profile_picture: post.user.profileImageUrl || post.user.profile_picture || '',
                } : null,
            }));
            setFeeds(posts);
        } catch (err) {
            setFeeds([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeeds();
    }, []);

    return (
        <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
            {/* Stories and Post list */}
            <div>
                <StoriesBar />
                <div className='p-4 space-y-6'>
                    {
                        feeds.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    }
                </div>
            </div>
            {/* Right Sidebar */}
            <div className='max-xl:hidden sticky top-0 w-75 h-full'>
                <RecentMessage />
            </div>
        </div>
    )
};

export default Home;