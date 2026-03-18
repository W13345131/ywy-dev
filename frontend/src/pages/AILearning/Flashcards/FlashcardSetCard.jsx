import React from 'react'
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import moment from 'moment';

function FlashcardSetCard({ flashcardSet }) {


  // useNavigate() 是 React Router v6 的 Hook。
  // 用来跳转页面。
  const navigate = useNavigate();

  // 点击 Study Now 按钮时触发
  const handleStudyNow = () => {
    // 先尝试 documentId._id
    // 如果没有再尝试 document._id
    const docId = flashcardSet?.documentId?._id ?? flashcardSet?.document?._id;
    // 如果 docId 不存在，则返回
    if (!docId) return;
    // 跳转到 /documents/:id/flashcards 页面
    navigate(`/documents/${docId}/flashcards`);
  };

  // 计算已经复习过的卡片数量
  // filter() 用于 筛选数组元素。
  // 意思是：筛选出 lastReviewed 为 true 或存在的卡片
  const reviewedCount = (flashcardSet?.cards ?? []).filter(card => card.lastReviewed).length;
  // 计算总卡片数量
  const totalCount = (flashcardSet?.cards ?? []).length;
  // 计算进度百分比
  // Math.round() 四舍五入
  const progressPercentage = totalCount > 0 ? Math.round((reviewedCount / totalCount) * 100) : 0;



  return (
    <div
      className='group relative bg-white/80 backdrop-blur-xl border-2 
      border-slate-200 hover:border-emerald-300 rounded-2xl p-6 cursor-pointer transition-all duration-200
      hover:shadow-emerald-500/10 flex flex-col justify-between'
      onClick={handleStudyNow}
    >
        <div className='space-y-4'>
            <div className='flex items-start gap-4'>
                {/* shrink-0 表示元素不会被压缩，保持原始大小 */}
                <div className='shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-emerald-100
                to-teal-100 flex items-center justify-center'>
                    <BookOpen className='w-6 h-6 text-emerald-600' strokeWidth={2} />
                </div>           
            {/* flex-1 让元素填满剩余空间
            min-w-0 允许元素缩小 */}
            <div className='flex-1 min-w-0'>
                <h3 className='text-base font-semibold text-slate-900 line-clamp-2 mb-2' title={flashcardSet?.documentId?.title ?? flashcardSet?.document?.title}>{flashcardSet?.documentId?.title ?? flashcardSet?.document?.title}</h3>
                <p className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                    {/* moment(flashcardSet.createdAt).fromNow() 格式化创建时间 */}
                    Created {moment(flashcardSet.createdAt).fromNow()}
                </p>
            </div>
        </div>

        {/* Stats */}
        <div className='flex items-center gap-3 pt-2'>

            <div className='px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg whitespace-nowrap'>
                <span className='text-sm font-semibold text-emerald-700'>
                    {totalCount} {totalCount === 1 ? 'Card' : 'Cards'}
                </span>
            </div>
            {
                // 如果已经复习过的卡片数量大于 0，则显示进度条
                reviewedCount > 0 && (
                    <div className='flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg'>
                        {/* strokeWidth={2.5} 设置图标线条宽度 */}
                        <TrendingUp className='w-3.5 h-3.5 text-emerald-600' strokeWidth={2.5} />
                        <span className='text-sm font-semibold text-emerald-700'>
                            {progressPercentage}%
                        </span>
                    </div>
                )
            }
        </div>

        {/* Progress Bar */}
        {
            // 如果总卡片数量大于 0，则显示进度条
            totalCount > 0 && (
                // space-y-2 表示元素之间有 2 个单位的间距
                <div className='space-y-2'>
                    {/* flex items-center justify-between 表示元素水平居中，并且两边对齐 */}
                    <div className='flex items-center justify-between'>
                        <span className='text-xs font-medium text-slate-600'>
                            Progress
                        </span>
                        <span className='text-xs font-semibold text-slate-700'>
                            {reviewedCount} / {totalCount} reviewed
                        </span>
                    </div>
                    <div className='relative h-2 bg-slate-100 rounded-full overflow-hidden'>
                        <div
                          className='absolute inset-y-0 left-0 bg-linear-to-r from-emerald-500 
                          to-teal-500 rounded-full transition-all duration-500 ease-out'
                          // style={{ width: `${progressPercentage}%` }} 设置进度条宽度
                          style={{
                            width: `${progressPercentage}%`
                          }}
                        />
                    </div>
                </div>
            )}
        </div>

        {/* Study Button */}
        <div className='mt-6 pt-4 border-t border-slate-100'>
            <button
              onClick={(e) => {
                // e.stopPropagation() 阻止事件冒泡
                e.stopPropagation();
                handleStudyNow();
              }}
              // relative 让内部 绝对定位元素（高光动画）以按钮为参考
              className='group/btn relative w-full h-11 bg-linear-to-r from-emerald-50 to-teal-100 hover:from-emerald-600 text-emerald-700
              hover:text-white font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 overflow-hidden' 
            >
                <span className='relative z-10 flex items-center justify-center gap-2'>
                    <Sparkles className='w-4 h-4' strokeWidth={2.5} />
                    Study Now
                </span>
                {/* // 给按钮添加一个“扫光(shine / shimmer)动画效果
                // 初始位置：在按钮左侧外面
                // ↓
                // hover按钮
                // ↓
                // 光带滑过按钮
                // ↓
                // 移动到右侧外面 */}
                <div className='absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0
                -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700' />
            </button>
        </div>
    </div>
  )
}

export default FlashcardSetCard