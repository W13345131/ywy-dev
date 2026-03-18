import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';


// React + Recharts 的自定义柱状图组件

// 自定义 Tooltip
const BarChartTooltip = ({ active, payload }) => {
  // 如果 active 为 true，payload 不为空，且 payload 的长度大于 0，则显示提示框
  if (active && payload?.[0]) {
    // 取第一个元素的 payload 属性
    const { category, amount } = payload[0].payload ?? {}
    return (
      <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
        {/* // 如果 category 不存在 显示 "-" */}
        <p className='text-xs font-semibold text-purple-800 mb-1'>{category ?? '—'}</p>
        <p className='text-sm text-gray-600'>
          Amount: <span className='text-sm font-medium text-gray-900'>
            {/* // 如果 amount 是数字，则显示 amount 的本地化字符串 */}
            {/* // toLocaleString() 把数字转换成当地语言的格式 */}
            ${typeof amount === 'number' ? amount.toLocaleString() : (amount ?? 0)}
          </span>
        </p>
      </div>
    )
  }
  return null
}

const CustomBarChart = ({ data = [] }) => {

  // 根据 index（序号） 让柱子颜色交替出现
  const getBarColor = (index) => (index % 2 === 0 ? '#875cf5' : '#cfbefb')

  return (
    <div className='mt-6 bg-white'>
      {/* // 让图表自适应容器大小 */}
      <ResponsiveContainer width="100%" height={300}>
        {/* // 创建柱状图 */}
        <BarChart data={data}>
          {/* // 不显示网格线 */}
          <CartesianGrid stroke='none' />
          {/* // 设置 X 轴标签 */}
          <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#555' }} stroke="none" />
          {/* // 设置 Y 轴标签 */}
          <YAxis tick={{ fontSize: 12, fill: '#555' }} stroke="none" />

          {/* // 鼠标 hover 柱子时显示提示框 */}
          <Tooltip content={BarChartTooltip} />


          {/* // 创建柱子 */}
          <Bar
            dataKey="amount"
            fill="#875cf5"
            radius={[10, 10, 0, 0]}
            activeBar={{ fill: '#6d28d9' }}
          >
            {/* // 根据数据的长度，创建柱子 */}
            {data.map((entry, index) => (
              // 创建柱子
              // key 是柱子的唯一标识
              // fill 是柱子的颜色
              // getBarColor(index) 根据 index（序号） 让柱子颜色交替出现
              <Cell key={`cell-${index}`} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomBarChart