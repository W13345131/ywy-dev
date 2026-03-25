import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, User as UserIcon } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import authService from '../../services/authService';

const ProfileModal = ({ user, setShowEdit, onUpdated }) => {

    // 编辑表单
    const [editForm, setEditForm] = useState({
        username: '',
        bio: '',
        location: '',
        profile_picture: null,
        cover_photo: null,
    });

    // 提交状态
    const [submitting, setSubmitting] = useState(false);
    // 密码加载状态
    const [passwordLoading, setPasswordLoading] = useState(false);
    // 密码表单
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // 组件挂载时，设置编辑表单
    useEffect(() => {
        if (!user) return;
        // 设置编辑表单
        setEditForm({
            username: user.username || '',
            bio: user.bio || '',
            location: user.location || '',
            profile_picture: null,
            cover_photo: null,
        });
    }, [user]);

    // 用户头像预览
    const profilePreview = useMemo(() => {
        // 如果编辑表单中的用户头像存在，则返回用户头像的URL
        if (editForm.profile_picture) {
            // 返回用户头像的URL
            return URL.createObjectURL(editForm.profile_picture);
        }
        // 如果编辑表单中的用户头像不存在，则返回用户头像的URL
        return user?.profile_picture || '';
    }, [editForm.profile_picture, user?.profile_picture]);

    // 封面照片预览
    const coverPreview = useMemo(() => {
        // 如果编辑表单中的封面照片存在，则返回封面照片的URL
        if (editForm.cover_photo) {
            // 返回封面照片的URL
            return URL.createObjectURL(editForm.cover_photo);
        }
        // 如果编辑表单中的封面照片不存在，则返回封面照片的URL
        return user?.cover_photo || '';
    }, [editForm.cover_photo, user?.cover_photo]);

    // 处理保存用户信息
    const handleSaveProfile = async (e) => {
        // 阻止默认行为
        e.preventDefault();
        try {
            // 设置提交状态为true
            setSubmitting(true);
            // 创建 FormData 对象
            const formData = new FormData();
            // 添加用户名
            formData.append('username', editForm.username.trim());
            // 添加用户简介
            formData.append('bio', editForm.bio);
            // 添加用户位置
            formData.append('location', editForm.location);

            // 如果编辑表单中的用户头像存在，则添加用户头像
            if (editForm.profile_picture) {
                // 添加用户头像
                formData.append('profileImageUrl', editForm.profile_picture);
            }

            // 如果编辑表单中的封面照片存在，则添加封面照片
            if (editForm.cover_photo) {
                // 添加封面照片
                formData.append('coverImageUrl', editForm.cover_photo);
            }

            // 调用 axiosInstance 的 put 方法，更新用户信息
            const res = await axiosInstance.put(API_PATHS.MEDIA.UPDATE_USER, formData);
            // 获取更新后的用户信息
            const updatedUser = res?.data?.data;

            // 调用 onUpdated 回调函数，更新用户信息
            onUpdated?.(updatedUser);
            // 设置显示编辑弹窗为false
            setShowEdit(false);
        } catch (error) {
            // 打印错误信息
            console.error(error);
            // 设置提交状态为false
        } finally {
            setSubmitting(false);
        }
    }

    // 处理修改密码
    const handleChangePassword = async (e) => {
        // 阻止默认行为
        e.preventDefault();

        // 如果当前密码、新密码、确认密码不存在，则返回
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            return;
        }

        // 如果新密码和确认密码不匹配，则返回
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return;
        }

        try {
            // 设置密码加载状态为true
            setPasswordLoading(true);
            // 调用 authService 的 changePassword 方法，修改密码
            await authService.changePassword({
                // 添加旧密码
                oldPassword: passwordForm.currentPassword,
                // 添加新密码
                newPassword: passwordForm.newPassword,
            });

            // 清空密码表单
            setPasswordForm({
                // 清空当前密码
                currentPassword: '',
                // 清空新密码
                newPassword: '',
                // 清空确认密码
                confirmPassword: '',
            });
        } catch (error) {
            console.error(error);
        } finally {
            setPasswordLoading(false);
        }
    };


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

                    <div className='mt-8 border-t border-gray-200 pt-6'>
                        <h2 className='text-xl font-bold text-gray-900 mb-4'>Change Password</h2>
                        <form className='space-y-4' onSubmit={handleChangePassword}>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Current Password
                                </label>
                                <input
                                    type='password'
                                    className='w-full p-3 border border-gray-200 rounded-lg'
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    New Password
                                </label>
                                <input
                                    type='password'
                                    className='w-full p-3 border border-gray-200 rounded-lg'
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Confirm New Password
                                </label>
                                <input
                                    type='password'
                                    className='w-full p-3 border border-gray-200 rounded-lg'
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                />
                            </div>

                            <div className='flex justify-end'>
                                <button
                                    type='submit'
                                    // 如果密码加载状态为true，或者当前密码、新密码、确认密码不存在，则禁用按钮
                                    disabled={
                                        passwordLoading ||
                                        !passwordForm.currentPassword ||
                                        !passwordForm.newPassword ||
                                        !passwordForm.confirmPassword
                                    }
                                    className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer text-white disabled:opacity-50'
                                >
                                    {passwordLoading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;