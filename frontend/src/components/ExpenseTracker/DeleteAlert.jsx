import React from 'react'

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div>
        {/* 显示内容 */}
        <p className='text-sm'>
            {content}
        </p>
        <div className='flex justify-end mt-6'>
            {/* 删除按钮 */}
            <button
              type='button'
              className='add-btn add-btn-fill'
              onClick={onDelete}
            >
                Delete
            </button>
        </div>
    </div>
  )
}

export default DeleteAlert