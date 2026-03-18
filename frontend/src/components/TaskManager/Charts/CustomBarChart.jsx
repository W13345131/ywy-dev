import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';


// React + Recharts 的自定义柱状图组件

// 自定义 Tooltip
const BarChartTooltip = ({ active, payload }) => {
  // 如果 active 为 true，payload 不为空，且 payload 的长度大于 0，则显示提示框
  if (active && payload && payload?.length) {
    return (
      <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
        <p className='text-xs font-semibold text-purple-800 mb-1'>
          {payload[0].payload.priority}
        </p>
        <p className='text-sm text-gray-600'>
          Count:{""}
          <span className='text-sm font-medium text-gray-900'>
            {payload[0].payload.count}
          </span>
        </p>
      </div>
    )
  }
  return null
}

const CustomBarChart = ({ data }) => {

  // 根据优先级获取柱子颜色（传入 priority 字符串）
  const getBarColor = (priority) => {
    switch (priority) {
      case 'Low':
        return '#00BC7D';
      case 'Medium':
        return '#FE9900';
      case 'High':
        return '#FF1F57';
      default:
        return '#00BC7D';
    }
  }

  return (
    <div className='mt-6 bg-white'>
      {/* // 让图表自适应容器大小 */}
      <ResponsiveContainer width="100%" height={300}>
        {/* // 创建柱状图 */}
        <BarChart data={data}>
          {/* // 不显示网格线 */}
          <CartesianGrid stroke='none' />
          {/* // 设置 X 轴标签 */}
          <XAxis dataKey="priority" tick={{ fontSize: 12, fill: '#555' }} stroke="none" />
          {/* // 设置 Y 轴标签 */}
          <YAxis tick={{ fontSize: 12, fill: '#555' }} stroke="none" />

          {/* 鼠标 hover 柱子时显示提示框 */}
          {/* 设置提示框的背景颜色为透明 */}
          <Tooltip content={BarChartTooltip} cursor={{ fill: "transparent"}} />


          {/* // 创建柱子 */}
          <Bar
            dataKey="count"
            nameKey="priority"
            fill="#FF8042"
            // 设置柱子的圆角
            // 左上角和右上角为 10，左下角和右下角为 0
            radius={[10, 10, 0, 0]}
            // 设置柱子激活时的颜色和半径
            activeDot={{ fill: 'yellow', r: 8 }}
            // 设置柱子激活时的样式
            activeStyle={{ fill: 'green' }}
          >
            {/* // 根据数据的长度，创建柱子 */}
            {data.map((entry, index) => (
              // 创建柱子
              // key 是柱子的唯一标识
              // fill 是柱子的颜色
              // getBarColor(entry) 根据优先级获取柱子颜色
              <Cell key={`cell-${index}`} fill={getBarColor(entry?.priority)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomBarChart