import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import UserCard from '../../components/Media/UserCard';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Discover = () => {

    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [connectionState, setConnectionState] = useState({
        connectedIds: [],
        pendingIncomingIds: [],
        pendingSentIds: [],
    });

    const fetchUsers = async (searchInput = '') => {
        try {
            setLoading(true);
            const [discoverRes, connectionsRes] = await Promise.all([
                axiosInstance.get(API_PATHS.MEDIA.DISCOVER_USERS, {
                    params: { input: searchInput },
                }),
                axiosInstance.get(API_PATHS.MEDIA.GET_CONNECTIONS),
            ]);

            const connectionData = connectionsRes?.data?.data || {};
            setConnectionState({
                connectedIds: (connectionData.connections || []).map((user) => user._id?.toString()),
                pendingIncomingIds: (connectionData.pendingConnections || []).map((user) => user._id?.toString()),
                pendingSentIds: (connectionData.sentPendingConnections || []).map((user) => user._id?.toString()),
            });

            const list = (discoverRes?.data?.data || []).map((user) => ({
                ...user,
                profile_picture: user.profileImageUrl || user.profile_picture || '',
                followers: user.followers || [],
                following: user.following || [],
                connections: user.connections || [],
            }));
            setUsers(list);
        } catch (err) {
            console.error(err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        if (e.key === 'Enter') {
            fetchUsers(input.trim());
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
            <div className='max-w-6xl mx-auto p-6'>

                {/* Title */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover People</h1>
                    <p className='text-slate-600'>Connect with amazing people and grow your network</p>
                </div>

                {/* Search Bar */}
                <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
                    <div className='p-6'>
                        <div className='relative'>
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5' />
                            <input type="text" placeholder='Search people by name, username, bio, or location...'
                            className='pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm'
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            onKeyUp={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                {/*  */}
                <div className='flex flex-wrap gap-6'>
                    {users.map((user) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            isConnected={connectionState.connectedIds.includes(user._id?.toString())}
                            isPendingConnection={
                                connectionState.pendingIncomingIds.includes(user._id?.toString()) ||
                                connectionState.pendingSentIds.includes(user._id?.toString())
                            }
                            onConnectionRequested={(userId) => {
                                setConnectionState((prev) => ({
                                    ...prev,
                                    pendingSentIds: prev.pendingSentIds.includes(userId)
                                        ? prev.pendingSentIds
                                        : [...prev.pendingSentIds, userId],
                                }));
                            }}
                        />
                    ))}
                </div>

                {
                    loading && (
                        <div className='text-center text-slate-500 py-10'>Loading...</div>
                    )
                }

                {!loading && users.length === 0 && (
                    <div className='text-center text-slate-500 py-10'>No users found</div>
                )}
            </div>
        </div>
    )
};

export default Discover;