import React from 'react'
import Progress from '../Progress';
import AvatarGroup from '../AvatarGroup';
import moment from 'moment';
import { Paperclip } from 'lucide-react';


// 任务卡片组件
// title	任务标题
// description	任务描述
// priority	任务优先级
// status	任务状态
// progress	任务进度
// createdAt	创建时间
// dueDate	截止日期
// assignedTo	指派给
// attachmentCount	附件数量
// completedTodoCount	完成待办数量
// todoChecklist	待办清单
// onClick	点击事件
function TaskCard({ title, description, priority, status, progress, createdAt, dueDate, assignedTo, attachmentCount, completedTodoCount, todoChecklist, onClick }) {
  
    // 获取状态标签颜色
    const getStatusTagColor = () => {
        switch (status) {
            case 'In Progress':
                return 'text-cyan-500 border-cyan-50 border border-cyan-500/10';
            case 'Completed':
                return 'text-lime-500 border-lime-50 border border-lime-500/20';
            default:
                return 'text-violet-500 bg-violet-50 border border-violet-500/10';
        }
    }

    // 获取优先级标签颜色
    const getPriorityTagColor = () => {
        switch (priority) {
            case 'Low':
                return 'text-emerald-500 bg-emerald-50 border border-emerald-500/10';
            case 'Medium':
                return 'text-amber-500 bg-amber-50 border border-amber-500/10';
            default:
                return 'text-rose-500 bg-rose-50 border border-rose-500/10';
        }
    }
  
    return (
    <div
      className='bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer'
      onClick={onClick}
    >
        <div className='flex items-end gap-3 px-4'>
            <div className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
                {status}
            </div>
            <div className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}>
                {priority} Priority
            </div>
        </div>

        {/* 显示任务卡片内容 */}
        <div
          className={`px-4 border-l-[3px] ${
            status === 'In Progress'
              ? 'border-cyan-500'
              : status === 'Completed'
              ? 'border-indigo-500'
              : 'border-violet-500'
          }`}
        >
            <p className='text-sm font-medium text-gray-800 mt-4 line-clamp-2'>
                {title}
            </p>
            <p className='text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]'>
                {description}
            </p>
            <p className='text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]'>
                Task Done: {""}
                {/* 显示完成待办数量 / 总待办数量 */}
                <span className='font-semibold text-gray-700'>
                    {completedTodoCount} / {todoChecklist?.length || 0}
                </span>
            </p>
            {/* 显示任务进度条 */}
            <Progress
              progress={progress}
              status={status}
            />
        </div>


        {/* 显示任务卡片底部信息 */}
        <div className='px-4'>
            {/* 显示开始日期 */}
            <div className='flex items-center justify-between my-1'>
                <div >
                    <label htmlFor="" className='text-xs text-gray-500'>
                        Start Date
                    </label>
                    <p className='text-[13px] font-medium text-gray-900'>
                        {moment(createdAt).format('Do MMM YYYY')}
                    </p>
                </div>

                <div >
                    <label htmlFor="" className='text-xs text-gray-500'>
                        Due Date
                    </label>
                    <p className='text-[13px] font-medium text-gray-900'>
                        {moment(dueDate).format('Do MMM YYYY')}
                    </p>
                </div>
            </div>

            {/* 显示指派给和附件数量 */}
            <div className='flex items-center justify-between mt-3'>

                <AvatarGroup
                  avatars={assignedTo || []}
                />

                {
                    // 如果附件数量大于0，则显示附件数量
                    attachmentCount > 0 && (
                        <div className='flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg'>
                            <Paperclip className='text-blue-600' />{" "}
                            <span className='text-xs text-gray-900'>
                                {attachmentCount} Attachments
                            </span>
                        </div>
                    )
                }
            </div>
        </div>
    </div>
  )
}

export default TaskCard