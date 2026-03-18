import React from 'react'

// 显示任务进度条
// progress	进度百分比
// status	任务状态
function Progress({ progress, status }) {

  const getColor = () => {
    // 根据任务状态，设置进度条颜色
    switch (status) {
        case 'In Progress':
            // 如果任务状态为 In Progress，则设置进度条颜色为蓝色
            return 'bg-cyan-500 bg-cyan-500 border border-cyan-500/10';
        case 'Completed':
            // 如果任务状态为 Completed，则设置进度条颜色为紫色
            return 'bg-indigo-500 bg-indigo-50 border border-indigo-500/20';
        default:
            // 如果任务状态为其他，则设置进度条颜色为灰色
            return 'bg-violet-500 bg-violet-50 border border-violet-500/10';
    }
  }

  return (
    // 显示进度条容器
    <div className='w-full bg-gray-200 rounded-full h-1.5'>
        {/* 显示进度条 */}
        <div className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium`} style={{ width: `${progress}%` }}>
        </div>
    </div>
  )
}

export default Progress