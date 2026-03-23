import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, User as UserIcon } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const ProfileModal = ({ user, setShowEdit, onUpdated }) => {

    const [editForm, setEditForm] = useState({
        username: '',
        bio: '',
        location: '',
        profile_picture: null,
        cover_photo: null,
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!user) return;
        setEditForm({
            username: user.username || '',
            bio: user.bio || '',
            location: user.location || '',
            profile_picture: null,
            cover_photo: null,
        });
    }, [user]);

    const profilePreview = useMemo(() => {
        if (editForm.profile_picture) {
            return URL.createObjectURL(editForm.profile_picture);
        }
        return user?.profile_picture || '';
    }, [editForm.profile_picture, user?.profile_picture]);

    const coverPreview = useMemo(() => {
        if (editForm.cover_photo) {
            return URL.createObjectURL(editForm.cover_photo);
        }
        return user?.cover_photo || '';
    }, [editForm.cover_photo, user?.cover_photo]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('username', editForm.username.trim());
            formData.append('bio', editForm.bio);
            formData.append('location', editForm.location);

            if (editForm.profile_picture) {
                formData.append('profileImageUrl', editForm.profile_picture);
            }

            if (editForm.cover_photo) {
                formData.append('coverImageUrl', editForm.cover_photo);
            }

            const res = await axiosInstance.put(API_PATHS.MEDIA.UPDATE_USER, formData);
            const updatedUser = res?.data?.data;

            onUpdated?.(updatedUser);
            setShowEdit(false);
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }


    return (
        <div className='fixed inset-0 z-110 h-screen overflow-y-scroll bg-black/50'>
            <div className='max-w-2xl sm:py-6 mx-auto'>
                <div className='bg-white rounded-lg shadow p-6'>
                    <h1 className='text-2xl font-bold text-gray-900 mb-6'>Edit Profile</h1>

                    <form action="" className='space-y-4' onSubmit={handleSaveProfile}>
                        {/* Profile Picture */}
                        <div className='flex flex-col items-start gap-3'>
                            <label className='block text-sm font-medium text-gray-700 mb-1 cursor-pointer'>
                                Profile Picture
                                <input type="file" accept='image/*' id='profile_picture' hidden
                                className='w-full p-3 border border-gray-200 rounded-lg'
                                onChange={(e) => setEditForm({ ...editForm, profile_picture: e.target.files[0] })}
                                />

                                <div className='group/profile relative'>
                                {profilePreview ? (
                                    <img 
                                    src={profilePreview}
                                    className='size-24 rounded-full object-cover mt-2'
                                    />
                                ) : (
                                    <div className='size-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mt-2'>
                                        <UserIcon className='size-10' />
                                    </div>
                                )}

                                <div className='absolute hidden group-hover/profile:flex inset-0 bg-black/20 rounded-full items-center justify-center'>
                                    <Pencil className='size-5 text-white' />
                                </div>
                                </div>
                            </label>
                        </div>

                        {/* Cover Photo */}
                        <div className='flex flex-col items-start gap-3'>
                            <label htmlFor="cover_photo" className='block text-sm font-medium text-gray-700 mb-1 cursor-pointer'>
                                Cover Picture
                                <input type="file" accept='image/*' id='cover_photo' hidden
                                className='w-full p-3 border border-gray-200 rounded-lg'
                                onChange={(e) => setEditForm({ ...editForm, cover_photo: e.target.files[0] })}
                                />
                                <div className='group/cover relative'>
                                    {coverPreview ? (
                                        <img src={coverPreview} alt="" 
                                        className='w-80 h-40 rounded-lg object-cover mt-2'
                                        />
                                    ) : (
                                        <div className='w-80 h-40 rounded-lg mt-2' />
                                    )}
                                    <div className='absolute hidden group-hover/cover:flex inset-0 bg-black/20 rounded-lg items-center justify-center'>
                                        <Pencil className='size-5 text-white' />
                                    </div>
                                </div>
                            </label>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Username
                            </label>
                            <input type="text" className='w-full p-3 border border-gray-200 rounded-lg'
                            placeholder='Please enter your username'
                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                            value={editForm.username}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Bio
                            </label>
                            <textarea rows={3} className='w-full p-3 border border-gray-200 rounded-lg'
                            placeholder='Please enter your bio'
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            value={editForm.bio}
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Location
                            </label>
                            <input type="text" className='w-full p-3 border border-gray-200 rounded-lg'
                            placeholder='Please enter your location'
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            value={editForm.location}
                            />
                        </div>

                        <div className='flex justify-end space-x-3 pt-6'>
                            <button onClick={() => setShowEdit(false)} type='button' className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer'>Cancel</button>
                            <button disabled={submitting} type='submit' className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer text-white'>Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;