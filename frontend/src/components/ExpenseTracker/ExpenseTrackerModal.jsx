import React from 'react'


// isOpen	控制弹窗是否显示
// onClose	关闭弹窗的函数
// title	弹窗标题
// children	弹窗内容
const ExpenseTrackerModal = ({ isOpen, onClose, title, children }) => {
  // 如果弹窗不显示，则返回 null
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto'>
        <div
          className='fixed inset-0 bg-slate-900/50 backdrop-blur-sm'
          aria-hidden
          onClick={onClose}
        />
        <div className='relative z-10 w-full max-w-2xl'>
            <div className='bg-white rounded-lg shadow-xl border border-gray-200'>
                <div className='flex items-center justify-between p-4 md:p-5 border-b border-gray-200 rounded-t'>
                    {/* 弹窗标题 */}
                    <h3 className='text-lg font-medium text-black'>
                        {title}
                    </h3>

                    {/* 关闭按钮 */}
                    <button
                      type='button'
                      className='text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg text-sm w-8 h-8 
                      inline-flex justify-center items-center transition-colors cursor-pointer'
                      onClick={onClose}
                      aria-label='Close'
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
                        <svg className='w-3 h-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'>
                          <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6' />
                        </svg>
                    </button>
                </div>

                {/* 弹窗内容 */}
                <div className='p-4 md:p-5 space-y-4 text-black'>
                    {/* 弹窗内容 */}
                    {children}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ExpenseTrackerModal