import React from 'react'
import { Award, BarChart2, Trash2, Play } from 'lucide-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

function QuizCard({ quiz, onDelete }) {
  return (
    <div className='group relative bg-white/80 backdrop-blur-xl border-2 border-slate-200
    hover:border-emerald-300 rounded-2xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10
    flex flex-col justify-between'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(quiz);
          }}
          className='absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg 
          transition-all duration-200 opacity-0 group-hover:opacity-100'
        >
            {/* 删除按钮 */}
            <Trash2 className='w-4 h-4' strokeWidth={2} />
        </button>

        <div className='space-y-4'>
            {/* 状态 */}
            <div className='inline-flex items-center gap-1.5 py-1 rounded-lg text-xs font-semibold'>
                <div className='flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1'>
                    {/* 奖励图标 */}
                    <Award className='w-3.5 h-3.5 text-emerald-600' strokeWidth={2} />
                    {/* 分数 */}
                    <span className='text-emerald-700'>Score: {quiz?.score}</span>
                </div>
            </div>

            <div>
                <h3
                  className='text-base font-semibold text-slate-900 mb-1 line-clamp-2'
                  title={quiz.title}
                >
                    {quiz.title || `Quiz - ${moment(quiz.createdAt).format('MMM D, YYYY')}`}
                </h3>
                <p className='text-xs text-slate-500 font-medium uppercase tracking-wide'>
                    {/* 创建时间 */}
                    Created {moment(quiz.createdAt).format('MMM D, YYYY')}
                </p>
            </div>


            {/* Quiz Info */}
            <div className='flex items-center gap-3 pt-2 border-t border-slate-100'>
                <div className='px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg'>
                    <span className='text-sm text-slate-700 font-semibold'>
                        {/* 问题数量 */}
                        {quiz.questions.length} {''}
                        {/* 问题数量为 1 时，显示 Question，否则显示 Questions */}
                        {quiz.questions.length === 1 ? 'Question' : 'Questions'}
                    </span>
                </div>
            </div>
        </div>

        {/* 操作按钮 */}
        <div className='mt-2 pt-4 border-t border-slate-100'>
            {/* 如果用户回答了问题，则显示查看结果按钮 */}
            {quiz?.userAnswers?.length > 0 ? (
                <Link to={`/quizzes/${quiz._id}/results`} className=''>
                    {/* 查看结果按钮 */}
                    <button className='group/btn w-full inline-flex items-center justify-center gap-2 h-11 bg-slate-100
                    hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 cursor-pointer'>
                        <BarChart2 className='w-4 h-4' strokeWidth={2.5} /> 
                        View Results
                    </button>
                </Link>
                ) : ( 
                    // 如果用户没有回答问题，则显示开始答题按钮
                    <Link to={`/quizzes/${quiz._id}`} className=''>
                        <button className='group/btn relative w-full h-11 bg-linear-to-r from-emerald-500 
                        to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold 
                        rounded-xl transition-all duration-200 active:scale-95 cursor-pointer'>
                            <span className='relative z-10 flex items-center justify-center gap-2'>
                                <Play className='' strokeWidth={2.5} />
                                Start Quiz
                            </span>
                            <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
                            -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
                        </button>
                    </Link>
                )}
        </div>
    </div>
  )
}
               

export default QuizCard