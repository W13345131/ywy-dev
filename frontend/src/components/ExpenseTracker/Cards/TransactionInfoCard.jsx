import React, { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Utensils, Trash2 } from 'lucide-react'

// title	标题
// icon	图标
// date	日期
// amount	金额
// type	类型
// hideDeleteBtn	是否隐藏删除按钮
// onDelete	删除回调
const TransactionInfoCard = ({
    title,
    icon,
    date,
    amount,
    type,
    hideDeleteBtn,
    onDelete
}) => {


  // useState：记录图片加载错误
  const [imgError, setImgError] = useState(false)

  const isImageUrl = (v) => {
    // typeof v !== 'string'：判断 v 是否不是字符串
    // !v.trim()：判断 v 是否为空
    // return false：如果 v 不是字符串或为空，则返回 false
    if (typeof v !== 'string' || !v.trim()) return false

    // v.trim()：去除 v 两端的空格
    const s = v.trim()
    // s.startsWith('http')：判断 s 是否以 http 开头
    // s.startsWith('/')：判断 s 是否以 / 开头
    // s.startsWith('data:')：判断 s 是否以 data: 开头
    // s.startsWith('blob:')：判断 s 是否以 blob: 开头
    // return s.startsWith('http') || s.startsWith('/') || s.startsWith('data:') || s.startsWith('blob:')：如果 s 以 http、/、data: 或 blob: 开头，则返回 true
    return s.startsWith('http') || s.startsWith('/') || s.startsWith('data:') || s.startsWith('blob:')
  }

  const renderIcon = () => {

    // 如果 icon 是图片 URL 且没有加载错误，则显示图片
    if (isImageUrl(icon) && !imgError) {
      return (
        <img
          // icon：图片 URL
          src={icon}
          // title：标题
          alt={title}
          className='w-6 h-6 object-contain'
          // onError：图片加载错误时，设置 imgError 为 true
          onError={() => setImgError(true)}
        />
      )
    }

    return <span className='text-2xl leading-none'>{icon}</span>
  }

  // 获取金额样式
  const getAmountStyle = () => {
    return type == 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
  }

  // 处理删除
  const handleDelete = () => {
    onDelete?.()
  }

  return (
    <div className='group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60'>
        <div className='w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full'>
            {/* 渲染图标 */}
            {renderIcon()}
        </div>

        <div className='flex-1 flex items-center justify-between'>
            {/* 渲染标题和日期 */}
            <div>
                <p className='text-sm font-medium text-gray-700'>{title}</p>
                <p className='text-xs text-gray-400'>{date}</p>
            </div>

            <div className='flex items-center gap-2'>
                {/* 如果 hideDeleteBtn 为 false，则显示删除按钮 */}
                {!hideDeleteBtn && (
                    <button onClick={handleDelete} className='text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                        <Trash2 size={18} />
                    </button>
                )}

                {/* 渲染金额 */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyle()}`}>
                    <h6 className='text-xs font-medium'>
                        {/* 如果 type 为 income，则显示 +，否则显示 - */}
                        {type == 'income' ? '+' : '-'} ${amount}
                    </h6>
                    {/* 如果 type 为 income，则显示向上箭头，否则显示向下箭头 */}
                    {type == 'income' ? (
                        <ArrowUpRight size={18} />
                    ) : (
                        <ArrowDownRight size={18} />
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default TransactionInfoCard