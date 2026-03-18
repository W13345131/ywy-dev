import React from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { format, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

// 注册日期选择器语言
registerLocale('en', enUS)

// value	输入框值
// onChange	值改变事件
// label	标签
// placeholder	占位提示
// type	输入类型
const Input = ({ value, onChange, label, placeholder, type }) => {

  // 如果类型为日期，则显示日期选择器
  if (type === 'date') {
    // 日期值
    let dateValue = null
    // 如果值存在，则转换为日期
    if (value) {
      try {
        // 如果值是日期，则直接赋值
        // instanceof 判断 value 是否是 Date 类型
        // parseISO 将字符串转换为日期
        dateValue = value instanceof Date ? value : parseISO(value)
        // 如果日期值不是数字，则赋值为空
        if (isNaN(dateValue.getTime())) dateValue = null
      } catch {
        dateValue = null
      }
    }

    return (
      <div>
        {/* 显示标签 */}
        <label className='text-[13px] text-slate-800'>{label}</label>
        <div className='input-box'>
          {/* 日期选择器 */}
          <DatePicker
            locale="en"
            dateFormat="MMM d, yyyy"
            // 选择日期
            selected={dateValue}
            // 日期改变事件
            // format 将日期转换为字符串
            onChange={(date) => onChange({ target: { value: date ? format(date, 'yyyy-MM-dd') : '' } })}
            className='w-full bg-transparent outline-none cursor-pointer'
            // 占位提示
            placeholderText={placeholder || 'Select date'}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* 显示标签 */}
      <label className='text-[13px] text-slate-800'>{label}</label>
      <div className='input-box'>
        {/* 输入框 */}
        <input
          type={type}
          placeholder={placeholder}
          className='w-full bg-transparent outline-none'
          value={value}
          // 值改变事件
          onChange={(e) => onChange(e)}
        />
      </div>
    </div>
  )
}

export default Input
