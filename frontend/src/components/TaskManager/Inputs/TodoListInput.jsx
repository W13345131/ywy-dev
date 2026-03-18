import React, { useState } from 'react'
import { Trash, Plus } from 'lucide-react';


// 任务清单输入组件
// todoChecklist	当前 todo 列表
// setTodoChecklist	更新 todo 列表的回调函数
function TodoListInput({ todoChecklist, setTodoChecklist }) {


  const [option, setOption] = useState('');


  // 添加任务
  const handleAddOption = () => {
    // 去除空格
    const trimmed = (option ?? '').trim();
    // 如果去除空格后不为空，则添加到 todo 列表
    if (trimmed !== '') {
      // 添加到 todo 列表
      setTodoChecklist([...(todoChecklist || []), trimmed]);
      setOption('');
    }
  }
  
  
  // 删除任务
  const handleDeleteOption = (index) => {
    // 过滤掉当前索引的 todo
    // _ 表示当前索引的 todo
    const updateArr = (todoChecklist || []).filter((_, i) => i !== index);
    // 更新 todo 列表
    setTodoChecklist(updateArr);
  }



    
  return (
    <div>
      {
        (todoChecklist || []).map((item, index) => (
            <div
              key={item}
              className='flex items-center justify-between gap-3 bg-gray-50 border border-slate-100 px-3 py-2 rounded-md mb-3 mt-2'
            >
                <p className='text-xs text-black m-0 flex-1 min-w-0'>
                    <span className='text-xs text-gray-400 font-semibold mr-2'>
                        {/* 如果索引小于9，则前面加0，否则直接显示索引 */}
                        {
                            index < 9 ?
                            `0${index + 1}` :
                            index + 1
                        }  
                    </span>
                    {/* 显示任务 */}
                    {item}
                </p>

                <button
                  // 点击删除任务
                  onClick={() => handleDeleteOption(index)}
                  // flex-shrink-0 表示不收缩
                  className='cursor-pointer flex-shrink-0'
                >
                    {/*  */}
                    <Trash className='text-lg text-red-500' />
                </button>
            </div>
      ))}


      <div className='flex items-center gap-5 mt-4'>
        {/* 输入框 */}
        <input
          type="text"
          placeholder='Enter Task'
          // 输入框的值
          value={option ?? ''}
          onChange={(e) => setOption(e.target.value ?? '')}
          className='w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md'
        />
        <button onClick={handleAddOption} className='card-btn text-nowrap'>
          <Plus className='text-lg' /> Add
        </button>
      </div>
    </div>
  )
}

export default TodoListInput