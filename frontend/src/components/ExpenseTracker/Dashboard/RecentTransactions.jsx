import React from 'react'
import { ArrowRight } from 'lucide-react'
import moment from 'moment'
import TransactionInfoCard from '../Cards/TransactionInfoCard.jsx'


// transactions	交易列表
// onSeeMore	点击按钮时执行的函数
const RecentTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className='card'>
        {/* justify-between 两端对齐 */}
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Recent Transactions</h5>
        </div>

        <div className='mt-6'>
            {/* slice(0,5) 截取前5条数据 */}
            {transactions?.slice(0,5)?.map((item) => (
                // 引用 TransactionInfoCard 组件
                <TransactionInfoCard
                  key={item._id}
                  // 如果 type 为 expense，则显示 category，否则显示 source
                  title={item.type == 'expense' ? item.category : item.source}
                  // 设置图标
                  icon={item.icon}
                  // 设置日期
                  date={moment(item.date).format('Do MMM, YYYY')}
                  // 设置金额
                  amount={item.amount}
                  // 设置类型
                  type={item.type}
                  // 隐藏删除按钮
                  hideDeleteBtn
                />
            ))}
        </div>
    </div>
  )
}

export default RecentTransactions