import React from 'react'
import toast from 'react-hot-toast';
import quizService from '../../../services/quizService';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import Spinner from '../../../components/common/Spinner';
import PageHeader from '../../../components/common/PageHeader';
import Button from '../../../components/common/Button';



function QuizTakePage() {

  // 获取 URL 中的 id 参数
  const { id } = useParams();
  // 使用 useNavigate() 获取跳转函数
  const navigate = useNavigate();
  // 用来存储 quiz 数据
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // 用来存储当前问题索引
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // 用来存储选中的答案
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // 用来存储是否提交
  const [submitted, setSubmitted] = useState(false);

  // 使用 useEffect() 获取 quiz 数据
  useEffect(() => {
    // 如果 id 不存在，则设置 loading 为 false
    if (!id) {
      setLoading(false);
      // 如果 id 不存在，则返回
      return;
    }
    // 异步函数, 请求 quiz 数据
    const fetchQuiz = async () => {
      try {
        // 调用 quizService 的 getQuizById 方法，获取 quiz 数据
        const data = await quizService.getQuizById(id);
        // 把获取到的数据设置到 quiz 中
        setQuiz(data?.data ?? data);
      } catch (error) {
        // 显示错误信息
        toast.error('Failed to fetch quiz');
        // 打印错误信息
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    // 调用 fetchQuiz 函数, 请求 quiz 数据
    fetchQuiz();
  }, [id]);


  // 处理用户选择题目答案的函数，用于在用户点击选项时更新答案状态
  const handleOptionChange = (questionId, optionIndex) => {
    // ...prev; 展开之前所有答案
    setSelectedAnswers(prev => ({
      ...prev,
      // 更新当前题目答案索引
      [questionId]: optionIndex,
    }));
  };

  // 处理用户点击下一题的函数，用于在用户点击下一题时更新当前问题索引
  const handleNextQuestion = () => {
    // 如果当前问题索引小于题目数量 - 1，则更新当前问题索引
    if(currentQuestionIndex < quiz?.questions.length - 1) {
      // 更新当前问题索引
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // 处理用户点击上一题的函数，用于在用户点击上一题时更新当前问题索引
  const handlePreviousQuestion = () => {
    // 如果当前问题索引大于 0，则更新当前问题索引
    if(currentQuestionIndex > 0) {
      // 更新当前问题索引
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // 处理用户提交 quiz 的函数，用于在用户点击提交时更新 quiz 状态
  const handleSubmitQuiz = async () => {
    // 设置提交状态为 true; 表示正在提交 quiz
    setSubmitted(true);

    try {

      const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, answerIndex]) => {
        // 根据 questionId 查找问题
        const question = quiz.questions.find(q => q._id === questionId);
        // 根据 questionId 查找问题索引
        const questionIndex = quiz.questions.findIndex(q => q._id === questionId);
        // 根据 questionIndex 查找问题选项
        const option = question.options[questionIndex];
        // 根据 answerIndex 查找用户选择的答案
        const selectedAnswer = question.options[answerIndex];

        // 返回用户选择的答案
        return {
          questionIndex,
          selectedAnswer,
        }
      });

      // 调用 quizService 的 submitQuiz 方法，提交 quiz
      await quizService.submitQuiz(id, formattedAnswers);
      // 显示成功信息
      toast.success('Quiz submitted successfully');
      // 跳转至 quiz 结果页面
      navigate(`/quizzes/${id}/results`);
    } catch (error) {
      // 显示错误信息
      toast.error(error.message || 'Failed to submit quiz');
    } finally {
      // 设置提交状态为 false; 表示提交完成
      setSubmitted(false);
    }
  }

  // 如果正在加载数据，则显示加载状态
  if(loading) {
    return (
      <div>
        <Spinner />
      </div>
    )
  }

  // 如果 quiz 不存在或没有问题，则显示错误信息
  if (!quiz || !quiz?.questions?.length) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <p className='text-slate-600 text-lg'>
            Quiz not found or no questions available.
          </p>
        </div>
      </div>
    )
  }

  // 获取当前问题
  const currentQuestion = quiz.questions?.[currentQuestionIndex];

  // 如果当前问题不存在，则显示错误信息
  if (!currentQuestion) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <p className='text-slate-600 text-lg'>Invalid question index.</p>
        </div>
      </div>
    );
  }

  // 确保当前题目存在，并且有 _id
  // Object.prototype  这是所有普通对象共享的原型对象
  // 借用 Object.prototype 上的 hasOwnProperty 方法，
  // 让它以 selectedAnswers 作为 this 来执行，
  // 并检查 currentQuestion._id 这个属性名。
  const isAnswered = currentQuestion?._id != null && Object.prototype.hasOwnProperty.call(selectedAnswers, currentQuestion._id);
  // 获取已回答问题的数量
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className='max-w-4xl mx-auto'>
      <PageHeader title={quiz.title || 'Take Quiz'} />

      {/* Progress Bar */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm text-slate-700 font-semibold'>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className='text-sm text-slate-500 font-semibold'>
            {answeredCount} answered
          </span>
        </div>
        <div className='relative h-2 bg-slate-100 rounded-full overflow-hidden'>
          {/* 计算进度条百分比 */}
          <div
            className='absolute inset-y-0 left-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out'
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className='bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 mb-8'>
        <div className='inline-flex items-center gap-2 px-4 py-2 bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl mb-6'>
          <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse' />
          <span className='text-sm font-semibold text-emerald-700'>
            Question {currentQuestionIndex + 1}
          </span>
        </div>

        <h3 className='text-lg font-medium text-slate-900 mb-6 leading-relaxed'>
          {currentQuestion?.question}
        </h3>

        {/* Options */}
        <div className='space-y-3'>
          {currentQuestion?.options?.map((option, index) => {
            // 检查当前选项是否被选中
            const isSelected = selectedAnswers[currentQuestion._id] === index;
            // 返回选项标签
            return (
              // 选项标签
              <label
                key={index}
                className={`group relative flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-300 hover:bg-white hover:shadow-md'
                }`}
              >
                <input
                  // 单选框
                  type='radio'
                  // 单选框名称
                  name={`question-${currentQuestion._id}`}
                  // 单选框值
                  value={index}
                  // 单选框是否被选中
                  checked={isSelected}
                  // 处理选项变化
                  onChange={() => handleOptionChange(currentQuestion._id, index)}
                  className='sr-only'
                />

                {/* Custom Radio Button */}
                <div className={`shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                  isSelected
                    // 如果选项被选中，则设置边框颜色为绿色
                    ? 'border-emerald-500 bg-emerald-50'
                    // 如果选项未被选中，则设置边框颜色为灰色
                    : 'border-slate-300 bg-white group-hover:bg-emerald-400'
                }`}>
                  {/* 只有当 isSelected 为 true 时，才渲染里面的内容 */}
                  {isSelected && (
                    <div className='w-full h-full flex items-center justify-center'>
                      <div className='w-2 h-2 bg-white rounded-full' />
                    </div>
                  )}
                </div>

                {/* Option Text */}
                {/* 显示当前选项的文字内容 */}
                <span className={`ml-4 text-sm font-medium transition-colors duration-200 ${
                  isSelected
                    ? 'text-emerald-900'
                    : 'text-slate-700 group-hover:text-slate-900'
                }`}>
                  {option}
                </span>

                {/* 如果选项被选中，则显示对号图标 */}
                {isSelected && (
                  // 对号图标
                  <CheckCircle2 className='ml-auto w-5 h-5 text-emerald-500' strokeWidth={2} />
                )}
              </label>
            );
          })}
        </div>

      </div>

      {/* Navigation Buttons */}
      <div className='flex items-center justify-between gap-4'>
        <Button
          onClick={handlePreviousQuestion}
          // 如果当前问题索引为 0 或正在提交，则禁用按钮
          disabled={currentQuestionIndex === 0 || submitted}
          // 设置按钮样式为次要样式
          variant='secondary'
        >
          // 左箭头图标
          <ChevronLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200' strokeWidth={2.5} />
          Previous
        </Button>
        
        {/* 如果当前问题索引为题目数量 - 1，则显示提交按钮 */}
        {currentQuestionIndex === quiz.questions.length - 1 ? (
          // 提交按钮
            <button
              onClick={handleSubmitQuiz}
              disabled={submitted}
              className='group relative px-8 h-12 bg-linear-to-r from-emerald-500 to-teal-500
              hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl
              transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 
              disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden'
            >
              <span className='relative z-10 flex items-center justify-center gap-2'>
                {submitted ? (
                  <>
                    <div />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className='w-4 h-4' strokeWidth={2.5} />
                    Submit Quiz
                  </>
                )}
              </span>
              <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
              -translate-x-full group-hover:translate-x-full transition-transform duration-700' />
            </button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={submitted}
            >
              Next
              <ChevronRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200' strokeWidth={2.5} />
            </Button>
          )}
      </div>

      {/* Question Navigation Dots */}
      <div className='mt-0 flex items-center justify-center gap-2 flex-wrap'>
        {quiz.questions.map((_, index) => {
          // 检查当前题目是否被回答
          const isAnsweredQuestion = Object.prototype.hasOwnProperty.call(selectedAnswers, quiz.questions[index]._id);
          // 检查当前题目是否为当前题目
          const isCurrentQuestion = index === currentQuestionIndex;
          // 返回题目索引
          return (
            <button
              key={index}
              // 设置当前题目索引
              onClick={() => setCurrentQuestionIndex(index)}
              // 如果正在提交，则禁用按钮
              disabled={submitted}
              // 设置按钮样式
              className={`w-8 h-8 rounded-lg font-semibold text-xs transition-all duration-200 ${
                // 如果当前题目为当前题目，则设置按钮样式为绿色
                isCurrentQuestion
                  ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 scale-110'
                  // 如果当前题目已被回答，则设置按钮样式为绿色
                  : isAnsweredQuestion
                    // 如果当前题目已被回答，则设置按钮样式为绿色
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuizTakePage;