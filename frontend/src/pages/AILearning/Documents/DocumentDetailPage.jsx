import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import documentService from '../../../services/documentService';
import toast from 'react-hot-toast';
import Spinner from '../../../components/common/Spinner';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import PageHeader from '../../../components/common/PageHeader';
import Tabs from '../../../components/common/Tabs';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../utils/apiPaths';
import ChatInterface from '../../../components/AILearning/chat/ChatInterface';
import AIAction from '../../../components/AILearning/ai/AIAction';
import FlashcardManager from '../../../components/AILearning/flashcards/FlashcardManager';
import QuizManager from '../../../components/AILearning/quizzes/QuizManager';


function DocumentDetailPage() {

  // useParams() 是 React Router 提供的 Hook，用来获取 URL 里的参数。
  // 这里从 URL 中获取 id 参数。
  // id: documentId 表示 把 id 重命名为 documentId。
  const { id } = useParams();
  // 用来存储 document 的 state
  const [document, setDocument] = useState(null);
  // 表示页面是否在加载数据
  const [loading, setLoading] = useState(true);
  // 表示当前选中的标签
  const [activeTab, setActiveTab] = useState('Content');

  // useEffect() 是 React 提供的 Hook，用来在组件挂载后执行副作用。
  useEffect(() => {
    // 异步函数 fetchDocumentDetails，用于从后端获取 document 数据，然后更新 React 的 state
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        // 把获取到的数据设置到 document 中
        setDocument(data);
      } catch (error) {
        toast.error('Failed to fetch document details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDocumentDetails();
  }, [id]);

  // 获取 PDF 文件的 URL
  const getPdfUrl = () => {
    // 如果 document 不存在，或者 document.data.filePath 不存在，则返回 null
    if (!document?.data?.filePath) return null;

    // 获取文件路径
    const filePath = document.data.filePath;

    // 如果文件路径以 http:// 或 https:// 开头，则返回文件路径
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    // 获取 API 基础 URL
    const baseUrl = BASE_URL;
    // 返回完整的文件 URL
    return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
  }

  // 渲染内容
  const renderContent = () => {
    // 如果页面正在加载，则显示加载中
    if (loading) {
      return <Spinner />
    }
    // 如果 document 不存在，或者 document.data 不存在，或者 document.data.filePath 不存在，则显示 PDF 不可用
    if (!document || !document.data || !document.data.filePath) {
      return <div className='text-center p-8'>PDF not available.</div>
    }

    // 获取 PDF 文件的 URL
    const pdfUrl = getPdfUrl();

    return (
      // 渲染 PDF 文件的视图
      <div className='bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm'>
        <div className='flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300'>
          <span className='text-sm font-medium text-gray-700'>Document Viewer</span>
          <a 
            href={pdfUrl}
            // target='_blank' 表示在新窗口打开链接
            target='_blank'
            // rel='noopener noreferrer' 表示在新窗口打开链接时，不使用当前窗口的 cookie
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 
            font-medium transition-colors'
          >
            {/* ExternalLink 是 Lucide React 提供的图标组件，表示一个外部链接 */}
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>
        <div className='bg-gray-100 p-1'>
          {/* iframe 是 HTML 标签，表示一个内联框架 */}
          <iframe
            // src={pdfUrl} 表示内联框架的源 URL
            src={pdfUrl}
            // title='PDF Viewer' 表示内联框架的标题
            title='PDF Viewer'
            className='w-full h-[70vh] bg-white rounded border border-gray-300'
            // frameBorder='0' 表示内联框架的边框宽度为 0
            frameBorder='0'
            // style={{ colorScheme: 'light' }} 表示内联框架的颜色方案为浅色
            style={
              {
                colorScheme: 'light',
              }
            }
          />
        </div>
      </div>
    )
  }

  // 渲染聊天界面
  const renderChat = () => {
    return <ChatInterface />;
  }

  // 渲染 AI 动作
  const renderAIActions = () => {
    return <AIAction />;
  }

  // 渲染闪卡界面
  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id} />;
  }

  // 渲染 quizzes 界面
  const renderQuizzesTab = () => {
    return <QuizManager documentId={id} />;
  }


  // 渲染 tabs
  const tabs = [
    { name: 'Content', label: 'Content', content: renderContent() },
    { name: 'Chat', label: 'Chat', content: renderChat() },
    { name: 'AI Actions', label: 'AI Actions', content: renderAIActions() },
    { name: 'Flashcards', label: 'Flashcards', content: renderFlashcardsTab() },
    { name: 'Quizzes', label: 'Quizzes', content: renderQuizzesTab() },
  ]

  // 如果页面正在加载，则显示加载中
  if (loading) {
    return <Spinner />
  }

  // 如果 document 不存在，则显示文档不存在
  if (!document) {
    return <div className='text-center p-8'>Document not found.</div>
  }


  // 渲染页面
  return (
    <div>
      <div className='mb-4'>
        <Link to='/documents' className='inline-flex items-center gap-2 text-sm text-netural-600
        hover:text-neutral-900 transition-colors'>
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>
      {/* PageHeader 是自定义组件，用于显示页面标题 */}
      <PageHeader title={document.data.title} />
      {/* Tabs 是自定义组件，用于显示标签 */}
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default DocumentDetailPage