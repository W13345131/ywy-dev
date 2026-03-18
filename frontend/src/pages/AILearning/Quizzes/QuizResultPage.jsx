import React from 'react'
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import quizService from '../../../services/quizService';
import toast from 'react-hot-toast';
import Spinner from '../../../components/common/Spinner';
import PageHeader from '../../../components/common/PageHeader';
import { ArrowLeft, Target, Trophy, CheckCircle2, XCircle, BookOpen } from 'lucide-react';

function QuizResultPage() {

  // 获取 URL 参数中的 id
  const { id } = useParams();
  // 设置结果状态
  const [results, setResults] = useState(null);
  // 设置加载状态
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 如果 id 不存在，则设置加载状态为 false
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        // 调用 quizService 的 getQuizResults 方法，获取 quiz 结果
        const data = await quizService.getQuizResults(id);
        // 把获取到的数据设置到 results 中
        setResults(data);
      } catch (error) {
        // 显示错误信息
        toast.error(error?.message || 'Failed to fetch quiz results');
        // 打印错误信息
        console.error(error);
      } finally {
        // 设置加载状态为 false
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  // 如果正在加载数据，则显示加载状态
  if(loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Spinner />
      </div>
    )
  }

  // 如果结果不存在或没有数据，则显示错误信息
  if(!results || !results.data) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <p className='text-slate-600 text-lg'>Quiz results not found.</p>
        </div>
      </div>
    )
  }


  // 对象解构（Destructuring），从 results 对象中取出数据
  const { data: { quiz, results: detailedResults } } = results;
  // 获取 quiz 的得分
  const score = quiz.score;
  // 获取计算总题数
  const totalQuestions = detailedResults.length;
  // 获取正确答案的数量
  const correctAnswers = detailedResults.filter(result => result.isCorrect).length;
  // 获取错误答案的数量
  const incorrectAnswers = totalQuestions - correctAnswers;

  // 根据得分获取等级颜色
  const getGradeColor = (score) => {
    // 如果得分大于等于 80，则返回绿色
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    // 如果得分大于等于 60，则返回黄色
    if (score >= 60) return 'from-amber-500 to-orange-500';
    // 否则返回红色
    return 'from-rose-500 to-red-500';
  }

  // 根据得分获取得分信息
  const getScoreMessage = (score) => {
    // 如果得分大于等于 90，则返回优秀
    if (score >= 90) return 'Outstanding!';
    // 如果得分大于等于 80，则返回良好
    if (score >= 80) return 'Excellent!';
    // 如果得分大于等于 70，则返回一般
    if (score >= 70) return 'Good!';
    // 如果得分大于等于 60，则返回及格
    if (score >= 60) return 'Not bad!';
    // 否则返回继续努力
    return 'keep practicing!';
  }



  return (
    <div className='max-w-5xl mx-auto'>
      <div className='mb-6'>
        {/* 返回文档链接 */}
        <Link
          to={quiz.document?._id ? `/documents/${quiz.document._id}` : '/documents'}
          className='group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors duration-200'
        >
          <ArrowLeft strokeWidth={2} className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' />
          Back to Document
        </Link>  
      </div>

      {/* 页面标题 */}
      <PageHeader title={`${quiz.title || 'Quiz'} Results`} />

      {/* Score Card */}
      <div className='bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl p-8 mb-8 shadow-xl shadow-slate-200/50'>
        <div className='text-center space-y-6'>
          <div className='inline-flex items-center justify-center w-15 h-15 rounded-2xl bg-linear-to-r from-emerald-100 to-teal-100 shadow-lg shadow-emerald-500/25'>
            <Trophy className='w-7 h-7 text-emerald-600' strokeWidth={2} />
          </div>

          <div>
            <p className='text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2'>
              Your Score
            </p>
            <div className={`inline-block text-5xl font-bold bg-linear-to-r ${
              getGradeColor(score)
            } bg-clip-text text-transparent mb-2`}>
              {score}%
            </div>
            <p className='text-lg font-medium text-slate-700'>
              {/* 根据得分获取得分信息 */}
              {getScoreMessage(score)}
            </p>
          </div>

          {/* Stats */}
          <div className='flex items-center justify-center gap-4 pt-4'>
            <div className='flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl'>
              <Target className='w-4 h-4 text-slate-600' strokeWidth={2} />
              <span className='text-sm font-semibold text-slate-700'>
                {/* 计算总题数 */}
                {totalQuestions} Total
              </span>
            </div>
            <div className='flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl'>
              <CheckCircle2 className='w-4 h-4 text-emerald-600' strokeWidth={2} />
              <span className='text-sm font-semibold text-emerald-700'>
                {/* 获取正确答案的数量 */}
                {correctAnswers} Correct
              </span>
            </div>
            <div className='flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl'>
              <XCircle className='w-4 h-4 text-rose-600' strokeWidth={2} />
              <span className='text-sm font-semibold text-rose-700'>
                {/* 获取错误答案的数量 */}
                {incorrectAnswers} Incorrect
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className='space-y-6'>
        <div className='flex items-center gap-3 mb-2'>
          <BookOpen className='w-5 h-5 text-slate-600' strokeWidth={2} />
          <h3 className='text-lg font-semibold text-slate-900'>Detailed Review</h3>
        </div>

        {/* 遍历每一道题的结果，并计算答案的位置和正确性 */}
        {detailedResults.map((result, index) => {
          // 计算用户选择的答案位置
          // findIndex() 会返回 数组中匹配元素的下标
          const userAnswerIndex = result.options.findIndex(opt => opt === result.selectedAnswer);
          // 计算正确答案的位置
          // 情况1：如果是 "O2" 这种格式
          // 10 表示十进制
          // slice(1) 表示从第二个字符开始截取
          // -1 的作用是把题目编号转换成数组索引

          // 第二种情况：正确答案是文本格式
          // 在 options 数组中找到正确答案的位置（index）
          const correctAnswerIndex =
            typeof result.correctAnswer === 'string' && result.correctAnswer.startsWith('O')
              ? parseInt(result.correctAnswer.slice(1), 10) - 1
              : result.options.findIndex(opt => opt === result.correctAnswer);

          // 判断答案是否正确
          const isCorrect = result.isCorrect;

          return (
            <div key={index} className='bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/50'>
              {/* items-start 顶部对齐 */}
              <div className='flex items-start justify-between gap-4 mb-3'>
                {/* flex-1 宽度自适应 */}
                <div className='flex-1'>
                  {/* inline-flex 内联块级元素，可以和其他元素并排显示 */}
                  <div className='inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg mb-3'>
                    {/* text-xs 小字体 */}
                    <span className='text-xs font-semibold text-slate-600'>
                      {/* 显示题目编号 */}
                      Question {index + 1}
                    </span>
                  </div>
                  <h4 className='text-base font-semibold text-slate-900 leading-relaxed'>
                    {result.question}
                  </h4>
                </div>
                {/* 判断答案是否正确，如果正确，则显示绿色，否则显示红色 */}
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  isCorrect
                    ? 'bg-emerald-50 border-2 border-emerald-200'
                    : 'bg-rose-50 border-2 border-rose-200'
                }`}>
                  {/* 如果答案正确，则显示绿色对号 */}
                  {isCorrect ? (
                    <CheckCircle2 className='w-5 h-5 text-emerald-600' strokeWidth={2.5} />
                  ) : (
                    // 如果答案不正确，则显示红色叉号
                    <XCircle className='w-5 h-5 text-rose-600' strokeWidth={2.5} />
                  )}
                </div>
              </div>


              <div className='space-y-3 mb-4'>
                {result.options.map((option, index) => {
                  
                  // 判断是不是正确答案
                  // JavaScript 执行时会按 右 → 左 的逻辑计算
                  // 所以 index === correctAnswerIndex 会先计算 index === correctAnswerIndex，如果为 true，则返回 true，否则返回 false
                  const isCorrectOption = index === correctAnswerIndex;
                  // 判断是不是用户选择的答案
                  const isUserAnswer = index === userAnswerIndex;
                  // 判断是不是错误答案
                  // 用户选了这个选项并且这道题答错，则返回 true
                  const isWrongAnswer = isUserAnswer && !isCorrect;

                  return (
                    // 嵌套三元运算符
                    <div
                      key={index}
                      className={`relative px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        isCorrectOption
                          // 如果选项是正确答案，则显示绿色背景
                          ? 'bg-emerald-50 border-emerald-300 shadow-lg shadow-emerald-500/10'
                          : isWrongAnswer
                          // 如果选项是错误答案，则显示红色背景
                          ? 'bg-rose-50 border-rose-300'
                          // 如果选项是未选择的，则显示灰色背景
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className='flex items-center justify-between gap-3'>
                        <span className={`text-sm font-medium ${
                          isCorrectOption
                            // 如果选项是正确答案，则显示绿色字体
                            ? 'text-emerald-900'
                            : isWrongAnswer
                            // 如果选项是错误答案，则显示红色字体
                            ? 'text-rose-900'
                            // 如果选项是未选择的，则显示灰色字体
                            : 'text-slate-700'
                        }`}>
                          {option}
                        </span>
                        <div className='flex items-center gap-2'>
                          {/* 如果选项是正确答案，则显示绿色对号 */}
                          {isCorrectOption && (
                            <span className='inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-700'>
                              <CheckCircle2 className='w-3 h-3' strokeWidth={2.5} />
                              Correct
                            </span>
                          )}
                          {/* 如果选项是错误答案，则显示红色叉号 */}
                          {isWrongAnswer && (
                            <span className='inline-flex items-center gap-1 px-2 py-1 bg-rose-100 border border-rose-300 rounded-lg text-xs font-semibold text-rose-700'>
                              <XCircle className='w-3 h-3' strokeWidth={2.5} />
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {/* 如果题目有解释，则显示解释 */}
              {result.explanation && (
                <div className='p-4 bg-linear-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl'>
                  <div className='flex items-start gap-3'>
                    <div className='shrink-0 w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center mt-0.5'>
                      <BookOpen className='w-4 h-4 text-slate-600' strokeWidth={2} />
                    </div>
                    <div className='flex-1'>
                      <p className='text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1'>
                        Explanation
                      </p>
                      <p className='text-sm text-slate-700 leading-relaxed'>
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className='mt-8 flex justify-center'>
        <Link to={`/documents/${quiz.document._id}`}>
          <button className='group relative px-8 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600
          text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 
          active:scale-95 overflow-hidden'>
            {/* 返回文档链接 */}
            <span className='relative z-10 flex items-center gap-2'>
              {/* 返回文档链接的图标 */}
              <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' strokeWidth={2.5} />
              Return to Document
            </span>
            {/* 返回文档链接的背景 */}
            <div className='absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full 
            group-hover:translate-x-full transition-transform duration-700' />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default QuizResultPage