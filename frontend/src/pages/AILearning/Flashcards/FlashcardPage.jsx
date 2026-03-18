import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import flashcardService from '../../../services/flashcardService';
import toast from 'react-hot-toast';
import Flashcard from '../../../components/AILearning/flashcards/Flashcard';
import Button from '../../../components/common/Button';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../../components/common/PageHeader';
import Spinner from '../../../components/common/Spinner';
import EmptyState from '../../../components/common/EmptyState';
import Modal from '../../../components/common/Modal';

function FlashcardPage() {



  // useParams() 是 React Router 提供的 Hook，用来获取 URL 里的参数。
  // 这里从 URL 中获取 id 参数。
  // id: documentId 表示 把 id 重命名为 documentId。
  const { id: documentId } = useParams();
  // 用来存储 flashcard 的集合（组）
  // 初始值是空数组 []
  const [flashcardSets, setFlashcardSets] = useState([]);
  // 存储 具体的 flashcard 卡片
  // 也是一个数组
  const [flashcards, setFlashcards] = useState([]);
  // 表示页面是否在加载数据
  const [loading, setLoading] = useState(true);
  // 表示是否正在生成 flashcards（比如 AI 生成）。
  const [generating, setGenerating] = useState(false);
  // 表示当前显示第几张卡片
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  // 表示是否打开删除模态框
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // 表示是否正在删除 flashcard 集合
  const [deleting, setDeleting] = useState(false);


  // 异步函数 fetchFlashcardCards，用于从后端获取某个 document 的 flashcards 数据，然后更新 React 的 state
  const fetchFlashcardCards = async () => {

    // 把 loading 状态设为 true。
    // 作用：页面可以显示加载状态，防止用户看到空白页面。
    setLoading(true);
    try {
      // 调用 flashcardService 的 getFlashcardsForDocument 方法，获取某个 document 的 flashcards 数据
      const response = await flashcardService.getFlashcardsForDocument(documentId);
      // 从 response 中获取数据，如果数据为空，则设置为空数组 []
      const sets = response?.data ?? [];

      // 把 flashcard sets 保存到 state
      setFlashcardSets(sets);
      // 默认加载第一组 cards
      setFlashcards(sets?.[0]?.cards ?? []);
    } catch (error) {
      // 显示错误信息
      toast.error('Failed to fetch flashcard cards');
      // 打印错误信息
      console.error(error);
    } finally {
      // 请求结束后：页面停止 loading。
      setLoading(false);
    }
  };

  // 组件加载时执行副作用代码
  // 当 documentId 变化时，重新获取 flashcard 数据
  useEffect(() => {
    fetchFlashcardCards();
  }, [documentId]);


  // 生成 flashcards 的异步函数
  const handleGenerateFlashcards = async () => {

    // 把 generating 状态设为 true。
    // 作用：页面可以显示生成状态，防止用户看到空白页面。
    setGenerating(true);
    try {
      // 调用 flashcardService 的 generateFlashcards 方法，生成 flashcards 数据
      await flashcardService.generateFlashcards(documentId);
      // 显示成功信息
      toast.success('Flashcards generated successfully');
      // 重新获取 flashcard 数据
      fetchFlashcardCards();
    } catch (error) {
      // 显示错误信息
      toast.error(error.message || 'Failed to generate flashcards');
    } finally {
      // 请求结束后：
      // generating 状态设为 false。
      // 页面停止 generating。
      setGenerating(false);
    }
  };

  // 下一页的异步函数
  const handleNextCard = () => {
    // 记录当前卡片
    // 在切换卡片之前，记录当前卡片的学习状态
    handleReview(currentCardIndex);
    // 切换到下一张
    // 当前索引加 1，如果超过最后一张，就回到第 0 张
    // % 是取模运算符，用于计算余数
    setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    handleReview(currentCardIndex);
    // 当前索引减 1，如果已经是第 0 张，就跳到最后一张
    // 防止结果变成负数，所以加 flashcards.length
    setCurrentCardIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
  };



  // 记录用户对当前 Flashcard 的复习行为，并把数据发送到后端
  const handleReview = async (index) => {
    // 这里从 flashcards 数组中取出 当前显示的卡片
    const currentCard = flashcards[currentCardIndex];
    // 如果当前卡片不存在，则返回
    if (!currentCard) return;
    try {
      // 调用 flashcardService 的 reviewFlashcard 方法，记录用户对当前 Flashcard 的复习行为，并把数据发送到后端
      await flashcardService.reviewFlashcard(currentCard._id, index);
      // 显示成功信息
      toast.success('Flashcard reviewed successfully');
    } catch (error) {
      // 显示错误信息
      toast.error(error.message || 'Failed to review flashcard');
    }
  };


  // 收藏 Flashcard 的异步函数
  const handleToggleStar = async (cardId) => {
    try {
      // 调用 flashcardService 的 toggleStar 方法，收藏 Flashcard
      await flashcardService.toggleStar(cardId);
      // 更新 flashcards 数组，把当前卡片的收藏状态设为相反的值
      setFlashcards((prevFlashcards) =>
        // map 会遍历整个数组，并返回一个 新数组
        // React 推荐这种方式更新 state，因为：state 必须不可变 (immutable)
        prevFlashcards.map((card) =>
          // 如果当前遍历到的卡片 ID 和点击的 ID 相同：说明就是要修改的那张卡
          // ...card  复制原来的卡片数据
          // !card.isStarred 取相反值
          // 不匹配的卡片保持不变
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        )
      );
      // 显示成功信息
      toast.success('Flashcard starred successfully');
    } catch (error) {
      // 显示错误信息
      toast.error(error.message || 'Failed to toggle star');
    }
  };

  // 删除 Flashcard 集合的异步函数
  const handleDeleteFlashcardSet = async (set) => {
    // 如果集合 ID 不存在，则返回
    if (!set?._id) return;
    // 把 deleting 状态设为 true。
    // 作用：页面可以显示删除状态，防止用户看到空白页面。
    setDeleting(true);
    try {
      // 调用 flashcardService 的 deleteFlashcardSet 方法，删除 Flashcard 集合
      await flashcardService.deleteFlashcardSet(set._id);
      // 显示成功信息
      toast.success('Flashcard set deleted successfully');
      // 关闭删除模态框
      setIsDeleteModalOpen(false);
      // 重新获取 flashcard 数据
      fetchFlashcardCards();
    } catch (error) {
      // 显示错误信息
      toast.error(error.message || 'Failed to delete flashcard set');
    } finally {
      // 请求结束后：
      // deleting 状态设为 false。
      // 页面停止 deleting。
      setDeleting(false);
    }
  };


  // 这段代码是一个 React 渲染函数（render helper），用于根据不同状态显示不同的 UI，比如 加载中、没有数据、正常显示 flashcard
  const renderFlashcardContent = () => {
    // 如果正在加载数据，则显示加载状态
    if (loading) {
      return <Spinner />;
    }

    // 如果没有数据，则显示空状态
    if (flashcards.length === 0) {
      return (
        <EmptyState
          title='No flashcards found'
          description='No flashcards found for this document to study'
        />
      );
    }

    // 从 flashcards 数组中取出当前正在学习的卡片
    const currentCard = flashcards[currentCardIndex];

    return (
      <div className='flex flex-col items-center space-y-6'>
        <div className='w-full max-w-md'>
          {/* 显示当前卡片 */}
          <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
        </div>
        <div className='flex items-center gap-4'>
          <Button
            onClick={handlePrevCard}
            variant='secondary'
            // 如果卡片数量小于等于 1，则禁用按钮
            disabled={flashcards.length <= 1}
          >
            <ChevronLeft size={16} />
            Previous
          </Button>
          <span className='text-sm font-medium text-neutral-600'>
            {currentCardIndex + 1} / {flashcards.length}
          </span>
          <Button
            onClick={handleNextCard}
            variant='secondary'
            // 如果卡片数量小于等于 1，则禁用按钮
            disabled={flashcards.length <= 1}
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className='mb-4'>
        {/* 返回文档页面 */}
        <Link
          to={`/documents/${documentId}`}
          className='inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200'
        >
          <ArrowLeft size={16} />
          Back to Document
        </Link>
      </div>
      <PageHeader title='Flashcards'>
        <div className='flex gap-2'>
          {/* 如果不在加载数据，并且有卡片，则显示删除按钮 */}
          {!loading && (
            // 如果卡片数量大于 0，则显示删除按钮
            flashcards.length > 0 ? (
              <>
                <Button
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={deleting}
                >
                  <Trash2 size={16} />
                  Delete Set
                </Button>
              </>
            ) : (
              // 如果卡片数量为 0，则显示生成按钮
              <Button
                onClick={handleGenerateFlashcards}
                disabled={generating}
              >
                {generating ? (
                  // 如果正在生成，则显示加载状态
                  <Spinner />
                ) : (
                  <>
                    // 如果不在生成，则显示生成按钮
                    <Plus size={16} />
                    Generate Flashcards
                  </>
                )}
              </Button>
            )
          )}
        </div>
      </PageHeader>

      {/* 显示卡片内容 */}
      {renderFlashcardContent()}

      {/* 删除模态框 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Confirm Delete Flashcard Set'
      >
        <div className='space-y-4'>
          <p className='text-sm text-neutral-600'>
            Are you sure you want to delete all flashcard for this document?
            This action cannot be undone and all flashcards will be permanently removed.
          </p>
          <div className='flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type='button'
              onClick={() => handleDeleteFlashcardSet(flashcardSets[0])}
              // 如果正在删除，则禁用按钮
              disabled={deleting}
              className='bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500'
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FlashcardPage;
