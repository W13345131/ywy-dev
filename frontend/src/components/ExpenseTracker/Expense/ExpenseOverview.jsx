import React from 'react'
import { useState, useEffect } from 'react';
import { prepareExpenseLineChartData } from '../../../utils/help';
import { Plus } from 'lucide-react';
import CustomLineChart from '../Charts/CustomLineChart';



const ExpenseOverview = ({ transactions, onAddExpense }) => {

  // 定义图表数据
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // 如果transactions是数组，则使用transactions，否则使用空数组
    const list = Array.isArray(transactions) ? transactions : [];
    // 准备图表数据
    const result = prepareExpenseLineChartData(list);
    // 设置图表数据
    setChartData(result);
  }, [transactions]);

  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <div>
            <h5 className='text-lg'>Expense Overview</h5>
            <p className='text-xs text-gray-400 mt-0.5'>
                Track your expenses over time and analyze your expense trends.
            </p>
        </div>
        {/* 添加费用按钮 */}
        <button type='button' className='add-btn' onClick={onAddExpense}>
            <Plus className='text-lg' />
            Add Expense
        </button>
      </div>

      {/* 创建折线图 */}
      <div className='mt-10 min-h-[300px]'>
        <CustomLineChart data={chartData} />
      </div>
    </div>
  )
}

export default ExpenseOverview