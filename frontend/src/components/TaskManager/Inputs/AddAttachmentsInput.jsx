import React, { useState } from 'react'
import { Paperclip, Trash, Plus } from 'lucide-react';

function AddAttachmentsInput({ attachments, setAttachments }) {


  const [option, setOption] = useState('');

  const handleAddOption = () => {
    // 去除空格
    const trimmed = (option ?? '').trim();
    if (trimmed !== '') {
      setAttachments([...(attachments || []), trimmed]);
      setOption('');
    }
  }


  const handleDeleteOption = (index) => {
    // 过滤掉当前索引的附件
    const updateArr = (attachments || []).filter((_, i) => i !== index);
    setAttachments(updateArr);
  }


  return (
    <div>
        {
            // 遍历链接列表
            (attachments || []).map((item, index) => (
                <div key={item} className='flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2'>
                    {/* min-w-0 表示最小宽度为0 */}
                    <div className='flex-1 flex items-center gap-3 min-w-0'>
                        {/* flex-shrink-0 表示不收缩 */}
                        <Paperclip className='text-gray-400 flex-shrink-0' />
                        {/* truncate 表示超出隐藏 */}
                        <p className='text-xs text-black truncate'>{item}</p>
                    </div>

                    <button onClick={() => handleDeleteOption(index)} className='cursor-pointer'>
                        <Trash className='text-lg text-red-500' />
                    </button>
                </div>
            ))
        }

        <div className='flex items-center gap-5 mt-4'>
            <div className='flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3'>

                <Paperclip className='text-gray-400' />

                <input
                   type='text'
                   placeholder='Add File Link'
                   // 输入框的值
                   value={option ?? ''}
                   // 输入框的值改变时，更新状态
                   onChange={(e) => setOption(e.target.value ?? '')}
                   className='w-full text-[13px] text-black outline-none bg-white py-2'
                />
            </div>

            <button onClick={handleAddOption} className='card-btn text-nowrap'>
                <Plus className='text-lg' /> Add
            </button>
        </div>
    </div>
  )
}

export default AddAttachmentsInput