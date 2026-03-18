import React from 'react'
import { useState } from 'react';
import { RotateCcw, Star } from 'lucide-react';


function Flashcard({ flashcard, onToggleStar }) {

  // 表示卡片是否翻面
  const [isFlipped, setIsFlipped] = useState(false);

  // 点击卡片时触发
  const handleFlip = () => {
    // 翻面
    setIsFlipped(!isFlipped);
  }

  return (
    // perspective 用于 3D 变换; perspective 小, 3D 效果越明显
    <div className='relative w-full h-72' style={{ perspective: '1000px' }}>
        <div 
          className={`relative w-full h-full transition-transform duration-500 transform-gpu cursor-pointer`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
          onClick={handleFlip}
        >
            {/* Front of the card */}
            <div
              className='absolute inset-0 w-full h-full bg-white/80 backdrop-blur-xl border-2 border-slate-200/60 
              rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col items-center justify-between p-8'
              // backfaceVisibility: 'hidden', 隐藏背面
              // WebkitBackfaceVisibility: 'hidden', 隐藏背面
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
                {/* Top: difficulty + star */}
                <div className='flex items-center justify-between w-full'>
                    <span className='bg-slate-100 text-[10px] text-slate-600 rounded px-3 py-1 
                    uppercase tracking-wide'>
                        {/* 难度 */}
                        {flashcard?.difficulty}
                    </span>
                    <button
                      onClick={(e) => {
                        // 阻止事件冒泡
                        e.stopPropagation();
                        // 调用父组件的 onToggleStar 函数
                        onToggleStar(flashcard?._id);
                      }}
                      className={`cursor-pointer w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                        ${
                            // 如果卡片是收藏的，则显示黄色
                            (flashcard?.isStarred ?? false)
                            ? 'bg-linear-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/25'
                            // 否则显示灰色
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-amber-500'
                        }
                      `}
                    >
                        {/* 星星图标 */}
                        {/* currentColor: 使用当前颜色(白色) */}
                        <Star className='w-4 h-4' strokeWidth={2} fill={(flashcard?.isStarred ?? false) ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Question */}
                <div className='flex-1 flex items-center justify-center px-4'>
                    <p className='text-lg font-semibold text-slate-900 text-center leading-relaxed'>
                        {flashcard?.question}
                    </p>
                </div>

                {/* Flip Indicator */}
                {/* 翻面指示器 */}
                <div className='flex items-center justify-center gap-2 text-xs text-slate-400 font-medium'>
                    {/* 旋转图标 */}
                    <RotateCcw className='w-3.5 h-3.5' strokeWidth={2} />
                    {/* 点击显示答案 */}
                    <span>Click to reveal answer</span>
                </div>
            </div>

            {/* Back of the card */}
            <div
              className='absolute inset-0 w-full h-full bg-linear-to-br backdrop-blur-xl from-emerald-500 to-teal-500 border-2 border-emerald-400/60 rounded-2xl shadow-xl shadow-emerald-500/30 p-8 flex flex-col items-center justify-between'
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
                {/* Star Button */}
                <div className='flex justify-end w-full'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(flashcard?._id);
                      }}
                      className={`cursor-pointer w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                        ${
                            (flashcard?.isStarred ?? false)
                            ? 'bg-white/30 backdrop-blur-sm text-white border border-white/40'
                            : 'bg-white/20 backdrop-blur-sm text-white/70 border border-white/20 hover:bg-white/30 hover:text-white'
                        }
                      `}
                    >
                        <Star className='w-4 h-4' strokeWidth={2} fill={(flashcard?.isStarred ?? false) ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Answer */}
                <div className='flex-1 flex items-center justify-center px-4 py-6'>
                    <p className='text-base text-white text-center leading-relaxed font-medium'>
                        {flashcard?.answer}
                    </p>
                </div>

                {/* Flip Indicator */}
                <div className='flex items-center justify-center gap-2 text-xs text-white/70 font-medium'>
                    {/* 旋转图标 */}
                    <RotateCcw className='w-3.5 h-3.5' strokeWidth={2} />
                    {/* 点击显示问题 */}
                    <span>Click to see question</span>
                </div>
            </div>
        </div>
        </div>
  )
}


export default Flashcard