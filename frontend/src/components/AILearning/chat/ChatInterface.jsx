import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContent';
import aiService from '../../../services/aiService';
import toast from 'react-hot-toast';
import Spinner from '../../common/Spinner';
import MarkdownRenderer from '../../common/MarkdownRenderer';
import { MessageSquare, Sparkle, Send } from 'lucide-react';


function ChatInterface() {

  const { id: documentId } = useParams();
  // 当前登录用户信息
  const {user} = useAuth();
  // 存储聊天历史
  const [history, setHistory] = useState([]);
  // 存储用户输入的消息
  const [message, setMessage] = useState('');
  // 表示当前是否正在发送消息
  const [loading, setLoading] = useState(false);
  // 表示当前是否正在初始化聊天历史
  const [initialLoading, setInitialLoading] = useState(true);

  // useRef 是 React 的一个 Hook，用于创建一个可变的引用对象（ref） 
  // 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initial value）
  // messageInputRef = {
  //   current: null
  // }
  const messageInputRef = useRef(null);

  // 滚动到页面底部的函数
  const scrollToBottom = () => {
    // React 会把 DOM 绑定到：messageInputRef.current
    // scrollIntoView() → 这是 DOM API，作用是：把元素滚动到浏览器可视区域
    // behavior: 'smooth' → 表示滚动行为是平滑的；默认是瞬间滚动
    messageInputRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    // 获取聊天历史
    const fetchChatHistory = async () => {
      try {
        // 设置初始化聊天历史为 true
        setInitialLoading(true);
        // 调用 aiService.getChatHistory 方法，获取聊天历史
        const response = await aiService.getChatHistory(documentId);
        // 获取聊天历史列表
        const list = response?.data ?? response;
        // 设置聊天历史
        setHistory(Array.isArray(list) ? list : []);
      } catch (error) {
        // 显示错误信息
        toast.error(error?.message || 'Failed to fetch chat history');
      } finally {
        setInitialLoading(false);
      }
    }
    fetchChatHistory();
  }, [documentId]);


  // 滚动到页面底部的副作用
  useEffect(() => {
    // 调用 scrollToBottom 函数，滚动到页面底部
    scrollToBottom();
    // 依赖于 history 数组，当 history 数组发生变化时，调用 scrollToBottom 函数
  }, [history]);


  // 发送消息
  const handleSendMessage = async (e) => {
    // 阻止表单默认提交行为
    e.preventDefault();
    // 如果消息为空，则返回
    if (!message.trim()) return;

    // 创建用户消息对象
    const userMessage = {
        // 角色：用户
        role: 'user',
        // 内容：用户输入的消息
        content: message,
        // 时间戳：当前时间
        timestamp: new Date(),
    };

    // 旧数组 + 新消息
    setHistory(prev => [...prev, userMessage]);
    // 清空用户输入的消息
    setMessage('');
    // 设置正在发送消息为 true
    setLoading(true);

    try {
        // 调用 aiService.chat 方法，发送消息
        const response = await aiService.chat(documentId, userMessage.content);
        // 创建 AI 消息对象
        const assistantMessage = {
            // 角色：AI
            role: 'assistant',
            // 内容：AI 回答
            content: response.data.answer,
            // 时间戳：当前时间
            timestamp: new Date(),
            // 相关块索引：AI 回答的块索引
            relevantChunks: response.data.relevantChunks,
        };
        // 合并旧数组 + 新消息
        setHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
       // 打印错误信息
        console.error('Chat error:', error);
        // 创建错误消息对象
        const errorMessage ={
            // 角色：AI
            role: 'assistant',
            // 内容：错误信息
            content: 'Sorry, I encountered an error. Please try again later.',
            // 时间戳：当前时间
            timestamp: new Date(),
        };
        // 合并旧数组 + 新消息
        setHistory(prev => [...prev, errorMessage]);
    } finally {
        // 设置正在发送消息为 false
        setLoading(false);
    }
  }

  // 聊天界面渲染单条消息的函数，根据消息是谁发送的（用户 / AI），显示不同的 UI
  const renderMessage = (msg, index) => {

    // 如果消息的角色是用户，则设置 isUser 为 true
    const isUser = msg.role === 'user';
    return (
      // 如果是用户发送的消息，则设置 justify-end（右对齐）；如果是 AI 发送的消息，则设置 justify-start（左对齐）
      <div key={index} className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {
          // 如果消息的角色不是用户，则设置 AI 头像
          !isUser && (
            <div className='w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-50/25 flex items-center justify-center shrink-0'>
              <Sparkle strokeWidth={2} className='w-4 h-4 text-white' />
            </div>
          )
        }
        {/* 如果消息的角色是用户，则设置背景颜色为绿色；如果是 AI 发送的消息，则设置背景颜色为白色 */}
        <div className={`max-w-lg p-4 rounded-2xl shadow-sm ${
          isUser
            ? 'bg-linear-to-br from-emerald-500 to-teal-500 text-white rounded-br-md'
            : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-md'
        }`}>
          {
            // 如果消息的角色是用户，则设置文本颜色为白色；如果是 AI 发送的消息，则设置文本颜色为黑色
            isUser ? (
              <p className='text-sm leading-relaxed'>{msg.content}</p>
            ) : (
              <div className='prose prose-sm max-w-none prose-slate'>
                <MarkdownRenderer content={msg.content} />
              </div>
            )
          }
        </div>
        {
          // 如果消息的角色是用户，则设置用户头像
          isUser && (
            <div className='w-9 h-9 rounded-xl bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-700 font-semibold text-sm shrink-0 shadow-sm'>
              {/* 如果 username 存在，则显示首字母；否则显示 U */}
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          )
        }
      </div>
    )
  }

  // 如果正在初始化聊天历史，则显示加载中
  if (initialLoading) {
    return (
        <div className='flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60
        rounded-2xl items-center justify-center shadow-xl shadow-slate-200/50'>
            <div className='w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100
            flex items-center justify-center mb-4'>
                <MessageSquare className='w-7 h-7 text-emerald-600' strokeWidth={2} />
            </div>
            {/* 加载中动画 */}
            <Spinner />
            {/* 加载中提示 */}
            <p className='text-sm text-slate-500 mt-3 font-medium'>Loading chat history...</p>
        </div>
    )
  }


  return (
    <div className='flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60
    rounded-2xl shadow-xl shadow-slate-200/50'>
        {/* Messages Area */}
        <div className='flex-1 p-6 overflow-y-auto bg-linear-to-br from-slate-50/50 via-white/50 to-slate-50/50'>
            {/* 如果聊天历史为空，则显示欢迎消息 */}
            {history.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-center'>
                    <div className='w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10'>
                        <MessageSquare className='w-8 h-8 text-emerald-600' strokeWidth={2} />
                    </div>
                    <h3 className='text-base font-semibold text-slate-900 mb-2'>Start a conversation</h3>
                    <p className='text-sm text-slate-500'>Ask me anything about the document!</p>
                </div>
            ) : (
                // 如果聊天历史不为空，则渲染聊天历史
                history.map(renderMessage)
            )
        }

        {/* 消息输入框 */}
        <div ref={messageInputRef} />
        {/* 如果正在加载，则显示加载中动画 */}
        {loading && (
            // 加载中动画
            <div className='flex items-center gap-3 my-4'>
                <div className='w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center 
                justify-center shadow-lg shadow-emerald-500/25 shrink-0'>
                      {/* AI 头像 */}
                      <Sparkle className='w-4 h-4 text-white' strokeWidth={2} />
                </div>
                {/* 输入框显示三个点，表示正在加载 */}
                <div className='flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-slate-200/60'>
                    <div className='flex gap-1'>
                        {/* 三个点错开上下浮动，形成动画效果 */}
                        {/* 第一个点 */}
                        <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}>.</span>
                        {/* 第二个点 */}
                        <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}>.</span>
                        {/* 第三个点 */}
                        <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}>.</span>
                    </div>
                </div>
            </div>
        )}
        </div>
        {/* Input Area */}
        <div className='p-5 border-t border-slate-200/60 bg-white/80'>
          {/* 消息输入框表单 */}
          <form onSubmit={handleSendMessage} className='flex items-center gap-3'>
            <input 
              // 输入框类型
              type="text"
              // 输入框值
              value={message}
              // 输入框值变化时，设置消息
              onChange={(e) => setMessage(e.target.value)}
              // 输入框提示
              placeholder='Ask a follow-up question...'
              // 输入框样式
              className='flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus: bg-white focus: shadow-lg focus:shadow-emerald-500/10'
              // 如果正在加载，则禁用输入框
              disabled={loading}
            />
            <button
              type='submit'
              disabled={loading}
              className='cursor-pointer shrink-0 w-12 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
            >
              <Send className='w-5 h-5' strokeWidth={2} />
            </button>
          </form>
        </div>
    </div>
  )
}

export default ChatInterface