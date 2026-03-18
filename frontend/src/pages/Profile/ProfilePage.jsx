import React, { useState, useEffect, useRef } from 'react'
import { User, Mail, Lock, Camera } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import authService from '../../services/authService'
import { useAuth } from '../../context/AuthContent'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'



function ProfilePage() {

  const [loading, setLoading] = useState(true);
  // 用来存储密码修改状态
  const [passwordloading, setPasswordloading] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  // 用来存储头像 URL
  const [profileImageUrl, setProfileImageUrl] = useState('');
  // 用来存储头像加载状态
  const [avatarLoading, setAvatarLoading] = useState(false);
  // 用来存储文件输入框引用
  const fileInputRef = useRef(null);
  // 用来更新用户信息
  const { updateUser } = useAuth();
  // 用来存储当前密码
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 调用 authService 的 getProfile 方法，获取用户信息
        const res = await authService.getProfile();
        // 把获取到的数据设置到 user 中
        const user = res?.data ?? res;
        // 把用户名设置到 username 中
        setUsername(user?.username ?? '');
        // 把邮箱设置到 email 中
        setEmail(user?.email ?? '');
        // 把头像我设置到 profileImageUrl 中
        setProfileImageUrl(user?.profileImageUrl ?? '');
      } catch (error) {
        // 显示错误信息
        toast.error('Failed to fetch user info');
        // 打印错误信息
        console.error(error);
      } finally {
        // 请求结束后：页面停止 loading。
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  // 处理头像上传
  const handleAvatarChange = async (e) => {
    // 获取上传的第一个文件
    const file = e.target.files?.[0];
    // 如果文件不存在，则返回
    if (!file) return;
    // 如果文件不是图片，则提示用户选择图片
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (jpg, png, gif, etc.)');
      return;
    }
    // 设置头像加载状态为正在加载
    setAvatarLoading(true);
    // 调用 authService 的 uploadAvatar 方法，上传头像
    try {
      const res = await authService.uploadAvatar(file);
      // 把获取到的头像 URL 设置到 profileImageUrl 中
      const newAvatarUrl = res?.profileImageUrl ?? res?.data?.profileImageUrl ?? '';
      // 把头像 URL 设置到 profileImageUrl 中
      setProfileImageUrl(newAvatarUrl);
      // 更新用户信息
      updateUser({ profileImageUrl: newAvatarUrl });
      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error(error?.error || error?.message || 'Failed to upload avatar');
    } finally {
      setAvatarLoading(false);
      e.target.value = '';
    }
  };

  // 处理密码修改提交
  const handlePasswordSubmit = async (e) => {
    // 阻止表单默认提交行为
    e.preventDefault();
    // 如果新密码和确认密码不匹配，则显示错误信息
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    // 设置密码修改状态为正在修改
    setPasswordloading(true);
    
    try {
      // 调用 authService 的 changePassword 方法，修改密码
      await authService.changePassword({ oldPassword: currentPassword, newPassword });
      // 显示成功信息
      toast.success('Password changed successfully');
      // 清空密码输入框
      setCurrentPassword('');
      // 清空新密码输入框
      setNewPassword('');
      // 清空确认密码输入框
      setConfirmPassword('');
    } catch (error) {
      toast.error(error?.error || error?.message || 'Failed to change password');
    } finally {
      setPasswordloading(false);
    }
  };

  // 如果正在加载数据，则显示加载状态
  if (loading) {
    return <Spinner />
  }

  return (
    <div>
      {/* 页面头部 */}
      <PageHeader title='Profile Settings' />

      <div className='space-y-8'>
        {/* 头像上传 */}
        <div className='bg-white border border-neutral-200 rounded-xl p-6'>
          <h3 className='text-lg font-medium text-neutral-900 mb-4'>
            Profile Photo
          </h3>
          <div className='flex items-center gap-6'>
            <div className='relative group'>
              <div className='w-24 h-24 rounded-full overflow-hidden bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center'>
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt='Avatar'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <User className='w-12 h-12 text-neutral-400' />
                )}
              </div>
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed'
              >
                <Camera className='w-8 h-8 text-white' />
              </button>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleAvatarChange}
                className='hidden'
              />
              <Button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
              >
                {avatarLoading ? 'Uploading...' : 'Upload Photo'}
              </Button>
              <p className='text-xs text-neutral-500 mt-2'>
                JPG, PNG. Max 10MB.
              </p>
            </div>
          </div>
        </div>

        {/* User Information Display */}
        <div className='bg-white border border-neutral-200 rounded-xl p-6'>
          <h3 className='text-lg font-medium text-neutral-900 mb-4'>
            User Information
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-xs font-medium text-neutral-700 mb-1.5'>
                Username
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-4 w-4 text-neutral-400' />
                </div>
                <p className='w-full h-9 pl-10 pr-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900'>
                  {username || '—'}
                </p>
              </div>
            </div>
            <div>
              <label className='block text-xs font-medium text-neutral-700 mb-1.5'>
                Email Address
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-4 w-4 text-neutral-400' />
                </div>
                <p className='w-full h-9 pl-10 pr-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900'>
                  {email || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className='bg-white border border-neutral-200 rounded-xl p-6'>
          <h3 className='text-lg font-semibold text-neutral-900 mb-4'>
            Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit} className='space-y-4'>
            <div>
              <label htmlFor="current-password" className='block text-xs font-medium text-neutral-700 mb-1.5'>
                Current Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-4 w-4 text-neutral-400' />
                </div>
                <input 
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className='w-full h-9 pl-10 pr-3 py-2 border border-neutral-200 rounded-lg bg-white text-sm 
                  text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 
                  focus:ring-[#00d492] focus:border-transparent transition-colors duration-150'
                />
              </div>
            </div>
            <div>
              <label htmlFor="new-password" className='block text-xs font-medium text-neutral-700 mb-1.5'>
                New Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-4 w-4 text-neutral-400' />
                </div>
                <input 
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className='w-full h-9 pl-10 pr-3 py-2 border border-neutral-200 rounded-lg bg-white text-sm 
                  text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 
                  focus:ring-[#00d492] focus:border-transparent transition-colors duration-150'
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className='block text-xs font-medium text-neutral-700 mb-1.5'>
                Confirm New Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-4 w-4 text-neutral-400' />
                </div>
                <input 
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className='w-full h-9 pl-10 pr-3 py-2 border border-neutral-200 rounded-lg bg-white text-sm 
                  text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 
                  focus:ring-[#00d492] focus:border-transparent transition-colors duration-150'
                />
              </div>
            </div>
            <div className='flex justify-end'>
              <Button 
                type='submit' 
                // 如果正在修改密码，则禁用按钮
                disabled={passwordloading} 
                className=''
              >
                {/* // 如果正在修改密码，则显示“正在修改...” */}
                {/* // 否则显示“修改密码” */}
                {passwordloading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage