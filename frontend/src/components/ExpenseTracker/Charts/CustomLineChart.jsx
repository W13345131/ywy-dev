import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// React + Recharts 的自定义面积折线图组件
const CustomLineChart = ({ data }) => {
  
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
                    {/* // 取第一个元素的 payload.category 属性 */}
                    <p className='text-xs font-semibold text-purple-800 mb-1'>{payload[0].payload.category}</p>
                    {/* // 取第一个元素的 payload.amount 属性 */}
                    <p className='text-sm text-gray-600'>
                        Amount: <span className='text-sm font-medium text-gray-900'>${payload[0].payload.amount}</span>
                    </p>
                </div>
            )
        }
        return null;
    };


    return (
        <div className='bg-white'>
            {/* // 让图表自适应容器大小 */}
            <ResponsiveContainer width="100%" height={300}>
                {/* // 创建面积折线图 */}
                <AreaChart data={data}>
                    <defs>
                        {/* SVG 渐变定义 */}
                        {/* x1	渐变起点 X */}
                        {/* y1	渐变起点 Y */}
                        {/* x2	渐变终点 X */}
                        {/* y2	渐变终点 Y */}
                        {/* (0 , 0) → 左上角，(0 , 1) → 左下角 */}
                        {/* 垂直渐变（top → bottom） */}
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            {/* 5% 位置，颜色为 #875cf5，透明度为 0.4 */}
                            <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
                            {/* 95% 位置，颜色为 #875cf5，透明度为 0 */}
                            <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    {/* // 不显示网格线 */}
                    <CartesianGrid stroke='none' />
                    {/* // 设置 X 轴标签 */}
                    {/* 不显示边框 */}
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#555' }} stroke="none" />
                    {/* // 设置 Y 轴标签 */}
                    <YAxis tick={{ fontSize: 12, fill: '#555' }} stroke="none" />
                    {/* // 鼠标 hover 折线图时显示提示框 */}
                    <Tooltip content={CustomTooltip} />

                    {/* // 创建面积折线图 */}
                    {/* type：折线图类型, monotone：平滑曲线 */}
                    {/* dataKey：数据键 */}
                    {/* stroke：折线颜色 */}
                    {/* fill：填充颜色, url(#incomeGradient)：渐变，使用刚刚定义的渐变 */}
                    {/* strokeWidth：折线宽度 */}
                    {/* dot：点 */}
                    {/* r：点半径, 3：点半径为3 */}
                    {/* fill：点颜色 */}
                    <Area type="monotone" dataKey="amount" stroke="#875cf5" fill="url(#incomeGradient)" strokeWidth={3} dot={{ r: 3, fill: "#ab8df8" }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomLineChart