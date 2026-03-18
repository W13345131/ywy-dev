import React from 'react'


// title	页面主标题
// subtitle	页面说明文字
// children	右侧操作区域
function PageHeader({ title, subtitle, children }) {
  return (
    // 让页面标题和说明文字垂直居中，并且有 6 像素的间距
    <div className='flex items-center justify-between mb-6'>
        {/* 页面标题和说明文字 */}
        <div>
            {/* 页面标题 */}
            <h1 className='text-2xl font-medium text-slate-900 tracking-tight mb-2'>
                {title}
            </h1>
            {/* 副标题 */}
            {subtitle && (
                <p className='text-sm text-neutral-500'>
                    {subtitle}
                </p>
            )}
        </div>
        {/* 右侧操作区域 */}
        {children && (
            <div className=''>
                {children}
            </div>
        )}
    </div>
  )
}

export default PageHeader