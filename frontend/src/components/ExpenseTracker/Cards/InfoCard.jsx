import React from 'react'


// props 解构赋值
// icon	图标
// label	标题
// value	数值
// color	图标背景颜色
const InfoCard = ({ icon, label, value, color }) => {
  return (
    // class	   作用
    // flex	       使用 Flex 布局
    // gap-6	   元素之间间距
    // bg-white	   白色背景
    // p-6	       padding(内边距)
    // rounded-2xl	圆角
    // shadow-md	阴影
    // shadow-gray-100	阴影颜色
    // border	          边框
    // border-gray-200/50	半透明边框
    <div className='flex gap-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50'>
        <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color}
        rounded-full drop-shadow-xl`}>
            {icon}
        </div>
        <div className=''>
            {/* mb-1 表示底部外边距为1单位 4px */}
            <h6 className='text-sm text-gray-500 mb-1'>{label}</h6>
            <span className='text-[22px]'>${value}</span>
        </div>
    </div>
  )
}

export default InfoCard