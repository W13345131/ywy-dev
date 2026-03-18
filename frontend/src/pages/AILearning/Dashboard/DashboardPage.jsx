import React, { useState, useEffect } from 'react'
import { TrendingUp, BookOpen, BrainCircuit, FileText, Clock } from 'lucide-react';
import progressService from '../../../services/progressService';
import toast from 'react-hot-toast';

function DashboardPage() {



  //dashboardData	存储 Dashboard 数据
  //setDashboardData	更新 Dashboard 数据
  const [dashboardData, setDashboardData] = useState(null);
  //loading	是否加载中
  //setLoading	更新加载状态
  const [loading, setLoading] = useState(true);

  // 组件加载时执行副作用代码
  useEffect(() => {
    // 异步函数, 请求 Dashboard 数据
    const fetchDashboardData = async () => {
      try {

        // 调用 progressService 的 getDashboard 方法, 获取 Dashboard 数据
        const response = await progressService.getDashboard();
        // 打印 Dashboard 数据
        console.log('Data____getDashboardData',response);

        // 更新 Dashboard 数据
        setDashboardData(response.data);
      } catch (error) {
        // 显示错误信息
        toast.error('Failed to get dashboard data');
        console.error(error);
      } finally {
        // 无论成功还是失败都会执行
        // 更新加载状态
        setLoading(false);
      }
    }
    // 调用 fetchDashboardData 函数, 请求 Dashboard 数据
    fetchDashboardData();
  }, []);

  // 如果 Dashboard 数据为空，显示空状态
  if (!dashboardData || !dashboardData.overview) {
    return (
      // min-h-screen：min-height: 100vh;最小高度 = 屏幕高度
      <div className='min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-slate-50 via-white to-slate-50'>
        <div className='text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4'>
            <TrendingUp className='w-8 h-8 text-slate-600' />
          </div>
          <p className='text-sm text-slate-600'>No dashboard data available.</p>
        </div>
      </div>
    );
  }

  // 定义一个统计卡片的数据配置数组，通常用于 Dashboard 页面展示统计信息
  const stats = [
    {
      // 文档总数
      label: 'Total Documents',
      // 后端返回的数据
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: 'from-blue-400 to-cyan-500',
      // 阴影颜色
      shadowColor: 'shadow-blue-500/25',
    },
    {
      label: 'Total Flashcard',
      value: dashboardData.overview.totalFlashcardSets,
      icon: BookOpen,
      gradient: 'from-purple-400 to-pink-500',
      shadowColor: 'shadow-purple-500/25',
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: 'from-emerald-400 to-teal-500',
      shadowColor: 'shadow-emerald-500/25',
    }    
  ]

  return (
    <div className='relative min-h-screen'>
      <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none' />
      <div className='relative'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
            <h1 className='text-2xl font-medium text-slate-900 tracking-tight mb-2'>AI Learning</h1>
          <p className='text-sm text-slate-500 mb-6'>
            Track your learning progress and activity
          </p>
        </div>

        {/* Stats Grid */}
        {/* // Grid:网格布局
        // grid-cols-1:1列
        // md:grid-cols-2:中屏2列
        // lg:grid-cols-3:大屏3列
        // gap-6:网格间距
        // mb-5:下边距 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5'>
          {stats.map((stat, index) => (
            // React 用 key 来判断：哪个元素变化
            <div
            key={index}
            className='group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl
            shadow-xl shadow-slate-200/50 p-6 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1'
            >
              <div className='flex items-center justify-between'>
                <span className='text-xs font-semibold text-slate-500 uppercase tracking-wide'>
                  {stat.label}
                </span>
                <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.gradient} shadow-lg ${stat.shadowColor}
                flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className='w-5 h-5 text-white' strokeWidth={2} />
                </div>
              </div>
              <div className='text-3xl font-semibold text-slate-900 tracking-tight'>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className='bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 p-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center'>
              <Clock className='w-5 h-5 text-slate-600' strokeWidth={2} />
            </div>
            <h3 className='text-xl font-medium text-slate-900 tracking-tight'>
              Recent Activity
            </h3>
          </div>

          {
            // 如果最近活动不为空，并且文档或测验数量大于0，则显示最近活动
            dashboardData.recentActivity && (dashboardData.recentActivity.documents.length > 0 || dashboardData.recentActivity.quizzes.length > 0) ? (
              <div>
                {[
                  // ...作用：合并两个数组
                  ...(dashboardData.recentActivity.documents || []).map((doc) => ({
                    id: doc._id,
                    description: doc.title,
                    timestamp: doc.lastAccessed,
                    link: `/documents/${doc._id}`,
                    type: 'document',
                  })),
                  ...(dashboardData.recentActivity.quizzes || []).map((quiz) => ({
                    id: quiz._id,
                    description: quiz.title,
                    timestamp: quiz.completedAt,
                    link: `/quizzes/${quiz._id}`,
                    type: 'quiz',
                  })),
                ]
                // sort()作用：排序
                // new Date(b.timestamp) - new Date(a.timestamp)：按时间排序，最新在前
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                // map()作用：遍历数组，返回新数组
                .map((activity, index) => (
                  <div
                  key={activity.id || index}
                  className='group flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border 
                  border-slate-200/60 hover:bg-white hover:border-slate-300/60
                  hover:shadow-md transition-all duration-200'
                  >
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-1'>
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'document'
                            ? 'bg-linear-to-br from-blue-400 to-cyan-500'
                            : 'bg-linear-to-br from-emerald-400 to-teal-500'
                        }`} />

                        <p className='text-sm font-medium text-slate-900 truncate'>
                          {activity.type === 'document' ? 'Accessed Document:' : 'Attempted Quiz:'}
                          <span className='text-slate-700'>{activity.description}</span>
                        </p>
                      </div>
                      <p className='text-xs text-slate-500 pl-4'>
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {activity.link && (
                      <a
                      href={activity.link}
                      className='ml-4 px-4 py-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700
                      hover:bg-emerald-50 rounded-lg transition-all duration-200 whitespace-nowrap'
                      >
                        View
                      </a>
                    )}
                  </div>
                  ))}
              </div>
            ) : (
                  <div className='text-center py-12'>
                    <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4'>
                      <Clock className='w-8 h-8 text-slate-400' strokeWidth={2} />
                    </div>
                    <p className='text-sm text-slate-600'>No recent activity yet.</p>
                    <p className='text-xs text-slate-500 mt-1'>Start learning to see your progress here.</p>
                  </div>
                )}
            </div>
          </div>
        </div>
  );
}
export default DashboardPage;