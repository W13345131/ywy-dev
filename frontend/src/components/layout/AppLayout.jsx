import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'


// 应用整体布局组件（AppLayout）
// children 表示：布局内部要渲染的页面内容
function AppLayout({children}) {

  // 控制侧边栏是否打开
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 切换侧边栏的函数
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className='flex h-screen bg-neutral-50 text-neutral-900'>
      {/* 侧边栏 */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* 头部 */}
        <Header toggleSidebar={toggleSidebar} />

        {/* 主内容区域 */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto p-6'>
          {/* 渲染页面内容 */}
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout