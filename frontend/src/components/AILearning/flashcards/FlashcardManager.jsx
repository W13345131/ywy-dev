import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import flashcardService from '../../../services/flashcardService';
import { Brain, Sparkles, Trash2, ArrowLeft } from 'lucide-react';
import Spinner from '../../common/Spinner';
import moment from 'moment';
import Flashcard from './Flashcard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../../common/Modal';


function FlashcardManager({ documentId }) {

  // 存储 所有 flashcard 集合
  const [flashcardSets, setFlashcardSets] = useState([]);
  // 存储 当前选中的 flashcard 集合
  const [selectedSet, setSelectedSet] = useState(null);
  // 表示页面是否在加载数据
  const [loading, setLoading] = useState(true);
  // 表示是否正在生成 flashcards（比如 AI 生成）
  const [generating, setGenerating] = useState(false);
  // 表示当前显示第几张卡片
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  // 表示是否打开删除模态框
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // 表示是否正在删除 flashcard 集合
  const [deleting, setDeleting] = useState(false);
  // 存储 要删除的 flashcard 集合
  const [setToDelete, setSetToDelete] = useState(null);

  // 异步函数 fetchFlashcardSets，用于从后端获取某个 document 的 flashcards 数据，然后更新 React 的 state
  const fetchFlashcardSets = async () => {
    // 设置 loading 为 true，表示页面正在加载数据
    setLoading(true);

    try {
        // 调用 flashcardService 的 getFlashcardsForDocument 方法，获取某个 document 的 flashcards 数据
        const response = await flashcardService.getFlashcardsForDocument(documentId);
        // 把获取到的数据设置到 flashcardSets 中
        setFlashcardSets(response.data);
    } catch (error) {
        toast.error('Failed to fetch flashcard sets');
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  // 组件加载时执行副作用代码
  // 当 documentId 变化时，重新获取 flashcard 数据
  useEffect(() => {
    fetchFlashcardSets();
  }, [documentId]);

  // 生成 flashcards 的异步函数
  const handleGenerateFlashcards = async () => {
    // 设置 generating 为 true，表示页面正在生成 flashcards
    setGenerating(true);
    // 调用 flashcardService 的 generateFlashcards 方法，生成 flashcards 数据
    try {
        await flashcardService.generateFlashcards(documentId);
        toast.success('Flashcards generated successfully');
        // 重新获取 flashcard 数据
        fetchFlashcardSets();
    } catch (error) {
        toast.error(error.message || 'Failed to generate flashcards');
    } finally {
        setGenerating(false);
    }
  };


  // 下一页的异步函数
  const handleNextCard = () => {
    if (selectedSet) {
        // 记录当前卡片
        // 在切换卡片之前，记录当前卡片的学习状态
        handleReviewCard(currentCardIndex);
        // 切换到下一张
        // 当前索引加 1，如果超过最后一张，就回到第 0 张
        // % 是取模运算符，用于计算余数
        setCurrentCardIndex(prev => (prev + 1) % selectedSet.cards.length);
    }
  };

  // 上一页的异步函数
  const handlePreviousCard = () => {
    if (selectedSet) {
        // 记录当前卡片
        // 在切换卡片之前，记录当前卡片的学习状态
        handleReviewCard(currentCardIndex);
        // 切换到上一张
        // 当前索引减 1，如果已经是第 0 张，就跳到最后一张
        // 防止结果变成负数，所以加 selectedSet.cards.length
        setCurrentCardIndex(prev => (prev - 1 + selectedSet.cards.length) % selectedSet.cards.length);
    }
  };

  // 记录当前卡片的学习状态的异步函数
  const handleReviewCard = async (index) => {
    // 获取当前卡片
    const currentCard = selectedSet?.cards[currentCardIndex];
    // 如果当前卡片不存在，则返回
    if (!currentCard) return;

    try {
        // 调用 flashcardService 的 reviewFlashcard 方法，记录当前卡片的学习状态
        await flashcardService.reviewFlashcard(currentCard._id, index);
        // 显示成功信息
        toast.success('Flashcard reviewed successfully');
    } catch (error) {
        toast.error('Failed to review flashcard');
    }
  };

  const handleToggleStar = async (cardId) => {

    try {
        // 调用 flashcardService 的 toggleStar 方法，切换当前卡片是否收藏
        await flashcardService.toggleStar(cardId);
        // 更新 flashcardSets 中的卡片状态
        const updatedSets = flashcardSets.map((set) => {
            // 如果当前集合的 ID 和选中的集合的 ID 相同，则更新卡片状态
            if (set._id === selectedSet._id) {
                // 更新卡片状态
                const updatedCards = set.cards.map((card) =>
                    // 如果当前卡片的 ID 和点击的 ID 相同，则更新卡片状态
                    card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
                );
                // 返回更新后的集合
                return { ...set, cards: updatedCards };
            }
            // 返回原来的集合
            return set;
        });
        // 更新 flashcardSets
        setFlashcardSets(updatedSets);
        // 更新选中的集合
        setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
        toast.success('Flashcard starred successfully');
    } catch (error) {
        toast.error('Failed to toggle star');
    }
  };

  // 删除请求的异步函数
  const handleDeleteRequest = (e, set) => {
    // 阻止事件冒泡
    e.stopPropagation();
    // 设置要删除的集合
    setSetToDelete(set);
    // 打开删除模态框
    setIsDeleteModalOpen(true);
  };

  // 确认删除的异步函数
  const handleConfirmDelete = async () => {
    // 如果要删除的集合不存在，则返回
    if (!setToDelete) return;
    // 设置正在删除
    setDeleting(true);
    // 调用 flashcardService 的 deleteFlashcardSet 方法，删除集合
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success('Flashcard set deleted successfully');
      // 关闭删除模态框
      setIsDeleteModalOpen(false);
      // 清空要删除的集合
      setSetToDelete(null);
      // 重新获取 flashcard 数据
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || 'Failed to delete flashcard set');
    } finally {
      setDeleting(false);
    }
  };


  // 选择集合的异步函数
  const handleSelectSet = (set) => {
    // 设置选中的集合
    setSelectedSet(set);
    // 设置当前卡片索引为 0
    setCurrentCardIndex(0);
  };

  // 渲染卡片视图的函数
  const renderFlashcardView = () => {
    // 获取当前卡片
    const currentCard = selectedSet.cards[currentCardIndex];

    return (
        <div className='space-y-8'>
            {/* Back Button */}
            <button
              // 点击返回集合列表
              onClick={() => setSelectedSet(null)}
              className='group inline-flex items-center gap-2 text-sm font-medium text-slate-600 
              hover:text-emerald-600 transition-colors duration-200 cursor-pointer'
            >
                <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' strokeWidth={2} />
                Back to Sets
            </button>

        {/* 卡片视图 */}
        <div className='flex items-center flex-col space-y-8'>
            <div className='w-full mx-auto'>
            {/* 调用 Flashcard 组件，显示当前卡片 */}
            <Flashcard 
              flashcard={currentCard}
              // 调用 handleToggleStar 函数，切换当前卡片是否收藏
              onToggleStar={handleToggleStar}
            />
            </div>

            {/* 上一页、下一页按钮 */}
            <div className='flex items-center gap-6'>
                {/* 上一页按钮 */}
                <button
                  onClick={handlePreviousCard}
                  // 如果卡片数量小于等于 1，则禁用按钮
                  disabled={selectedSet.cards.length <= 1}
                  className='group inline-flex items-center gap-2 px-5 h-11 bg-slate-100 hover:bg-slate-200 
                  text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-95 cursor-pointer'
                >
                    <ChevronLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200' strokeWidth={2.5} />
                    Previous
                </button>

                {/* 当前卡片索引 */}
                <div className='px-4 py-2 bg-slate-100 rounded-lg border border-slate-200'>
                    <span className='text-sm font-semibold text-slate-700'>
                        {currentCardIndex + 1} {''}
                        <span className='text-slate-400 font-normal'>/</span>
                        {selectedSet.cards.length}
                    </span>
                </div>
                <button
                  onClick={handleNextCard}
                  disabled={selectedSet.cards.length <= 1}
                  className='group inline-flex items-center gap-2 px-5 h-11 bg-slate-100 hover:bg-slate-200 
                  text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-50 
                  disabled:cursor-not-allowed disabled:active:scale-100 active:scale-95 cursor-pointer'
                >
                    Next
                    <ChevronRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200' strokeWidth={2.5} />
                </button>
            </div>
        </div>
      </div>
    )
  };

  // 渲染集合列表的函数
  const renderFlashcardSetList = () => {
    // 如果正在加载数据，则显示加载状态
    if (loading) {
        return (
            <div className='flex items-center justify-center py-20'>
                <Spinner />
            </div>
        )
    }

    // 如果没有数据，则显示空状态
    if (flashcardSets.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center py-16 px-6 gap-3'>
                <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100'>
                    <Brain className='w-8 h-8 text-emerald-600' strokeWidth={2} />
                </div>
                <h3 className='text-xl font-semibold text-slate-900 mb-2'>
                    No Flashcards Yet
                </h3>
                <p className='text-sm text-slate-500 mb-8 text-center max-w-sm'>
                    Generate flashcards from your document to get start learning and
                    reinforce your knowledge.
                </p>
                <button
                  // 点击生成 flashcards
                  onClick={handleGenerateFlashcards}
                  // 如果正在生成 flashcards，则禁用按钮
                  disabled={generating}
                  className='group inline-flex items-center gap-2 px-6 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 
                  hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-95'
                >
                    { generating ? (
                        <>
                         <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'>
                            Generating...
                         </div>
                        </>
                    ) : (
                        <>
                         <Sparkles className='w-4 h-4' strokeWidth={2} />
                         Generate Flashcards
                        </>
                    )}
                </button>
            </div>
    
      )};

      return (
        <div className='space-y-6'>
            {/* {Header with Generate Button} */}
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-lg font-semibold text-slate-900'>
                        Your Flashcard Sets
                    </h3>
                    <p className='text-sm text-slate-500 mt-1'>
                        {flashcardSets.length} {''}
                        {flashcardSets.length === 1 ? 'Set' : 'Sets'} available
                    </p>
                </div>
                <button
                  onClick={handleGenerateFlashcards}
                  disabled={generating}
                  className='group inline-flex items-center gap-2 px-6 h-11 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 
                  hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-95'
                >
                    { generating ? (
                        <>
                         <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'>
                            Generating...
                         </div>
                        </>
                    ) : (
                        <>
                         <Sparkles strokeWidth={2} className='w-4 h-4' />
                         Generate New Set
                        </>
                    )}
                </button>
            </div>

            {/* {Flashcard Set List} */}
            {/* 集合列表 */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {/* 遍历集合列表 */}
                {flashcardSets.map((set) => (
                    <div
                      key={set._id}
                      onClick={() => handleSelectSet(set)}
                      className='group relative bg-white/80 backdrop-blur-xl border-2 
                      border-slate-200 hover:border-emerald-300 rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200'
                    >
                        {/* Delete Button */}
                        <button
                         onClick={(e) => handleDeleteRequest(e, set)}
                         className='absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer'
                        >
                            <Trash2 strokeWidth={2} className='w-4 h-4' />
                        </button>

                        {/* 集合内容 */}
                        <div className='space-y-2'>
                            <div className='inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100'>
                                <Brain className='w-6 h-6 text-emerald-600' strokeWidth={2} />
                            </div>
                            <div>
                                <h4 className='text-base font-semibold text-slate-900 mb-1'>
                                    {/* 集合标题 */}
                                    Flashcard Set
                                </h4>
                                <p className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                                    {/* 创建时间 */}
                                    Created {moment(set.createdAt).format("MMM D, YYYY")}
                                </p>
                            </div>

                            <div className='flex items-center gap-2 pt-2 border-t border-slate-100'>
                                <div className='px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg'>
                                    <span className='text-sm font-semibold text-emerald-700'>
                                        {/* 卡片数量 */}
                                        {set.cards.length} {''}
                                        {/* 卡片数量为 1 时显示 Card，否则显示 Cards */}
                                        {set.cards.length === 1 ? 'Card' : 'Cards'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )};

  



  return (
    <>
    <div className='bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8'>
      {selectedSet ? renderFlashcardView() : renderFlashcardSetList()}
    </div>

    {/* Delete Modal */}
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      title='Delete Flashcard Set?'
      children={
      <div className='space-y-6'>
        <p className='text-sm text-slate-600'>
            Are you sure you want to delete this flashcard set? This action
            cannot be undone and all flashcards will be permanently removed.
        </p>
        <div className='flex items-center gap-3 justify-end pt-2'>
            <button
              type='button'
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className='px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                Cancel
            </button>
            <button
              type='button'
              onClick={handleConfirmDelete}
              disabled={deleting}
              className='px-5 h-11 bg-linear-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 disabled:active:scale-100'
            >
                {deleting ? (
                    <span className='flex items-center gap-2'>
                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'>
                            Deleting...
                        </div>
                    </span>
                ) : (
                    "Delete Set"
                )}
            </button>
        </div>
      </div>}
    />
    </>
  )
}

export default FlashcardManager