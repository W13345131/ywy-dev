import React from 'react'

import { FileText, Plus } from 'lucide-react';


// 这段代码是一个 通用空状态组件（EmptyState），用于在“没有数据”的时候显示提示内容，比如：
// 没有文档
// 没有聊天记录
// 没有搜索结果
// 没有任务列表

// onActionClick	按钮点击事件
// title	标题
// description	描述文字
// buttonText	按钮文字
const EmptyState = ({ onActionClick, title, description, buttonText }) => {

    return (
        <div className='flex flex-col items-center justify-center py-16 px-6 text-center bg-linear-to-br 
        from-slate-50/50 to-white border-2 border-dashed border-slate-200 rounded-3xl'>
            {/* 顶部图标 */}
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br
            from-slate-100 to-slate-200/50 mb-6'>
                {/* // 所以用户看到的是一个居中的文件图标 */}
                <FileText className='w-8 h-8 text-slate-400' strokeWidth={2} />
            </div>
            {/* 标题 */}
            <h3 className='text-lg font-semibold text-slate-900 mb-2'>{title}</h3>
            {/* 描述文字 */}
            <p className='text-sm text-slate-500 mb-8 max-w-sm leading-relaxed'>{description}</p>
            {/* 按钮 */}
            {buttonText && onActionClick && (
                // 按钮样式
                <button onClick={onActionClick} className='group relative inline-flex items-center gap-2 px-6 h-11
                bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white 
                text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95
                focus:outline-none focus:ring-4 focus:ring-emerald-500/20 overflow-hidden'>
                    {/* 按钮内容 */}
                    <span className='relative z-10 flex items-center gap-2'>
                    {/* 加号图标 */}
                    <Plus className='w-4 h-4' strokeWidth={2.5} />
                    {/* 按钮文字 */}
                    {buttonText}
                    </span>
                    {/* 这是按钮上那层“滑过去的高光” */}
                    <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700' />
                </button>
            )}
        </div>
    )
}

export default EmptyState