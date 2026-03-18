import React from 'react'
import { Plus, User } from 'lucide-react'

function AvatarGroup({ avatars, maxVisible = 3 }) {
  return (
    <div className='flex items-center'>
        {
            // 遍历头像数组
            avatars.slice(0, maxVisible).map((avatar, index) => (
                // 如果头像存在，则显示头像
                avatar ? (
                // 显示头像
                <img
                 key={index}
                 // 头像 URL
                 src={avatar}
                 alt={`Avatar ${index}`}
                 // first:ml-0 表示第一个头像的左边距为 0
                 // -ml-3 表示每个头像的左边距为 -3px，让头像重合
                 className='w-9 h-9 rounded-full border-2 border-white object-cover -ml-3 first:ml-0'
                />
                ) : (
                // 如果头像不存在，则显示用户图标
                <div key={index} className='w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 bg-slate-300 flex items-center justify-center'>
                    <User size={18} strokeWidth={2.5} className='text-white' />
                </div>
                )
            ))
        }

        {
            // 如果头像数组长度大于最大显示数量，则显示加号
            avatars.length > maxVisible && (
                <div className='w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3'>
                    <Plus /> {avatars.length - maxVisible}
                </div>
            )
        }
    </div>
  )
}

export default AvatarGroup