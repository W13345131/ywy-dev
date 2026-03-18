import React from 'react';
import { dummyConnectionsData } from '../../assets/assets';
import { MessageSquare, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Messages = () => {

    const navigate = useNavigate();

    return (
        <div className='min-h-screen relative bg-slate-50'>
            <div className='max-w-6xl mx-auto p-6'>
                {/* Title */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-slate-900 mb-2'>Messages</h1>
                    <p className='text-slate-600'>Talk to your friends and family</p>
                </div>

                {/* Connected Users */}
                <div className='flex flex-col gap-3'>
                    {
                        dummyConnectionsData.map((user) => (
                            <div key={user._id} className='max-w-xl flex flex-wrap gap-5 p-6 bg-white shadow rounded-md'>
                                <img src={user.profile_picture} alt="" className='size-12 mx-auto rounded-full' />
                                <div className='flex-1'>
                                    <p className='font-medium text-slate-700'>{user.full_name}</p>
                                    <p className='text-slate-500'>@{user.username}</p>
                                    <p className='text-gray-600 text-sm'>{user.bio}</p>
                                </div>

                                <div className='flex flex-col gap-2 mt-4'>

                                    <button onClick={() => navigate(`/media/chat-box/${user._id}`)} className='size-10 flex items-center justify-center text-sm rounded bg-slate-100
                                    hover:bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer p-1'>
                                        <MessageSquare className='size-4' />
                                    </button>

                                    <button onClick={() => navigate(`/media/profile/${user._id}`)} className='size-10 flex items-center justify-center text-sm rounded bg-slate-100
                                    hover:bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer'>
                                        <Eye className='size-4' />
                                    </button>
                                </div>
                                
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Messages;