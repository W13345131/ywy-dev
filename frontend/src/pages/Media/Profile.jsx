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

    const { id: profileId } = useParams();
    const { user: currentUser, updateUser } = useAuth();

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);
    
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    const [activeTab, setActiveTab] = useState('posts');

    const [showEdit, setShowEdit] = useState(false);

    const currentUserId = currentUser?._id || currentUser?.id;
    const targetProfileId = profileId || currentUserId;
    const isOwnProfile = currentUserId?.toString() === targetProfileId?.toString();

    const normalizePost = (post) => ({
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

    const normalizeProfile = (profile) => ({
        ...profile,
        profile_picture: profile.profileImageUrl || profile.profile_picture || '',
        cover_photo: profile.coverImageUrl || profile.cover_photo || '',
        followers: profile.followers || [],
        following: profile.following || [],
    });

    const mediaPosts = posts.filter((post) => post.image_urls.length > 0);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const requests = [
                axiosInstance.get(API_PATHS.MEDIA.GET_USER_PROFILE(targetProfileId)),
            ];

            if (isOwnProfile) {
                requests.push(axiosInstance.get(API_PATHS.MEDIA.GET_POSTS));
            }

            const [profileRes, likedPostsRes] = await Promise.all(requests);
            const profileData = profileRes?.data?.data?.profile;
            const postsData = profileRes?.data?.data?.posts || [];

            setUser(profileData ? normalizeProfile(profileData) : null);
            setPosts(postsData.map(normalizePost));
            setLikedPosts(
                isOwnProfile
                    ? (likedPostsRes?.data?.data || [])
                        .map(normalizePost)
                        .filter((post) => (post.likes_count || []).some((id) => id.toString() === currentUserId?.toString()))
                    : []
            );
        } catch (err) {
            console.error(err);
            setUser(null);
            setPosts([]);
            setLikedPosts([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [targetProfileId, currentUserId, isOwnProfile]);

    if (loading || !user) return <Spinner />;

    return (
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
                        activeTab === 'media' && (
                            <div className='flex flex-wrap mt-6 max-w-6xl'>
                                {
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
                showEdit && (
                    <ProfileModal
                        user={user}
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