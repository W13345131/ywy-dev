import React from 'react'


// 当用户鼠标 hover 到图表数据点时，会显示一个自定义提示框
// active	Tooltip 是否正在显示
// payload	当前数据点的信息
const CustomTooltip = ({ active, payload }) => {
  
  // 如果 active 为 true，payload 不为空，且 payload 的长度大于 0，则显示提示框
  if (active && payload && payload.length)  {
    // 返回提示框
    return (
       <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
        {/* // 取第一个元素的 name 属性 */}
        <p className='text-xs font-semibold text-purple-800 mb-1'>{payload[0].name}</p>
        <p className='text-sm text-gray-600'>
            {/* // 取第一个元素的 value 属性 */}
            Count: <span className='text-sm font-medium text-gray-900'>{payload[0].value}</span>
        </p>
       </div>
    )
  }
  return null;
}


export default CustomTooltip