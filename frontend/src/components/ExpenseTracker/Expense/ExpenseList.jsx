import React from 'react'
import { Download } from 'lucide-react'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'



const ExpenseList = ({ transactions, openDelete, onDownload }) => {
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            {/* 显示标题 */}
            <h5 className='text-lg'>
                Expense Categories
            </h5>
            {/* 下载excel按钮 */}
            <button className='card-btn' onClick={onDownload}>
                <Download /> Download
            </button>
        </div>

        {/* 显示支出列表 */}
        <div className='grid grid-cols-1 md:grid-cols-2'>
            {
                transactions?.map((expense) => (
                    // 引用 TransactionInfoCard 组件
                    <TransactionInfoCard 
                      key={expense._id} 
                      title={expense.category}
                      // 设置图标
                      icon={expense.icon}
                      // 设置日期
                      date={moment(expense.date).format('Do MMM, YYYY')}
                      // 设置金额
                      amount={expense.amount}
                      type='expense'
                      onDelete={() => openDelete(expense._id)}
                    />
                ))
            }
        </div>
    </div>
  )
}

export default ExpenseList