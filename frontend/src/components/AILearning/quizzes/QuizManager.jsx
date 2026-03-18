import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import quizService from '../../../services/quizService';
import aiService from '../../../services/aiService';
import { Plus } from 'lucide-react';
import Button from '../../common/Button';
import QuizCard from './QuizCard';
import EmptyState from '../../common/EmptyState';
import Spinner from '../../common/Spinner';
import Modal from '../../common/Modal';

function QuizManager({ documentId }) {

  // 使用 React 的 useState 钩子，管理 quizzes 列表
  const [quizzes, setQuizzes] = useState([]);
  // 使用 React 的 useState 钩子，管理 loading 状态
  const [loading, setLoading] = useState(true);

  // 使用 React 的 useState 钩子，管理 generating 状态
  const [generating, setGenerating] = useState(false);
  // 使用 React 的 useState 钩子，管理 isGenerateModalOpen 状态
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  // 使用 React 的 useState 钩子，管理 numQuestions 状态
  const [numQuestions, setNumQuestions] = useState(5);

  // 使用 React 的 useState 钩子，管理 isDeleteModalOpen 状态
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // 使用 React 的 useState 钩子，管理 deleting 状态
  const [deleting, setDeleting] = useState(false);
  // 使用 React 的 useState 钩子，管理 selectedQuiz 状态
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // 异步函数 fetchQuizzes，用于从后端获取某个 document 的 quizzes 数据，然后更新 React 的 state
  const fetchQuizzes = async () => {
    // 设置 loading 为 true
    setLoading(true);
    // 尝试获取 quizzes 数据
    try {
      const data = await quizService.getQuizzesForDocument(documentId);

      // 兼容返回: [] / { data: [] } / { quizzes: [] }
      const list =
        // 如果 data 本身就是数组 → 直接用 data
        Array.isArray(data) ? data :
        // 如果 data.data 是数组 → 用 data.data
        Array.isArray(data?.data) ? data.data :
        // 如果 data.quizzes 是数组 → 用 data.quizzes
        Array.isArray(data?.quizzes) ? data.quizzes :
        [];

      // 更新 quizzes 列表
      setQuizzes(list);
    } catch (error) {
      console.error('fetchQuizzes error:', error);
      // 显示错误信息
      toast.error('Failed to fetch quizzes');
      // 清空 quizzes 列表
      setQuizzes([]);
    } finally {
      // 设置 loading 为 false
      setLoading(false);
    }
  };

  // 组件加载时执行副作用代码
  // 当 documentId 变化时，重新获取 quizzes 数据
  useEffect(() => {
    // 如果 documentId 不存在，则清空 quizzes 列表，设置 loading 为 false
    if (!documentId) {
      // 清空 quizzes 列表
      setQuizzes([]);
      // 设置 loading 为 false
      setLoading(false);
      return;
    }
    // 调用 fetchQuizzes 函数，获取 quizzes 数据
    fetchQuizzes();
  }, [documentId]);

  // 生成 quiz 的异步函数
  const handleGenerateQuiz = async (e) => {
    // 阻止表单默认行为
    e.preventDefault();
    if (!documentId) return;

    setGenerating(true);
    try {
      // 调用 aiService 的 generateQuiz 函数，生成 quiz 数据
      await aiService.generateQuiz(documentId, { numQuestions });
      // 显示成功信息
      toast.success('Quiz generated successfully');
      // 关闭生成模态框
      setIsGenerateModalOpen(false);
      // 重新获取 quizzes 数据
      await fetchQuizzes();
    } catch (error) {
      console.error('generateQuiz error:', error);
      toast.error(error?.message || 'Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  // 处理删除请求的函数
  const handleDeleteRequest = (quiz) => {
    // 设置选中的 quiz
    setSelectedQuiz(quiz);
    // 打开删除模态框
    setIsDeleteModalOpen(true);
  };

  // 确认删除的异步函数
  const handleConfirmDelete = async () => {
    // 如果要删除的 quiz 不存在，则返回
    if (!selectedQuiz?._id) return;
    // 设置正在删除
    setDeleting(true);

    try {
      // 调用 quizService 的 deleteQuiz 函数，删除 quiz 数据
      await quizService.deleteQuiz(selectedQuiz._id);

      // 显示成功信息
      toast.success(`'${selectedQuiz.title || 'this quiz'}' deleted successfully`);
      // 关闭删除模态框
      setIsDeleteModalOpen(false);

      // 保留 callback 返回 true 的元素
      // 保留所有 _id 不等于 selectedQuiz._id 的 quiz，即删除 id 相同的 quiz
      setQuizzes((prev) => prev.filter((q) => q?._id !== selectedQuiz._id));
      // 清空选中的 quiz
      setSelectedQuiz(null);
    } catch (error) {
      console.error('deleteQuiz error:', error);
      toast.error(error?.message || 'Failed to delete quiz');
    } finally {
      setDeleting(false);
    }
  };

  const renderQuizContent = () => {
    // 如果正在加载，则显示加载中组件
    if (loading) return <Spinner />;

    // 如果 quizzes 是数组，则使用 quizzes，否则使用空数组
    const list = Array.isArray(quizzes) ? quizzes : [];
    // 如果 quizzes 为空，则显示空状态组件
    if (list.length === 0) {
      return (
        <EmptyState
          title="No quizzes yet"
          description="Generate a quiz from your document to get started"
        />
      );
    }

    return (
      // 使用 grid 布局，显示 quizzes 列表
      // 1 列 -> 2 列 -> 3 列 -> 4 列
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {list.map((quiz, index) => (
          // 遍历 quizzes 列表，把每个 quiz 渲染成一个 QuizCard 组件
          <QuizCard
            // key：表示 quiz 的唯一标识
            key={quiz?._id ?? quiz?.id ?? index}
            // quiz：表示 quiz 数据
            quiz={quiz}
            onDelete={handleDeleteRequest}   // ✅ 关键修复点
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex justify-end mb-4 gap-2">
        {/* 生成 quiz 按钮 */}
        <Button onClick={() => setIsGenerateModalOpen(true)} className='cursor-pointer'>
          <Plus size={16} />
          Generate Quiz
        </Button>
      </div>

      {/* 渲染 quiz 内容 */}
      {renderQuizContent()}

      {/* 生成 quiz 模态框 */}
      <Modal
        isOpen={isGenerateModalOpen}
        // 关闭模态框
        onClose={() => !generating && setIsGenerateModalOpen(false)}
        // 模态框标题
        title="Generate New Quiz"
      >
        {/* 生成 quiz 表单 */}
        <form onSubmit={handleGenerateQuiz} className="space-y-4">
          {/* 问题数量输入框 */}
          <div>
            {/* 问题数量标签 */}
            <label className="block text-xs text-neutral-700 font-medium mb-1.5">
              {/* 问题数量文本 */}
              Number of Questions
            </label>
            {/* 问题数量输入框 */}
            <input
              // 类型为 number
              type="number"
              // 问题数量值
              value={numQuestions}
              // 问题数量变化时，更新问题数量
              onChange={(e) =>
                // 问题数量最小为 1
                // parseInt(e.target.value, 10)：将输入框的值转换为整数，10 表示十进制
                // Math.max(1, parseInt(e.target.value, 10) || 1)：将输入框的值与 1 比较，取最大值
                setNumQuestions(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              // 问题数量最小为 1
              min="1"
              // 必填
              required
              className="w-full h-9 px-3 border-2 border-neutral-200 rounded-lg bg-white
              text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {/* Cancel 不能是 submit */}
            <Button
              type="button"
              variant="secondary"
              // 关闭生成模态框
              onClick={() => setIsGenerateModalOpen(false)}
              disabled={generating}
            >
              Cancel
            </Button>

            {/* 生成 quiz 按钮 */}
            <Button type="submit" disabled={generating}>
              {/* 如果正在生成，则显示加载状态 */}
              {generating ? 'Generating...' : 'Generate Quiz'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 删除 quiz 模态框 */}
      <Modal
        isOpen={isDeleteModalOpen}
        // 关闭模态框
        onClose={() => !deleting && setIsDeleteModalOpen(false)}
        // 模态框标题
        title="Confirm Delete Quiz"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Are you sure you want to delete this quiz:{' '}
            <span className="font-semibold text-neutral-900">
              {selectedQuiz?.title || 'this quiz'}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>

            {/* 删除 quiz 按钮 */}
            <button
              type="button"
              onClick={handleConfirmDelete}
              // 如果正在删除，则禁用按钮
              disabled={deleting}
              className='px-5 h-11 bg-linear-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 disabled:active:scale-100'
            >
              {/* 如果正在删除，则显示加载状态 */}
              {deleting ? 'Deleting...' : 'Delete Quiz'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default QuizManager;