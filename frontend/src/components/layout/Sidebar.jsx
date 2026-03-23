import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContent'
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, BookOpen, User, X, LogOut, ChevronDown, ChevronRight, Wallet, AudioWaveform, FolderKanban, WalletMinimal, WalletCards, ClipboardCheck, SquareChartGantt, Linkedin, MessagesSquare, Users, Search, Pencil } from 'lucide-react'

// isSidebarOpen：侧边栏当前是否打开
// toggleSidebar：切换侧边栏的函数
function Sidebar({ isSidebarOpen, toggleSidebar }) {

  const { logout, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  // 使用 React Router 的 useNavigate 钩子，获取导航函数
  const navigate = useNavigate();
  // 使用 React Router 的 useLocation 钩子，获取当前路径
  const location = useLocation();
  // 使用正则表达式，判断当前路径是否属于 Media 路径
  const isMediaPath = /^\/media\/home(\/|$)/.test(location.pathname);
  // 使用正则表达式，判断当前路径是否属于 Task Manager 路径
  const isTaskManagerPath = /^\/admin\/task-manager(\/|$)/.test(location.pathname);
  // 使用正则表达式，判断当前路径是否属于 AI Learning 路径
  const isAILearningPath = /^\/(dashboard|documents|flashcards)(\/|$)/.test(location.pathname);
  // 使用正则表达式，判断当前路径是否属于 Expense Tracker 路径
  const isExpenseTrackerPath = /^\/expense-tracker(\/|$)/.test(location.pathname);


  // 使用 React 的 useState 钩子，管理 Media 子菜单是否展开
  const [mediaOpen, setMediaOpen] = useState(isMediaPath);
  // 使用 React 的 useState 钩子，管理 Task Manager 子菜单是否展开
  const [taskManagerOpen, setTaskManagerOpen] = useState(isTaskManagerPath);
  // 使用 React 的 useState 钩子，管理 AI Learning 子菜单是否展开
  const [aiLearningOpen, setAiLearningOpen] = useState(isAILearningPath);
  // 使用 React 的 useState 钩子，管理 Expense Tracker 子菜单是否展开
  const [expenseTrackerOpen, setExpenseTrackerOpen] = useState(isExpenseTrackerPath);

  // 处理退出登录的方法
  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  // 定义导航链接
  const navLinks = [
    // 个人资料链接
    // 使用 Lucide React 的 User 图标
    // 显示文本：Profile
    { to: '/profile', icon: User, text: 'Profile' },
  ]

  return <>
  {/* 移动端菜单遮罩 */}
  {/* 移动端侧边栏遮罩层（overlay / backdrop），当 Sidebar 打开时，它会在页面上显示一层半透明背景，并且 点击背景可以关闭 Sidebar */}
  <div className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300${
    // 当 Sidebar 打开时，透明度为 100%，否则透明度为 0%，并且鼠标事件不可用
    isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`}
  // 点击背景时关闭 Sidebar
  onClick={toggleSidebar}
  // aria-hidden='true' 表示：这个元素对屏幕阅读器不可见
  aria-hidden='true'
  >
  </div>
  {/* 侧边内容区域 */}
  <aside
  className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-lg border-r border-slate-200/60 z-50 md:relative md:shrink-0 md:flex md:flex-col 
    md:translate-x-0 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
    >
        {/* 移动端侧边栏的顶部区域，包含 Logo 和关闭按钮 */}
        <div className='flex items-center justify-between h-16 px-5 border-b border-slate-200/60'>
            <div className='flex items-center gap-3'>
                <div className='flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br
                from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/20'>
                    {/* 使用 Lucide React 的 BrainCircuit 图标 */}
                    <AudioWaveform size={20} strokeWidth={2.5} className='text-white' />
                </div>
                <h1 className='text-sm md:text-base font-bold text-slate-900 tracking-tight'>Ywy Dev</h1>
            </div>
            <button
            onClick={toggleSidebar}
            className='md:hidden text-slate-500 hover:text-slate-800'
            >
              {/* 使用 Lucide React 的 X 图标 */}
              <X size={24} />
            </button>
        </div>

        {/* 导航链接 */}
        <nav className='flex-1 px-3 py-6 space-y-1.5 overflow-y-auto'>

            {/* Media（父级菜单，包含子菜单） */}
            <div className='space-y-1'>
                <div className='flex items-center'>
                    {/* 使用 React Router 的 NavLink 组件，创建一个导航链接 */}
                    <NavLink
                      to='/media/home'
                      onClick={toggleSidebar}
                      // isActive：表示当前路径是否与导航链接的 to 属性匹配
                      className={({ isActive }) => {
                        // active：表示当前路径是否与导航链接的 to 属性匹配，或者是否属于 AI Learning 路径
                        const active = isActive || isMediaPath;
                        // 返回一个字符串，表示导航链接的样式
                        return `flex-1 group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                          // 如果 active 为 true，则使用绿色渐变背景，否则使用灰色背景
                          active
                            ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                        }`;
                      }}
                    >
                      {({ isActive }) => {
                        const active = isActive || isMediaPath;
                        return (
                        <>
                          {/* 使用 Lucide React 的 Linkedin 图标 */}
                          <Linkedin size={18} strokeWidth={2.5} className='shrink-0' />
                          <span className='flex-1 text-left'>Media</span>
                          <button
                            type='button'
                            // 点击按钮时，切换 Media 子菜单的展开状态
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMediaOpen((o) => !o); }}
                            className='shrink-0 p-0.5 rounded hover:bg-white/20 cursor-pointer'
                            // aria-label：表示按钮的辅助文本
                            // mediaOpen 为 true，则辅助文本为 'Collapse'，否则为 'Expand'
                            // Collapse：折叠
                            // Expand：展开
                            aria-label={mediaOpen ? 'Collapse' : 'Expand'}
                          >
                            {/* 如果 mediaOpen 为 true，则显示向下箭头，否则显示向右箭头 */}
                            {mediaOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        </>
                        );
                      }}
                    </NavLink>
                </div>
                {/* 如果 mediaOpen 为 true，则显示子菜单 */}
                {mediaOpen && (
                  <div className='pl-4 ml-2 border-l border-slate-200 space-y-0.5'>
                    <NavLink
                      // 使用 React Router 的 NavLink 组件，创建一个导航链接（Messages 菜单跳转到 ChatBox 区域）
                      to='/media/chat-box'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          // isActive：表示当前路径是否与导航链接的 to 属性匹配
                          isActive 
                            // 如果 isActive 为 true，则使用绿色背景，否则使用灰色背景
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      {/* 使用 Lucide React 的 MessagesSquare 图标 */}
                      <MessagesSquare size={16} strokeWidth={2} className='shrink-0' />
                      <span>Messages</span>
                    </NavLink>


                    <NavLink
                      to='/media/connections'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <Users size={16} strokeWidth={2} className='shrink-0' />
                      <span>Connections</span>
                    </NavLink>

                    <NavLink
                      to='/media/discover'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <Search size={16} strokeWidth={2} className='shrink-0' />
                      <span>Discover</span>
                    </NavLink>

                      <NavLink
                        to='/media/profile'
                        onClick={toggleSidebar}
                        className={({ isActive }) =>
                          `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`
                        }
                      >
                        <User size={16} strokeWidth={2} className='shrink-0' />
                        <span>Profile</span>
                      </NavLink>

                    <NavLink
                      to='/media/create-post'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <Pencil size={16} strokeWidth={2} className='shrink-0' />
                      <span>Create Post</span>
                    </NavLink>
                  </div>
                )}
            </div>
            

            {/* Task Manager（仅 admin 显示） */}
            {isAdmin && (
            <div className='space-y-1'>
                <div className='flex items-center'>
                    {/* 使用 React Router 的 NavLink 组件，创建一个导航链接 */}
                    <NavLink
                      to='/admin/task-manager'
                      onClick={toggleSidebar}
                      // isActive：表示当前路径是否与导航链接的 to 属性匹配
                      className={({ isActive }) => {
                        // active：表示当前路径是否与导航链接的 to 属性匹配，或者是否属于 AI Learning 路径
                        const active = isActive || isTaskManagerPath;
                        // 返回一个字符串，表示导航链接的样式
                        return `flex-1 group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                          // 如果 active 为 true，则使用绿色渐变背景，否则使用灰色背景
                          active
                            ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                        }`;
                      }}
                    >
                      {({ isActive }) => {
                        const active = isActive || isTaskManagerPath;
                        return (
                        <>
                          {/* 使用 Lucide React 的 LayoutDashboard 图标 */}
                          <FolderKanban size={18} strokeWidth={2.5} className='shrink-0' />
                          <span className='flex-1 text-left'>Task Manager</span>
                          <button
                            type='button'
                            // 点击按钮时，切换 AI Learning 子菜单的展开状态
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTaskManagerOpen((o) => !o); }}
                            className='shrink-0 p-0.5 rounded hover:bg-white/20 cursor-pointer'
                            // aria-label：表示按钮的辅助文本
                            // aiLearningOpen 为 true，则辅助文本为 'Collapse'，否则为 'Expand'
                            // Collapse：折叠
                            // Expand：展开
                            aria-label={taskManagerOpen ? 'Collapse' : 'Expand'}
                          >
                            {/* 如果 aiLearningOpen 为 true，则显示向下箭头，否则显示向右箭头 */}
                            {taskManagerOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        </>
                        );
                      }}
                    </NavLink>
                </div>
                {/* 如果 taskManagerOpen 为 true，则显示子菜单 */}
                {taskManagerOpen && (
                  <div className='pl-4 ml-2 border-l border-slate-200 space-y-0.5'>
                    <NavLink
                      // 使用 React Router 的 NavLink 组件，创建一个导航链接
                      to='/admin/task-manager/create-task'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          // isActive：表示当前路径是否与导航链接的 to 属性匹配
                          isActive 
                            // 如果 isActive 为 true，则使用绿色背景，否则使用灰色背景
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      {/* 使用 Lucide React 的 ClipboardCheck 图标 */}
                      <ClipboardCheck size={16} strokeWidth={2} className='shrink-0' />
                      <span>Create Task</span>
                    </NavLink>
                    <NavLink
                      to='/admin/task-manager/manage-task'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <SquareChartGantt size={16} strokeWidth={2} className='shrink-0' />
                      <span>Manage Tasks</span>
                    </NavLink>
                    <NavLink
                      to='/admin/task-manager/team-members'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <SquareChartGantt size={16} strokeWidth={2} className='shrink-0' />
                      <span>Team Members</span>
                    </NavLink>
                  </div>
                )}
            </div>
            )}

            {/* Task Manager（仅 member 显示） */}
            {!isAdmin && (
            <div className='space-y-1'>
                <div className='flex items-center'>
                    {/* 使用 React Router 的 NavLink 组件，创建一个导航链接 */}
                    <NavLink
                      to='/user/task-manager'
                      onClick={toggleSidebar}
                      // isActive：表示当前路径是否与导航链接的 to 属性匹配
                      className={({ isActive }) => {
                        // active：表示当前路径是否与导航链接的 to 属性匹配，或者是否属于 AI Learning 路径
                        const active = isActive || isTaskManagerPath;
                        // 返回一个字符串，表示导航链接的样式
                        return `flex-1 group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                          // 如果 active 为 true，则使用绿色渐变背景，否则使用灰色背景
                          active
                            ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                        }`;
                      }}
                    >
                      {({ isActive }) => {
                        const active = isActive || isTaskManagerPath;
                        return (
                        <>
                          {/* 使用 Lucide React 的 LayoutDashboard 图标 */}
                          <FolderKanban size={18} strokeWidth={2.5} className='shrink-0' />
                          <span className='flex-1 text-left'>Task Manager</span>
                          <button
                            type='button'
                            // 点击按钮时，切换 AI Learning 子菜单的展开状态
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTaskManagerOpen((o) => !o); }}
                            className='shrink-0 p-0.5 rounded hover:bg-white/20 cursor-pointer'
                            // aria-label：表示按钮的辅助文本
                            // aiLearningOpen 为 true，则辅助文本为 'Collapse'，否则为 'Expand'
                            // Collapse：折叠
                            // Expand：展开
                            aria-label={taskManagerOpen ? 'Collapse' : 'Expand'}
                          >
                            {/* 如果 aiLearningOpen 为 true，则显示向下箭头，否则显示向右箭头 */}
                            {taskManagerOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        </>
                        );
                      }}
                    </NavLink>
                </div>
                {/* 如果 taskManagerOpen 为 true，则显示子菜单 */}
                {taskManagerOpen && (
                  <div className='pl-4 ml-2 border-l border-slate-200 space-y-0.5'>
                    <NavLink
                      to='/user/task-manager/my-tasks'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <SquareChartGantt size={16} strokeWidth={2} className='shrink-0' />
                      <span>My Tasks</span>
                    </NavLink>
                  </div>
                )}
            </div>
            )}

            {/* AI Learning（父级菜单，包含子菜单） */}
            <div className='space-y-1'>
                <div className='flex items-center'>
                    {/* 使用 React Router 的 NavLink 组件，创建一个导航链接 */}
                    <NavLink
                      to='/dashboard'
                      onClick={toggleSidebar}
                      // isActive：表示当前路径是否与导航链接的 to 属性匹配
                      className={({ isActive }) => {
                        // active：表示当前路径是否与导航链接的 to 属性匹配，或者是否属于 AI Learning 路径
                        const active = isActive || isAILearningPath;
                        // 返回一个字符串，表示导航链接的样式
                        return `flex-1 group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                          // 如果 active 为 true，则使用绿色渐变背景，否则使用灰色背景
                          active
                            ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                        }`;
                      }}
                    >
                      {({ isActive }) => {
                        const active = isActive || isAILearningPath;
                        return (
                        <>
                          {/* 使用 Lucide React 的 LayoutDashboard 图标 */}
                          <LayoutDashboard size={18} strokeWidth={2.5} className='shrink-0' />
                          <span className='flex-1 text-left'>AI Learning</span>
                          <button
                            type='button'
                            // 点击按钮时，切换 AI Learning 子菜单的展开状态
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAiLearningOpen((o) => !o); }}
                            className='shrink-0 p-0.5 rounded hover:bg-white/20 cursor-pointer'
                            // aria-label：表示按钮的辅助文本
                            // aiLearningOpen 为 true，则辅助文本为 'Collapse'，否则为 'Expand'
                            // Collapse：折叠
                            // Expand：展开
                            aria-label={aiLearningOpen ? 'Collapse' : 'Expand'}
                          >
                            {/* 如果 aiLearningOpen 为 true，则显示向下箭头，否则显示向右箭头 */}
                            {aiLearningOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        </>
                        );
                      }}
                    </NavLink>
                </div>
                {/* 如果 aiLearningOpen 为 true，则显示子菜单 */}
                {aiLearningOpen && (
                  <div className='pl-4 ml-2 border-l border-slate-200 space-y-0.5'>
                    <NavLink
                      // 使用 React Router 的 NavLink 组件，创建一个导航链接
                      to='/documents'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          // isActive：表示当前路径是否与导航链接的 to 属性匹配
                          isActive 
                            // 如果 isActive 为 true，则使用绿色背景，否则使用灰色背景
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      {/* 使用 Lucide React 的 FileText 图标 */}
                      <FileText size={16} strokeWidth={2} className='shrink-0' />
                      <span>Documents</span>
                    </NavLink>
                    <NavLink
                      to='/flashcards'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <BookOpen size={16} strokeWidth={2} className='shrink-0' />
                      <span>Flashcards</span>
                    </NavLink>
                  </div>
                )}
            </div>

            {/* Expense Tracker（父级菜单，包含子菜单） */}
            <div className='space-y-1'>
                <div className='flex items-center'>
                    {/* 使用 React Router 的 NavLink 组件，创建一个导航链接 */}
                    <NavLink
                      to='/expense-tracker'
                      onClick={toggleSidebar}
                      className={({ isActive }) => {
                        const active = isActive || isExpenseTrackerPath;
                        return `flex-1 group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                          active
                            ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                        }`;
                      }}
                    >
                      {({ isActive }) => {
                        const active = isActive || isExpenseTrackerPath;
                        return (
                        <>
                          <Wallet size={18} strokeWidth={2.5} className='shrink-0' />
                          <span className='flex-1 text-left'>Expense Tracker</span>
                          <button
                            type='button'
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpenseTrackerOpen((o) => !o); }}
                            className='shrink-0 p-0.5 rounded hover:bg-white/20 cursor-pointer'
                            aria-label={expenseTrackerOpen ? 'Collapse' : 'Expand'}
                          >
                            {/* 如果 expenseTrackerOpen 为 true，则显示向下箭头，否则显示向右箭头 */}
                            {expenseTrackerOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        </>
                        );
                      }}
                    </NavLink>
                </div>
                {expenseTrackerOpen && (
                  <div className='pl-4 ml-2 border-l border-slate-200 space-y-0.5'>
                    <NavLink
                      to='/expense-tracker/income'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <WalletMinimal size={16} strokeWidth={2} className='shrink-0' />
                      <span>Income</span>
                    </NavLink>
                    <NavLink
                      to='/expense-tracker/expense'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <WalletCards size={16} strokeWidth={2} className='shrink-0' />
                      <span>Expense</span>
                    </NavLink>
                  </div>
                )}
            </div>

            {/* 个人资料链接 */}
            {navLinks.map((link) => (
                <NavLink
                // key：表示导航链接的唯一标识
                key={link.to}
                // to：表示导航链接的跳转路径
                to={link.to}
                // onClick：表示点击导航链接时执行的函数
                onClick={toggleSidebar}
                className={({ isActive }) => 
                    `group flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`
                }
                >
                    {({ isActive }) => (
                        <>
                        <link.icon
                        size={18}
                        strokeWidth={2.5}
                        className={`transtion-transform durations-200 ${
                            // 如果 isActive 为 true，则不进行缩放，否则进行缩放
                            isActive
                              ? ''
                              : 'group-hover:scale-110'
                        }`}
                        />
                        {/* 显示文本 */}
                        {link.text}
                        </>
                    )}
                </NavLink>
            ))}
        </nav>

        {/* Logout Button */}
        <div className='px-3 py-4 border-t border-slate-200/60'>
            <button
            onClick={handleLogout}
            className='cursor-pointer group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-slate-700 
            hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200'
            >
                <LogOut
                size={18}
                strokeWidth={2.5}
                className='transtion-transform durations-200 group-hover:scale-110'
                />
                Logout
            </button>
        </div>
    </aside>
  </>
}

export default Sidebar