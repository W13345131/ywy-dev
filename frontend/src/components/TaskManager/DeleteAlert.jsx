import React from 'react'


// 删除确认弹窗组件
function DeleteAlert({ content, onDelete }) {
  return (
    <div className=''>
        {/* 显示内容 */}
      <p className='text-sm'>{content}</p>

      <div className='flex justify-end mt-6'>
        {/* 删除按钮 */}
        <button
          type='button'
          className='flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 whitespace-nowrap
          bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 cursor-pointer'
          onClick={onDelete}
        >
            {/* 删除按钮文本 */}
            Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteAlert