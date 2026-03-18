import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react';


// 自定义 Select 下拉框
// options：选项列表
// value：选中的值
// onChange：值改变事件
// placeholder：占位提示
function SelectDropdown({ options, value, onChange, placeholder }) {

  // 是否打开下拉框
  const [isOpen, setIsOpen] = useState(false);
  
  // 选择选项
  const handleSelect = (option) => {
    // 调用父组件的值改变事件
    onChange(option);
    // 关闭下拉框
    setIsOpen(false);
  }

  return (
    <div className='relative w-full'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md
          mt-2 flex justify-between items-center cursor-pointer'
        >
            {/* 如果选中的值存在，则显示选中的值的标签 */}
            {/* 使用 find() 方法找到选中的值的标签，如果已经选中，则显示选中的值的标签，如果找不到，则显示占位提示 */}
            {
                value ? options.find(opt => opt.value === value)?.label : placeholder
            }

            {/* 下拉箭头 */}
            <span className='ml-2'>
                {/* 如果下拉框打开，则显示向上箭头，否则显示向下箭头 */}
                {
                    isOpen ? <ChevronUp /> : <ChevronDown />
                }
            </span>

        </button>

        {/* 如果下拉框打开，则显示下拉框 */}
        {
            isOpen && (
                <div className='absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10'>
                    {/* 遍历选项列表 */}
                    {
                        // 遍历选项列表
                        options.map((option) => (
                            // 选项列表项
                            <div
                              // 选项列表项的唯一标识
                              key={option.value}
                              // 点击选项列表项时，调用 handleSelect 函数
                              onClick={() => handleSelect(option.value)}
                              className='px-3 py-2 text-sm cursor-pointer hover:bg-gray-100'
                            >
                                {/* 显示选项列表项的标签 */}
                                {option.label}
                            </div>
                        ))
                    }
                </div>
            )
        }
    </div>
  )
}

export default SelectDropdown