import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserProfileInfo from '../../components/Media/UserProfileInfo';
import PostCard from '../../components/Media/PostCard';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ProfileModal from '../../components/Media/ProfileModal';
import Spinner from '../../components/common/Spinner';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useAuth } from '../../context/AuthContent';


const Profile = () => {

    // 获取用户 ID,命名为profileId
    const { id: profileId } = useParams();
    const { user: currentUser, updateUser } = useAuth();

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);
    
    const [posts, setPosts] = useState([]);
    // 点赞帖子列表
    const [likedPosts, setLikedPosts] = useState([]);

    // 当前激活的标签
    const [activeTab, setActiveTab] = useState('posts');

    // 是否显示编辑弹窗
    const [showEdit, setShowEdit] = useState(false);

    // 当前用户 ID
    const currentUserId = currentUser?._id || currentUser?.id;
    // 目标用户 ID
    const targetProfileId = profileId || currentUserId;
    // 是否是自己的个人主页
    const isOwnProfile = currentUserId?.toString() === targetProfileId?.toString();

    // 帖子列表
    const normalizePost = (post) => ({
        // 展开 post
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
    });

    // 用户信息
    const normalizeProfile = (profile) => ({
        // 展开 profile
        ...profile,
        // 用户头像
        profile_picture: profile.profileImageUrl || profile.profile_picture || '',
        // 封面照片
        cover_photo: profile.coverImageUrl || profile.cover_photo || '',
        // 粉丝
        followers: profile.followers || [],
        // 关注
        following: profile.following || [],
    });

    // 媒体帖子列表
    const mediaPosts = posts.filter((post) => post.image_urls.length > 0);

    // 获取用户信息
    const fetchUser = async () => {
        try {
            setLoading(true);
            // 创建请求数组
            const requests = [
                axiosInstance.get(API_PATHS.MEDIA.GET_USER_PROFILE(targetProfileId)),
            ];

            // 如果当前用户是自己的个人主页，则添加获取帖子请求
            if (isOwnProfile) {
                requests.push(axiosInstance.get(API_PATHS.MEDIA.GET_POSTS));
            }

            // 等待所有请求完成
            const [profileRes, likedPostsRes] = await Promise.all(requests);
            // 获取用户信息
            const profileData = profileRes?.data?.data?.profile;
            // 获取帖子列表
            const postsData = profileRes?.data?.data?.posts || [];

            // 更新用户信息，如果profileData存在，则更新用户信息，否则更新为null
            setUser(profileData ? normalizeProfile(profileData) : null);
            // 更新帖子列表
            setPosts(postsData.map(normalizePost));
            // 更新点赞帖子列表
            setLikedPosts(
                // 如果当前用户是自己的个人主页，则更新点赞帖子列表
                isOwnProfile
                    // 如果点赞帖子列表存在，则更新点赞帖子列表，否则更新为空数组
                    ? (likedPostsRes?.data?.data || [])
                        .map(normalizePost)
                        // 过滤掉不是当前用户点赞的帖子
                        .filter((post) => (post.likes_count || []).some((id) => id.toString() === currentUserId?.toString()))
                    : []
            );
        } catch (err) {
            // 打印错误信息
            console.error(err);
            // 更新用户信息为null
            setUser(null);
            // 更新帖子列表为空数组
            setPosts([]);
            // 更新点赞帖子列表为空数组
            setLikedPosts([]);
        } finally {
            // 设置加载状态为false
            setLoading(false);
        }
    }

    // 组件挂载时，获取用户信息
    useEffect(() => {
        // 获取用户信息
        fetchUser();
    }, [targetProfileId, currentUserId, isOwnProfile]);

    // 如果加载状态为true，或者用户信息为null，则显示加载中
    if (loading || !user) return <Spinner />;

    return (
        // 相对定位，高度为全屏，溢出滚动，背景为灰色，内边距为6
        <div className='relative h-full overflow-y-scroll bg-gray-50 p-6'>
            <div className='max-w-3xl mx-auto'>
                {/* profile card */}
                <div className='bg-white rounded-2xl shadow overflow-hidden'>
                    {/* cover photo */}
                    <div className='h-40 md:h-56'>
                        {
                            user.cover_photo && (
                                <img src={user.cover_photo} alt="" className='w-full h-full object-cover' />
                            )
                        }
                    </div>

                    {/* User Info */}
                    <UserProfileInfo user={user} posts={posts} isOwnProfile={isOwnProfile} setShowEdit={setShowEdit} />
                </div>

                {/* Tabs */}
                <div className='mt-6'>
                    <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
                        {["posts", "media", "likes"].map((tab) => (
                            <button key={tab} className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer 
                            ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setActiveTab(tab)}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Posts */}
                    {
                        activeTab === 'posts' && (
                            <div className='mt-6 flex flex-col items-center gap-6'>
                                {
                                    posts.length > 0 ? posts.map((post) => (
                                        <PostCard key={post._id} post={post} />
                                    )) : <p className='text-gray-500'>No posts yet</p>
                                }
                            </div>
                        )
                    }

                    {/* Media */}
                    {
                        // 如果激活的标签为媒体，则显示媒体
                        activeTab === 'media' && (
                            <div className='flex flex-wrap mt-6 max-w-6xl'>
                                {
                                    // 如果媒体帖子列表长度大于0，则显示媒体帖子列表
                                    mediaPosts.length > 0 ? mediaPosts.map((post) => (
                                        <React.Fragment key={post._id}>
                                        {
                                            post.image_urls.map((image, index) => (
                                                <Link target='_blank' to={image} key={`${post._id}-${index}`} className='group relative block'>
                                                    <img src={image} alt="" className='w-64 aspect-video object-contain rounded-lg' />
                                                    <p className='absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300'>
                                                        Posted {moment(post.createdAt).fromNow()}
                                                    </p>
                                                </Link>
                                            ))
                                        }
                                        </React.Fragment>
                                    )) : <p className='text-gray-500'>No media yet</p>
                                }
                            </div>
                        )
                    }

                    {
                        // 如果激活的标签为喜欢，则显示喜欢
                        activeTab === 'likes' && (
                            <div className='mt-6 flex flex-col items-center gap-6'>
                                {
                                    likedPosts.length > 0
                                        ? likedPosts.map((post) => <PostCard key={post._id} post={post} />)
                                        : <p className='text-gray-500'>{isOwnProfile ? 'No liked posts yet' : 'Liked posts are not available'}</p>
                                }
                            </div>
                        )
                    }
                </div>
            </div>

            {
                // 如果显示编辑弹窗，则显示编辑弹窗
                showEdit && (
                    <ProfileModal
                        user={user}
                        // 设置显示编辑弹窗
                        setShowEdit={setShowEdit}
                        onUpdated={(updatedUser) => {
                            const normalized = normalizeProfile(updatedUser);
                            setUser(normalized);
                            if (isOwnProfile) {
                                updateUser({
                                    username: normalized.username,
                                    profileImageUrl: normalized.profile_picture,
                                });
                            }
                        }}
                    />
                )
            }
        </div>
    );
};

export default Profile;