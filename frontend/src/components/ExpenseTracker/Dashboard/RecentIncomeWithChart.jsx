import React, { useState, useEffect } from 'react'
import CustomPieChart from '../Charts/CustomPieChart.jsx';

// 定义颜色
const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"]

const RecentIncomeWithChart = ({ data, totalIncome }) => {

  // 定义图表数据
  const [chartData, setChartData] = useState([]);

  // 准备图表数据
  const prepareChartData = () => {
    // 把数据转换成图表数据
    const dataArr = data?.map((item) => ({
        name: item?.source,
        amount: item?.amount,
    }));
    // 设置图表数据
    setChartData(dataArr);
  }

  // 当数据变化时，准备图表数据
  useEffect(() => {
    prepareChartData();
    return () => {}
  }, [data]);

  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Last 60 Days Income</h5>
        </div>

        {/* 创建饼图 */}
        <CustomPieChart
          // 设置图表数据
          data={chartData}
          // 设置标签
          label="Total Income"
          // 设置总金额
          totalAmount={`${totalIncome}`}
          showTextAnchor
          colors={COLORS}
        />
    </div>
  )
}

export default RecentIncomeWithChart