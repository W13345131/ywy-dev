import React from 'react';
import { Verified, PenBox, MapPin, Calendar, User as UserIcon } from 'lucide-react';
import moment from 'moment';

const UserProfileInfo = ({ user, posts, isOwnProfile, setShowEdit }) => {
    return (
        <div className='relative py-4 px-6 md:px-8 bg-white'>
            <div className='flex flex-col md:flex-row items-start gap-6'>
                <div className='w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full'>
                    {/* 如果用户头像存在，则显示用户头像 */}
                    {user.profile_picture ? (
                        <img src={user.profile_picture} alt="" className='absolute inset-0 w-full h-full rounded-full z-2 object-cover' />
                    ) : (
                        <div className='absolute inset-0 rounded-full z-2 bg-slate-100 flex items-center justify-center text-slate-400'>
                            <UserIcon className='size-12' />
                        </div>
                    )}
                </div>

                <div className='w-full pt-16 md:pt-0 md:pl-36'>
                    <div className='flex flex-col md:flex-row items-start justify-between'>
                        <div>
                            <div className='flex items-center gap-3'>
                                <h1 className='text-2xl font-bold text-gray-900'>{user.username}</h1>
                                <Verified className='size-6 text-blue-600' />
                            </div>
                        </div>

                        {/* Edit Button */}
                        {
                            // 如果当前用户是自己的个人主页，则显示编辑按钮
                            isOwnProfile && (
                                <button className='flex items-center gap-2 border border-gray-300 hover:bg-gray-50
                                px-4 py-2 rounded-lg font-medium transition-colors mt-4 md:mt-0 cursor-pointer' onClick={() => setShowEdit(true)}>
                                    <PenBox className='size-5' />
                                    Edit
                                </button>
                            )
                        }
                    </div>

                    <p className='text-gray-700 mt-4 text-sm max-w-md'>
                        {user.bio}
                    </p>

                    {/* 用户信息 */}
                    <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-4'>
                        <span className='flex items-center gap-1.5'>
                            {/* 如果用户位置存在，则显示用户位置 */}
                            <MapPin className='size-4' />
                            {user.location ? user.location : ''}
                        </span>
                        <span className='flex items-center gap-1.5'>
                            <Calendar className='size-4' />
                            Joined 
                            <span className='font-medium'>
                                {moment(user.createdAt).fromNow()}
                            </span>
                        </span>
                    </div>

                    {/* Posts and Followers */}
                    <div className='flex items-center gap-6 mt-6 border-t border-gray-300 pt-4'>
                        <div>
                            <span className='sm:text-xl font-bold text-gray-900'>
                                {posts.length}
                            </span>
                            <span className='text-xs sm:text-sm text-gray-500 ml-1.5'>
                                Posts
                            </span>
                        </div>
                        <div>
                            <span className='sm:text-xl font-bold text-gray-900'>
                                {user.followers.length}
                            </span>
                            <span className='text-xs sm:text-sm text-gray-500 ml-1.5'>
                                Followers
                            </span>
                        </div>
                        <div>
                            <span className='sm:text-xl font-bold text-gray-900'>
                                {user.following.length}
                            </span>
                            <span className='text-xs sm:text-sm text-gray-500 ml-1.5'>
                                Following
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileInfo;