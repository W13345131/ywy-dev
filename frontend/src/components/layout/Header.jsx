import React from 'react'
import { useAuth } from '../../context/AuthContent'
import { Menu, Bell, User } from 'lucide-react'
import { Link } from 'react-router-dom'


// 应用顶部导航栏（Header 组件）
function Header({ toggleSidebar }) {

  // 获取当前用户信息
  const { user } = useAuth();  

  return <header className='sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur-xl 
  border-b border-slate-200/60'>
    <div className='flex items-center justify-between h-full px-6'>
        {/* 移动端菜单按钮（仅在小屏幕上可见） */}
        <button
        onClick={toggleSidebar}
        // 在小屏幕上显示菜单按钮
        className='md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 
        hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 cursor-pointer'
        // aria-label表示：切换侧边栏
        aria-label='Toggle Sidebar'
        >
            <Menu size={24} />
        </button>

        {/* 在较大屏幕上隐藏菜单按钮 */}
        <div className='hidden md:block'></div>

        <div className='flex items-center gap-3'>
            {/* 用户个人资料 */}
            <Link to='/profile'>
            <div className='flex items-center gap-3'>
                <div className='flex items-center gap-3 py-1.5 px-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 cursor-pointer group'>
                    <div className='w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 
                    flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:shadow-lg 
                    group-hover:shadow-emerald-500/30 transition-all duration-200'>
                        {/* 如果用户有头像，则显示头像；否则显示用户图标 */}
                        {user?.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt='Avatar' className='w-full h-full object-cover' />
                        ) : (
                            <User size={18} strokeWidth={2.5} className='text-white' />
                        )}
                    </div>
                    <div>
                        <p className='text-sm font-semibold text-slate-900'>
                            {user?.username || 'ywyplus'}
                        </p>
                        <p className='text-xs text-slate-500'>
                            {user?.email || 'ywy0701@outlook.com'}
                        </p>
                    </div>
                </div>
            </div>
            </Link>
        </div>
    </div>
    </header>
}

export default Header