import React from 'react'
import { X } from 'lucide-react';


// 可复用的 React 弹窗组件
// isOpen	控制弹窗是否显示
// onClose	关闭弹窗的函数
// title	弹窗标题
// children	弹窗内容
function Modal({ isOpen, onClose, title, children }) {

  // 如果弹窗不显示，则返回 null
  if(!isOpen) return null;  

  // 如果弹窗显示，则返回弹窗内容
  return (
    // 作用：让 Modal 覆盖整个页面
    <div className='fixed inset-0 z-50 overflow-y-auto'>
        {/* 让弹窗居中显示 */}
        <div className='flex items-center justify-center min-h-screen px-4 py-8'>
            {/* 让弹窗背景变暗，并点击背景时关闭弹窗 */}
            <div className='fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity' onClick={onClose}></div>
            {/* 让弹窗居中显示，给元素背后的内容添加模糊效果 */}
            <div className='relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 
            rounded-2xl p-8 shadow-2xl shadow-slate-900/20 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300'>
                <button className='absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200' onClick={onClose}>
                    <X strokeWidth={2} className='w-5 h-5' />
                </button>
                {/* 弹窗标题 */}
                <div className='mb-6 pr-8'>
                <h3 className='text-xl font-medium text-slate-900 tracking-tight'>{title}</h3>
                </div>
                {/* 弹窗内容 */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Modal