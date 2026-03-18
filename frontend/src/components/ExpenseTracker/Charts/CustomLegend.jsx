import React from 'react'

const CustomLegend = ({ payload }) => {
  return (
    <div className='flex flex-wrap justify-center gap-2 mt-4 space-x-6'>
        {payload.map((entry, index) => (
            <div className='flex items-center space-x-2' key={`legend-${index}`}>
                {/* // 创建一个圆点 */}
                <div className='w-2.5 h-2.5 rounded-full' style={{ backgroundColor: entry.color }}></div>
                {/* // 显示文字 */}
                <span className='text-xs text-gray-700 font-medium'>{entry.value}</span>
            </div>
        ))}
    </div>
  )
}

export default CustomLegend