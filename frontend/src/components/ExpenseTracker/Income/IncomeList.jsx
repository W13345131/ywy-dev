import React from 'react'
import { Download } from 'lucide-react'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment'

const IncomeList = ({ transactions, openDelete, onDownload }) => {

  // 显示收入列表
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>
                Income Sources
            </h5>
            {/* 下载excel按钮 */}
            <button className='card-btn' onClick={onDownload}>
                <Download /> Download
            </button>
        </div>

        {/* 显示收入列表 */}
        <div className='grid grid-cols-1 md:grid-cols-2'>
            {
                transactions?.map((income) => (
                    <TransactionInfoCard 
                      key={income._id} 
                      title={income.source}
                      // 设置图标
                      icon={income.icon}
                      // 设置日期
                      date={moment(income.date).format('Do MMM, YYYY')}
                      // 设置金额
                      amount={income.amount}
                      // 设置类型
                      type='income'
                      onDelete={() => openDelete(income._id)}
                    />
                ))
            }
        </div>
    </div>
  )
}

export default IncomeList