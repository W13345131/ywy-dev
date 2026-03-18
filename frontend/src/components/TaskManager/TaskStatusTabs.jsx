import React from 'react'


// 显示任务状态的 Tabs（标签切换），并根据点击切换当前状态
// tabs	tab 列表数据
// activeTab	当前选中的 tab
// setActiveTab	用来切换 tab 的函数
function TaskStatusTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className='my-2'>
        <div className='flex'>
            {
              // 使用 .map() 遍历 tabs，为每一个 tab 生成一个 <button>
              // 设置按钮的 key、点击事件、样式
                tabs.map((tab) => (
                    <button
                      key={tab.label}
                      className={`relative px-3 md:px-4 py-2 text-sm font-medium ${
                        // 如果当前选中的 tab，则设置按钮的样式为蓝色
                        // 如果当前选中的 tab，则设置按钮的样式为灰色
                        activeTab === tab.label
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                      } cursor-pointer`}
                      // 点击按钮时，调用 setActiveTab 函数，切换当前状态
                      onClick={() => setActiveTab(tab.label)}
                    >
                        <div className='flex items-center'>
                            {/* 显示 tab 的文字 */}
                            <span className='text-xs'>
                                {tab.label}
                            </span>
                            <span
                              // 显示 tab 的计数
                              className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                                // 如果当前选中的 tab，则设置计数背景颜色为蓝色，文字颜色为白色
                                // 如果当前选中的 tab，则设置计数背景颜色为灰色，文字颜色为灰色
                                activeTab === tab.label
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200/70 text-gray-600'
                              }`}
                            >
                                {tab.count}
                            </span>
                        </div>

                        {
                          // 如果当前选中的 tab，则显示底部高亮线
                            activeTab === tab.label && (
                                <div className='absolute bottom-0 left-0 w-full h-0.5 bg-blue-600'>
                                </div>
                        )}
                    </button>
                ))
            }
        </div>
    </div>
  )
}

export default TaskStatusTabs