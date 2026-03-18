import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { prepareExpenseBarChartData } from '../../../utils/help';
import CustomBarChart from '../../ExpenseTracker/Charts/CustomBarChart.jsx';


const Last30DaysExpenses = ({ data }) => {

  // 定义图表数据
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // 准备图表数据
    const result = prepareExpenseBarChartData(data);
    // 设置图表数据
    setChartData(result);
  }, [data]);


  return (
    // col-span-1 表示这个卡片占据1列
    <div className='card col-span-1'>
        {/* justify-between 两端对齐 */}
        <div className='flex items-center justify-between'>
            {/* 显示标题 */}
            <h5 className='text-lg'>Last 30 Days Expenses</h5>
        </div>

        {/* 创建柱状图 */}
        <CustomBarChart data={chartData} />
    </div>
  )
}

export default Last30DaysExpenses