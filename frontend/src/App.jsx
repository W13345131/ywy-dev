import React from 'react'
/* 引入react-router-dom */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardPage from './pages/AILearning/Dashboard/DashboardPage'
import DocumentListPage from './pages/AILearning/Documents/DocumentListPage'
import DocumentDetailPage from './pages/AILearning/Documents/DocumentDetailPage'
import FlashcardListPage from './pages/AILearning/Flashcards/FlashcardListPage'
import FlashcardPage from './pages/AILearning/Flashcards/FlashcardPage'
import QuizTakePage from './pages/AILearning/Quizzes/QuizTakePage'
import QuizResultPage from './pages/AILearning/Quizzes/QuizResultPage'
import ProfilePage from './pages/Profile/ProfilePage'
import ExpenseTrackerDashboard from './pages/Expense_tracker/ExpenseTrackerDashboard'
import Expense from './pages/Expense_tracker/Expense'
import Income from './pages/Expense_tracker/Income'
import TaskManagerDashboard from './pages/Task_manager/TaskManagerDashboard'
import CreateTask from './pages/Task_manager/CreateTask'
import ManageTask from './pages/Task_manager/ManageTask'
import TeamMembers from './pages/Task_manager/TeamMembers'
import UserDashboard from './pages/Task_manager/UserDashboard'
import { useAuth } from './context/AuthContent'
import MyTasks from './pages/Task_manager/MyTasks'
import ViewTaskDetails from './pages/Task_manager/ViewTaskDetails'
import Home from './pages/Media/Home'
import Messages from './pages/Media/Messages'
import Connection from './pages/Media/Connection'
import Discover from './pages/Media/Discover'
import Profile from './pages/Media/Profile'
import ChatBox from './pages/Media/ChatBox'
import CreatePost from './pages/Media/CreatePost'

function App() {

  const { isAuthenticated, loading } = useAuth();


  if (loading) {
    return (
      // h-screen 表示高度占满整个屏幕
      <div className='flex justify-center items-center h-screen'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* 如果用户已登录，则重定向到/dashboard，否则重定向到/login */}
        {/* replace 表示替换当前路由，不会留下历史记录 */}
        <Route
          path='/' 
          element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <Navigate to='/login' replace />} />
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
    </Router>
  );
}

export default App