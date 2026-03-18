import React from 'react'
import { ArrowRight } from 'lucide-react'
import TransactionInfoCard from '../Cards/TransactionInfoCard.jsx'
import moment from 'moment'

const RecentIncome = ({ transactions, onSeeMore }) => {
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Recent Income</h5>
            {/* 显示所有收入按钮 */}
            <button className='card-btn' onClick={onSeeMore}>
                See All <ArrowRight className='text-base' />
            </button>
        </div>

        {/* 显示最近5条收入 */}
        <div>
            {/* 遍历最近5条收入 */}
            {transactions?.slice(0,5)?.map((item) => (
                <TransactionInfoCard 
                  key={item._id}
                  // 设置收入来源
                  title={item.source}
                  icon={item.icon}
                  // 设置日期
                  date={moment(item.date).format('Do MMM, YYYY')}
                  // 设置金额
                  amount={item.amount}
                  // 设置类型
                  type='income'
                  hideDeleteBtn
                />
            ))}
        </div>
    </div>
  )
}

export default RecentIncome