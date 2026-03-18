import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart.jsx';

// 定义颜色
const COLORS = ["#875CF5", "#FA2C37", "#FF6900"]

// totalBalance	总余额
// totalIncomes	总收入
// totalExpenses	总支出
const FinanceOverview = ({ totalBalance, totalIncomes, totalExpenses }) => {

  // 构建图表数据
  // name：名称
  // amount：金额
  const balanceData = [
    {
      name: "Total Balance",
      amount: totalBalance,
    },
    {
      name: "Total Income",
      amount: totalIncomes,
    },
    {
      name: "Total Expense",
      amount: totalExpenses,
    }
  ]


  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Finance Overview</h5>
      </div>

      {/* // 创建饼图 */}
      <CustomPieChart
        // 设置图表数据
        data={balanceData}
        // 设置标签
        label="Total Balance"
        // 设置总金额
        totalAmount={totalBalance}
        // 设置颜色
        colors={COLORS}
        // 显示文本锚点
        showTextAnchor
      />
    </div>
  )
}

export default FinanceOverview