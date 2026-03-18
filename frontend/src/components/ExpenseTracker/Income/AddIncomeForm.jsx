import React, { useState } from 'react'
import Input from '../Inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'

const AddIncomeForm = ({ onAddIncome }) => {


  // 使用 useState 保存表单数据
  const [income, setIncome] = useState({
    source: '',
    amount: '',
    date: '',
    icon: '',
  });

  // 处理表单数据变化
  // ...income	保留旧数据
  // [key]: value	修改指定字段
  const handleChange = (key, value) => {
    setIncome({ ...income, [key]: value });
  }


  return (
    <div>
        {/* 选择图标 */}
        <EmojiPickerPopup
          icon={income.icon}
          onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
        />


        {/* 选择来源 */}
        <Input
          value={income.source}
          onChange={(e) => handleChange('source', e.target.value)}
          label='Income Source'
          placeholder='Freelance, Salary, etc.'
          type='text'
        />

        {/* 选择金额 */}
        <Input
          value={income.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          label='Amount'
          placeholder=''
          type='number'
        />

        {/* 选择日期 */}
        <Input
          value={income.date}
          onChange={(e) => handleChange('date', e.target.value)}
          label='Date'
          placeholder=''
          type='date'
        />

        {/* 添加收入按钮 */}
        <div className='flex justify-end mt-6'>
            {/* 添加收入按钮 */}
            <button
              type='button'
              className='add-btn add-btn-fill'
              onClick={() => onAddIncome(income)}
            >
                Add Income
            </button>
        </div>
    </div>
  )
}

export default AddIncomeForm