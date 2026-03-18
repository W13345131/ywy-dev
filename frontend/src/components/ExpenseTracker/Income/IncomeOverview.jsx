import React from 'react'
import { useState, useEffect } from 'react';
import { prepareIncomeBarChartData } from '../../../utils/help';
import { Plus } from 'lucide-react';
import CustomBarChart from '../Charts/CustomBarChart';

const IncomeOverview = ({ transactions, onAddIncome }) => {

  // 定义图表数据
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // 如果transactions是数组，则使用transactions，否则使用空数组
    const list = Array.isArray(transactions) ? transactions : [];
    // 准备图表数据
    const result = prepareIncomeBarChartData(list);
    // 设置图表数据
    setChartData(result);
  }, [transactions]);


  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <div>
                {/* 显示标题 */}
                <h5 className='text-lg'>Income Overview</h5>
                <p className='text-xs text-gray-400 mt-0.5'>
                    Track your earnings over time and analyze your income trends.
                </p>
            </div>
            {/* 添加收入按钮 */}
            <button type='button' className='add-btn' onClick={onAddIncome}>
            <Plus className='text-lg' />
            Add Income
            </button>
        </div>

        {/* 创建柱状图 */}
        <div className='mt-10 min-h-[300px]'>
            {/* 创建柱状图 */}
            <CustomBarChart data={chartData} />
        </div>
    </div>
  )
}

export default IncomeOverview