import React from 'react'
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import flashcardService from '../../../services/flashcardService';
import Spinner from '../../../components/common/Spinner';
import EmptyState from '../../../components/common/EmptyState';
import PageHeader from '../../../components/common/PageHeader';
import FlashcardSetCard from './FlashcardSetCard';



function FlashcardListPage() {

  // 用来存储 flashcard 集合
  const [flashcardSets, setFlashcardSets] = useState([]);
  // 表示页面是否在加载数据
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        // 调用 flashcardService 的 getFlashcardSets 方法，获取 flashcard 集合
        const response = await flashcardService.getFlashcardSets();
        // 把获取到的数据设置到 flashcardSets 中
        setFlashcardSets(response?.data ?? []);
      } catch (error) {
        // 显示错误信息
        toast.error('Failed to fetch flashcard sets');
        // 打印错误信息
        console.error(error);
      } finally {
        // 请求结束后：页面停止 loading。
        setLoading(false);
      }
    };
    fetchFlashcardSets();
  }, []);


  const renderContent = () => {
    // 如果正在加载数据，则显示加载状态
    if (loading) {
      return <Spinner />;
    }

    // 如果没有数据，则显示空状态
    if (flashcardSets.length === 0) {
      return (
        <EmptyState
          title="No flashcard sets found"
          description="You haven't created any flashcard sets yet. Go to a document to create your first set."
        />
      );
    }

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {
          // 遍历 flashcardSets 数组，把每个集合渲染成一个 FlashcardSetCard 组件
          flashcardSets.map((set) => (
            // 设置 key 是为了 React 能够正确地更新组件
            <FlashcardSetCard key={set._id} flashcardSet={set} />
          ))
        }
      </div>
    );
  };

  return (
    <div>
      <PageHeader title='All Flashcard Sets' />
      {/* 渲染内容 */}
      {renderContent()}
    </div>
  )
}

export default FlashcardListPage