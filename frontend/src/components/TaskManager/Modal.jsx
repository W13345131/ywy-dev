import React from 'react'

function Modal({ isOpen, onClose, title, children }) {

  if(!isOpen) return null;  

  return (
    <div className='fixed inset-0 z-50 flex justify-center items-center p-4 overflow-y-auto bg-black/20'
      onClick={onClose}>
      <div className='relative w-full max-w-2xl max-h-full'
        onClick={(e) => e.stopPropagation()}>
        {/* Modal content - 白底黑字 */}
        <div className='bg-white rounded-lg shadow-lg'>
            {/* 弹窗标题 */}
            <div className='flex items-center justify-between p-4 md:p-5 border-b border-gray-200 rounded-t-lg'>
                <h3 className='text-lg font-medium text-gray-900'>
                    {title}
                </h3>
                <button
                  type='button'
                  className='text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1.5 cursor-pointer transition-colors'
                  onClick={onClose}
                >
                    {/* 关闭图标 */}
                    {/* aria-hidden='true' 表示关闭图标是隐藏的 */}
                    {/* xmlns='http://www.w3.org/2000/svg' 表示关闭图标是 SVG 格式 */}
                    {/* fill='none' 表示关闭图标是透明的 */}
                    {/* viewBox='0 0 14 14' 表示关闭图标是 14x14 像素 */}
                    {/* stroke='currentColor' 表示关闭图标是当前颜色 */}
                    {/* strokeLinecap='round' 表示关闭图标是圆角 */}
                    {/* strokeLinejoin='round' 表示关闭图标是圆角 */}
                    {/* strokeWidth='2' 表示关闭图标是 2 像素 */}
                    {/* d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6' 表示关闭图标是 1x1 像素 */}
                    <svg className='w-4 h-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'>
                      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6' />
                    </svg>
                </button>
            </div>
            {/* 弹窗内容 */}
            <div className='p-4 md:p-5 space-y-4 text-gray-900'>
                {children}
            </div>
        </div>
      </div>
    </div>
  )
}

export default Modal