import React, { useState } from 'react'
import { X, Image } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'


// icon	当前图标
// onSelect	选择 emoji 后执行
const EmojiPickerPopup = ({ icon, onSelect }) => {

  // 表示是否打开选择器
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex flex-col items-start gap-3 mb-6'>
        {/* select-none 表示不选择文本 */}
        <div
          className='flex items-center gap-4 cursor-pointer select-none'
          onClick={() => setIsOpen((open) => !open)}
          role='button'
          // tabIndex 表示元素可以获得焦点
          tabIndex={0}
          // onKeyDown 表示按下键盘时执行
          // e.key === 'Enter' 表示按下回车键
          // e.key === ' ' 表示按下空格键
          // e.preventDefault() 表示阻止默认行为
          // setIsOpen((o) => !o) 表示打开/关闭选择器
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen((o) => !o) } }}
        >
            <div className='w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-purple-500 rounded-lg'>
                {/* 如果 icon 存在，则显示 icon */}
                {icon ? (
                  // 如果 icon 是字符串，并且长度小于等于2，则显示 icon
                  typeof icon === 'string' && icon.length <= 2 ? (
                    <span className='text-2xl'>{icon}</span>
                  ) : (
                    // 如果 icon 是图片 URL，则显示图片
                    <img src={icon} alt='icon' className='w-12 h-12 object-contain' />
                  )
                ) : (
                  // 如果 icon 不存在，则显示默认图标
                  <Image />
                )}
            </div>
            <p className='text-black'>{icon ? 'Change Icon' : 'Select Icon'}</p>
        </div>

        {/* 选择器固定出现在下方 */}
        {isOpen && (
            // z-[120] 表示选择器层级为 120
            <div className='relative z-[120] mt-1'>
                {/* -top-2 -right-2 元素会 向上 8px，向右 8px 超出父元素 */}
                <button
                  type='button'
                  className='w-7 h-7 flex items-center justify-center bg-white border border-gray-200 
                  rounded-full absolute -top-2 -right-2 z-10 cursor-pointer shadow'
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
                  // aria-label='Close' 表示关闭按钮的标签
                  aria-label='Close'
                >
                    <X size={14} />
                </button>
                <EmojiPicker
                  // onEmojiClick 表示选择表情时执行
                  onEmojiClick={(emojiData) => {
                    // 如果 emojiData?.emoji 存在，则使用 emojiData?.emoji
                    // 如果 emojiData?.emoji 不存在，则使用 emojiData?.imageUrl
                    // 如果 emojiData?.emoji 和 emojiData?.imageUrl 都不存在，则使用空字符串
                    onSelect(emojiData?.emoji ?? emojiData?.imageUrl ?? '')
                    // 关闭选择器
                    setIsOpen(false)
                  }}
                />
            </div>
        )}
    </div>
  )
}

export default EmojiPickerPopup