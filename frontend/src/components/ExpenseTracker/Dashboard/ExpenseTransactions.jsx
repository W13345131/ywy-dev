import React from 'react'
import { ArrowRight } from 'lucide-react'
import TransactionInfoCard from '../Cards/TransactionInfoCard.jsx'
import moment from 'moment'


// transactions	所有交易数据
// onSeeMore	点击 “See All” 按钮触发的函数
const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Expense Transactions</h5>
            <button className='card-btn' onClick={onSeeMore}>
                See All <ArrowRight className='text-base' />
            </button>
        </div>
        {/* // 显示最近5条支出交易 */}
        <div className='mt-6'>
            {/* // 遍历最近5条支出交易 */}
            {transactions?.slice(0,5)?.map((item) => (
                <TransactionInfoCard
                  key={item._id}
                  // 显示支出交易类别
                  title={item.category}
                  icon={item.icon}
                  // 显示支出交易日期
                  date={moment(item.date).format('Do MMM, YYYY')}
                  amount={item.amount}
                  type='expense'
                  // 隐藏删除按钮
                  hideDeleteBtn
                />
            ))}
        </div>
    </div>
  )
}

export default ExpenseTransactions