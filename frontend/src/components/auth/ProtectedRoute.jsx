import React from 'react'
// Outlet → 来自 React Router。
// 作用：子路由的渲染出口
import { Outlet, Navigate } from 'react-router-dom'
import AppLayout from '../layout/AppLayout'
import { useAuth } from '../../context/AuthContent'

function ProtectedRoute() {

  // sAuthenticated	用户是否登录
  // loading	是否正在验证登录状态
  const { isAuthenticated, loading } = useAuth();

  // 如果正在验证登录状态，则显示加载中
  if (loading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  //如果用户已登录，则显示AppLayout，否则重定向到登录页面
  //Outlet 表示子路由的出口，用于渲染子路由的组件
  return isAuthenticated ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to='/login' replace />
  )

}

export default ProtectedRoute