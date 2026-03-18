import React, { useState, useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { FileMinusCorner } from 'lucide-react';
import UserCard from '../../components/TaskManager/Cards/UserCard';


// 团队成员页面 TeamMembers
// 用于显示所有团队成员信息和任务统计
function TeamMembers() {

  // 所有团队成员信息
  const [allUsers, setAllUsers] = useState([]);
  
  // 获取所有团队成员信息
  const getAllUsers = async () => {

    try {
        // 获取所有团队成员信息
        const response = await axiosInstance.get(API_PATHS.TASK_MANAGER.GET_USERS);

        // 如果获取到团队成员信息，则设置所有团队成员信息
        if (response.data?.length > 0) {
            setAllUsers(response.data);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to get all users');
    }
  }

  // 下载团队成员报告
  const handleDownloadReport = async () => {
    try {
      // 下载团队成员报告
      const response = await axiosInstance.get(API_PATHS.REPORT.EXPORT_USER, {
        // esponseType: 'blob'因为后端返回的是文件流，不是普通 JSON
        responseType: 'blob',
      });

      // 如果响应头包含 application/json，则说明后端返回的是文件流，不是普通 JSON
      //  includes() 方法用于检查字符串是否包含指定的字符串
      if (response.headers['content-type']?.includes('application/json')) {
        // 把后端返回的文件流转换成文本
        const text = await response.data.text();
        // 把文本转换成 JSON
        const err = JSON.parse(text);
        // 显示错误信息
        toast.error(err?.message || err?.error || 'Download failed');
        return;
      }

      // 把后端返回的文件流转换成浏览器可以下载的 临时文件地址（URL）。
      // Blob = Binary Large Object, 用来表示文件数据
      // new Blob([response.data])意思是把 response.data 包装成一个文件。
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // 创建一个下载链接
      // <a> 标签是 HTML 中的一个元素，用于创建一个超链接
      const link = document.createElement('a');
      // 设置下载地址,让 <a> 标签指向刚刚创建的文件地址
      link.href = url;
      // 设置下载文件名,download 属性用于指定下载后的文件名,user_task_report.xlsx 是文件名
      link.setAttribute('download', 'user_task_report.xlsx');
      // 把 <a> 插入到 DOM 里。浏览器需要元素存在 DOM 才能触发点击
      document.body.appendChild(link);
      // 触发点击，浏览器会自动下载文件
      link.click();
      // 删除下载标签
      // parentNode 是 <a> 标签的父节点，也就是 <body> 标签
      link.parentNode.removeChild(link);
      // 释放刚才创建的 blob URL，防止内存泄漏
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // 如果错误响应数据是 Blob 类型，则说明后端返回的是文件流，不是普通 JSON
      if (error.response?.data instanceof Blob) {
        try {
          // 把文件流转换成文本
          const text = await error.response.data.text();
          // 把文本转换成 JSON
          const err = JSON.parse(text);
          toast.error(err?.message || err?.error || 'Download failed');
        } catch {
          toast.error('Download failed');
        }
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to download user report');
      }
    }
  }

  useEffect(() => {
    getAllUsers();

    // 组件卸载时，清除所有团队成员信息
    return () => {}
  }, []);


  return (
    <div className='mt-5 mb-10 w-full min-h-[calc(100vh-8rem)]'>
      <div className='flex md:flex-row md:items-center justify-between'>
        <h2 className='text-xl md:text-xl font-medium'>
            Team Members
        </h2>

        <button className='flex download-btn-task' onClick={handleDownloadReport}>
            <FileMinusCorner className='text-base' />
            Download Report
        </button>
      </div>
      {/* grid 网格布局，grid-cols-1 表示一行显示一个，md:grid-cols-3 表示在 md 屏幕上显示 3 列，gap-4 表示每个网格之间的间距为 4px，mt-4 表示上边距为 4px，w-full 表示宽度为 100% */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full'>
        {
            allUsers?.map((user) => (
                <UserCard
                  key={user._id}
                  userInfo={user}
                />
            ))
        }
      </div>
    </div>
  )
}

export default TeamMembers