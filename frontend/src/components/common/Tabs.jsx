import React from 'react'


// 点击不同的 tab，切换不同的内容区域
// tabs	所有 tab 的配置
// activeTab	当前选中的 tab
// setActiveTab	切换 tab 的函数
function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className='w-full'>
        <div className='relative border-b border-slate-100'>
            <nav className='flex gap-2'>
                {/* 遍历所有 tab，并创建一个按钮 */}
                {tabs.map((tab) => (
                    // 创建一个按钮，并设置按钮的 key、点击事件、样式
                    <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    // 设置按钮的样式
                    className={`relative pb-4 px-2 md:px-6 text-sm font-semibold transition-all duration-200 ${
                        activeTab == tab.name
                        // 如果当前选中的 tab，则设置按钮的样式为绿色
                          ? 'text-emerald-600'
                        //   如果当前选中的 tab，则设置按钮的样式为灰色
                          : 'text-slate-600 hover:text-slate-900'
                    }`}
                    >
                        {/* 设置按钮的文字 */}
                        <span className='relative z-10'>{tab.label}</span>
                        {
                            // 激活 tab 的下划线,如果是当前 tab：显示底部高亮线
                            activeTab === tab.name && (
                                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r
                                from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/25' />
                            )    
                        }
                        {
                            // 给当前 tab 添加浅绿色背景
                            activeTab === tab.name && (
                                <div className='absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent
                                rounded-t-xl -z-10' />
                            )
                        }
                    </button>
                ))}
            </nav>
        </div>

        {/* 内容区域 */}
        <div className='py-6'>
            {tabs.map((tab) => {
                // 如果当前 tab 是选中的 tab，则显示当前 tab 的内容
                if (tab.name === activeTab) {
                    return (
                        <div key={tab.name} className='animate-in fade-in duration-300'>
                            {tab.content}
                        </div>
                    )
                }
                return null;
            })}
        </div>
    </div>
  )
}

export default Tabs