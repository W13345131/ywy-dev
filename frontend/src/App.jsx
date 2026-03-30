import React, { Suspense, lazy } from 'react'
/* 引入react-router-dom */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAuth } from './context/AuthContent'
import Spinner from './components/common/Spinner'

const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const DashboardPage = lazy(() => import('./pages/AILearning/Dashboard/DashboardPage'));
const DocumentListPage = lazy(() => import('./pages/AILearning/Documents/DocumentListPage'));
const DocumentDetailPage = lazy(() => import('./pages/AILearning/Documents/DocumentDetailPage'));
const FlashcardListPage = lazy(() => import('./pages/AILearning/Flashcards/FlashcardListPage'));
const FlashcardPage = lazy(() => import('./pages/AILearning/Flashcards/FlashcardPage'));
const QuizTakePage = lazy(() => import('./pages/AILearning/Quizzes/QuizTakePage'));
const QuizResultPage = lazy(() => import('./pages/AILearning/Quizzes/QuizResultPage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const ExpenseTrackerDashboard = lazy(() => import('./pages/Expense_tracker/ExpenseTrackerDashboard'));
const Expense = lazy(() => import('./pages/Expense_tracker/Expense'));
const Income = lazy(() => import('./pages/Expense_tracker/Income'));
const TaskManagerDashboard = lazy(() => import('./pages/Task_manager/TaskManagerDashboard'));
const CreateTask = lazy(() => import('./pages/Task_manager/CreateTask'));
const ManageTask = lazy(() => import('./pages/Task_manager/ManageTask'));
const TeamMembers = lazy(() => import('./pages/Task_manager/TeamMembers'));
const UserDashboard = lazy(() => import('./pages/Task_manager/UserDashboard'));
const MyTasks = lazy(() => import('./pages/Task_manager/MyTasks'));
const ViewTaskDetails = lazy(() => import('./pages/Task_manager/ViewTaskDetails'));
const Home = lazy(() => import('./pages/Media/Home'));
const Messages = lazy(() => import('./pages/Media/Messages'));
const Connection = lazy(() => import('./pages/Media/Connection'));
const Discover = lazy(() => import('./pages/Media/Discover'));
const Profile = lazy(() => import('./pages/Media/Profile'));
const ChatBox = lazy(() => import('./pages/Media/ChatBox'));
const CreatePost = lazy(() => import('./pages/Media/CreatePost'));

function App() {

  // 获取用户认证信息
  const { isAuthenticated, loading } = useAuth();

  // 如果正在加载，则显示加载状态
  if (loading) {
    return (
      // h-screen 表示高度占满整个屏幕
      <div className='flex justify-center items-center h-screen'>
        <Spinner />
      </div>
    );
  }

  return (
    <Router>
      <Suspense fallback={<div className='flex justify-center items-center h-screen'><Spinner /></div>}>
        <Routes>
          {/* 如果用户已登录，则重定向到/dashboard，否则重定向到/login */}
          {/* replace 表示替换当前路由，不会留下历史记录 */}
          <Route
            path='/' 
            element={isAuthenticated ? <Navigate to='/media/home' replace /> : <Navigate to='/login' replace />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/documents' element={<DocumentListPage />} />
            <Route path='/documents/:id' element={<DocumentDetailPage />} />
            <Route path='/flashcards' element={<FlashcardListPage />} />
            <Route path='/documents/:id/flashcards' element={<FlashcardPage />} />
            <Route path='/quizzes/:id' element={<QuizTakePage />} />
            <Route path='/quizzes/:id/results' element={<QuizResultPage />} />
            <Route path='/profile' element={<ProfilePage />} />

            {/* Expense Tracker Routes */}
            <Route path='/expense-tracker' element={<ExpenseTrackerDashboard />} />
            <Route path='/expense-tracker/expense' element={<Expense />} />
            <Route path='/expense-tracker/income' element={<Income />} />

            {/* Task Manager Routes */}
            {/* Admin Only Routes */}
            <Route path='/admin/task-manager' element={<TaskManagerDashboard />} />
            <Route path='/admin/task-manager/create-task' element={<CreateTask />} />
            <Route path='/admin/task-manager/manage-task' element={<ManageTask />} />
            <Route path='/admin/task-manager/team-members' element={<TeamMembers />} />

            {/* Member Only Routes */}
            <Route path='/user/task-manager' element={<UserDashboard />} />
            <Route path='/user/task-manager/my-tasks' element={<MyTasks />} />
            <Route path='/user/task-manager/task-details/:id' element={<ViewTaskDetails />} />

            {/* Media Routes */}
            <Route path='/media/home' element={<Home />} />
            <Route path='/media/messages' element={<Navigate to='/media/chat-box' replace />} />
            <Route path='/media/chat-box' element={<Messages />} />
            <Route path='/media/connections' element={<Connection />} />
            <Route path='/media/discover' element={<Discover />} />
            <Route path='/media/profile' element={<Profile />} />
            <Route path='/media/profile/:id' element={<Profile />} />
            <Route path='/media/chat-box/:id' element={<ChatBox />} />
            <Route path='/media/create-post' element={<CreatePost />} />
          </Route>

          {/* 如果用户访问的路径不存在，则显示404页面 */}
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App