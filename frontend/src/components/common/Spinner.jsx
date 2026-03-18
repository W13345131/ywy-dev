import React from 'react'

function Spinner() {
  return (
    // 让元素水平和垂直居中，并且有 8 像素的间距
    <div className='flex items-center justify-center p-8'>
        {/* 旋转的绿色图标 */}
        <svg
        // 让图标旋转，并且有 6 像素宽和 6 像素高，颜色为绿色
        className='animate-spin h-6 w-6 text-[#00d492]'
        // 让图标使用 SVG 格式
        xmlns='http://www.w3.org/2000/svg'
        // 让图标不填充任何颜色
        fill='none'
        // 让图标显示在一个 24 像素的正方形区域内
        viewBox='0 0 24 24'
        >
            {/* 让图标显示为一个圆形，并且有 25% 的透明度 */}
            <circle
            // 让圆形有 25% 的透明度
            className='opacity-25'
            // 让圆形在 x 轴上居中，在 y 轴上居中
            cx='12'
            // 让圆形在 y 轴上居中
            cy='12'
            // 让圆形半径为 10 像素
            r='10'
            // 让圆形边框颜色为当前颜色，即[#00d492]
            stroke='currentColor'
            // 让圆形边框宽度为 3 像素
            strokeWidth='3'
            >
            </circle>
            <path
            // 让路径有 75% 的透明度
            className='opacity-75'
            // 让路径填充颜色为当前颜色
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
        </svg>
    </div>
  )
}

export default Spinner
