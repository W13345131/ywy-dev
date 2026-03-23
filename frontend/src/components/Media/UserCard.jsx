import React, { useMemo, useState } from 'react';
import { MapPin, UserPlus, MessageCircle, Plus, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContent';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const UserCard = ({ user, isConnected = false, isPendingConnection = false, onConnectionRequested }) => {
    const navigate = useNavigate();
    const { user: currentUser, updateUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const followingIds = useMemo(
        () => (currentUser?.following || []).map((id) => id.toString()),
        [currentUser]
    );
    const connectionIds = useMemo(
        () => (currentUser?.connections || []).map((id) => id.toString()),
        [currentUser]
    );
    const isFollowing = followingIds.includes(user._id?.toString());
    const isConnectedByAuth = connectionIds.includes(user._id?.toString());
    const canMessage = isConnected || isConnectedByAuth;

    const handleFollow = async () => {
        if (!currentUser || isSubmitting || isFollowing) return;

        try {
            setIsSubmitting(true);
            await axiosInstance.post(API_PATHS.MEDIA.FOLLOW_USER, { userId: user._id });
            updateUser({
                following: [...(currentUser.following || []), user._id],
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleConnectRequest = async () => {
        if (!currentUser || isSubmitting) return;

        if (canMessage) {
            navigate(`/media/chat-box/${user._id}`);
            return;
        }

        if (isPendingConnection) return;

        try {
            setIsSubmitting(true);
            await axiosInstance.post(API_PATHS.MEDIA.CONNECT_USER, { userId: user._id });
            onConnectionRequested?.(user._id?.toString());
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }



    return (
        <div className='p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md' key={user._id} >
            <div className='text-center'>
                {user.profile_picture ? (
                    <img src={user.profile_picture} alt="" className='w-16 h-16 rounded-full object-cover shadow-md mx-auto' />
                ) : (
                    <div className='w-16 h-16 rounded-full shadow-md mx-auto bg-slate-100 flex items-center justify-center text-slate-400'>
                        <UserIcon className='size-8' />
                    </div>
                )}
                <p className='mt-4 font-semibold'>{user.username}</p>
                {
                    user.bio && (
                        <p className='text-gray-600 mt-2 text-center text-sm px-4'>
                            {user.bio}
                        </p>
                    )
                }
            </div>

            <div className='flex items-center justify-center gap-2 mt-4 text-xs text-gray-600'>
                <div className='flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'>
                    <MapPin className='size-4' /> {user.location}
                </div>
                <div className='flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'>
                    <span>
                        {user.followers.length} Followers
                    </span>
                </div>
            </div>

            <div className='flex mt-4 gap-2'>
                {/* Follow Button */}
                <button
                disabled={isFollowing || isSubmitting}
                onClick={handleFollow}
                className='w-full py-2 rounded-md flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500
                to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'>
                    <UserPlus className='size-4' /> 
                    {/* 如果当前用户已经关注了该用户，则显示Following，否则显示Follow */}
                    {isFollowing ? 'Following' : 'Follow'}
                </button>

                {/* Connect Request Button / Message Button */}
                <button onClick={handleConnectRequest} disabled={isSubmitting || isPendingConnection} className='flex items-center justify-center w-16 border text-slate-500 group rounded-md cursor-pointer active:scale-95 transition disabled:opacity-50'>
                    {
                        canMessage
                        ? <MessageCircle className='size-5 group-hover:scale-105 transition' />
                        : <Plus className='size-5 group-hover:scale-105 transition' /> 
                    }
                </button>
            </div>
        </div>
    )
}

export default UserCard;