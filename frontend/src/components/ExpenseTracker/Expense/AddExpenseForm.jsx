import React, { useState } from 'react'
import Input from '../Inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'

const AddExpenseForm = ({ onAddExpense }) => {


  // 使用 useState 保存表单数据
  const [expense, setExpense] = useState({
    category: '',
    amount: '',
    date: '',
    icon: '',
  });

  // 处理表单数据变化
  // ...expense	保留旧数据
  // [key]: value	修改指定字段
  const handleChange = (key, value) => {
    setExpense({ ...expense, [key]: value });
  }


  return (
    <div>
        {/* 选择图标 */}
        <EmojiPickerPopup
          icon={expense.icon}
          onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
        />

        {/* 选择分类 */}
        <Input
          value={expense.category}
          onChange={(e) => handleChange('category', e.target.value)}
          label='Expense Category'
          placeholder='Food, Transport, etc.'
          type='text'
        />

        {/* 选择金额 */}
        <Input
          value={expense.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          label='Amount'
          placeholder=''
          type='number'
        />

        {/* 选择日期 */}
        <Input
          value={expense.date}
          onChange={(e) => handleChange('date', e.target.value)}
          label='Date'
          placeholder=''
          type='date'
        />

        {/* 添加费用按钮 */}
        <div className='flex justify-end mt-6'>
            {/* 添加费用按钮 */}
            <button
              type='button'
              className='add-btn add-btn-fill'
              onClick={() => onAddExpense(expense)}
            >
                Add Expense
            </button>
        </div>
    </div>
  )
}

export default AddExpenseForm