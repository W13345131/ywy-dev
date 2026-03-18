import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip.jsx';
import CustomLegend from './CustomLegend.jsx';


// 自定义环形图组件 CustomPieChart
// label：显示在图表中间上方的小文字
// totalAmount：显示在图表中间下方的大数字
// colors：饼图的颜色
// showTextAnchor：布尔值，控制是否在图表中心显示文字
const CustomPieChart = ({
    data,
    label,
    totalAmount,
    colors,
    showTextAnchor
}) => {
  return (
    <ResponsiveContainer width="100%" height={360}>
        <PieChart>
            {/* // 创建饼图 */}
            <Pie  
              // 数据
              data={data}
              dataKey="amount"
              nameKey="name"
              // 中心点
              cx="50%"
              cy="50%"
              // 外半径
              outerRadius={130}
              // 内半径
              innerRadius={100}
              // 不显示标签线
              labelLine={false}
            >
                {/* // 根据数据的长度，创建饼图 */}
                {data.map((entry, index) => (
                    // 创建饼图
                    <Cell key={`cell-${index}`}
                        // 颜色
                        fill={colors[index % colors.length]}
                    />
                ))}
            </Pie>

            {/* // 鼠标 hover 饼图时显示提示框 */}
            <Tooltip content={CustomTooltip} />
            {/* // 图例 */}
            <Legend content={CustomLegend} />

            {
                // 如果 showTextAnchor 为 true，则显示文字
                showTextAnchor && (
                    <>
                    <text
                      // 中心点
                      x="50%"
                      y="50%"
                      dy={-25}
                      // 居中
                      textAnchor='middle'
                      fill='#666'
                      fontSize="14px"
                    >
                      {label}
                    </text>
                    <text
                      x="50%"
                      y="50%"
                      dy={8}
                      textAnchor='middle'
                      fill='#333'
                      fontSize="24px"
                      fontWeight="semi-bold"
                    >
                      {/* 显示总金额 */}
                      ${totalAmount}
                    </text>
                    </>
                )
            }
        </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;