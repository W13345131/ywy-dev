import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { FileMinusCorner } from 'lucide-react';
import TaskStatusTabs from '../../components/TaskManager/TaskStatusTabs';
import TaskCard from '../../components/TaskManager/Cards/TaskCard';


// 获取所有任务
// 按状态筛选任务
// 点击任务卡片跳转到编辑页
// 下载任务报告
function ManageTask() {


  // 所有任务
  const [allTasks, setAllTasks] = useState([]);
  
  // 任务状态标签
  const [tabs, setTabs] = useState([]);

  // 筛选状态
  const [filterStatus, setFilterStatus] = useState('All');

  // 导航
  const navigate = useNavigate();

  // 获取所有任务
  const getAllTasks = async () => {
    try {
        // 获取所有任务
        const response = await axiosInstance.get(API_PATHS.TASK_MANAGER.GET_ALL_TASKS, {
            // params 是 axios 请求中的一个配置项，作用是：把数据作为 URL 查询参数（Query Parameters）发送给后端
            params: {
                // 如果筛选状态为 All，则不发送 status 参数，否则发送 status 参数
                status: filterStatus === 'All' ? '' : filterStatus,
            }
        });

        // 如果获取到任务，则设置所有任务
        setAllTasks(response.data?.tasks?.length > 0 ? response.data?.tasks : []);

        // 任务状态统计
        const statusSummary = response.data?.statusSummary || {};

        // 任务状态标签
        const statusArray = (taskData) => [
            {
                label: 'All',
                // 所有任务数量
                count: statusSummary?.all || 0,
            },
            {
                label: 'Pending',
                // 待办任务数量
                count: statusSummary?.pendingTasks || 0,
            },
            {
                label: 'In Progress',
                // 进行中任务数量
                count: statusSummary?.inProgressTasks || 0,
            },
            {
                label: 'Completed',
                // 完成任务数量
                count: statusSummary?.completedTasks || 0,
            },
        ];

        // 设置任务状态标签
        setTabs(statusArray);

    } catch (error) {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to get all tasks');
    }
  }

  // 点击任务卡片跳转到编辑页
  const handleClick = (taskData) => {
    navigate(`/admin/task-manager/create-task`, { state: { taskId: taskData._id } });
  }

  // 下载任务报告
  const handleDownloadReport = async () => {
    try {
      // 下载任务报告
      const response = await axiosInstance.get(API_PATHS.REPORT.EXPORT_TASK, {
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
      // 设置下载文件名,download 属性用于指定下载后的文件名,tasks_report.xlsx 是文件名
      link.setAttribute('download', 'tasks_report.xlsx');
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
          // 显示错误信息
          toast.error(err?.message || err?.error || 'Download failed');
        } catch {
          toast.error('Download failed');
        }
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to download tasks report');
      }
    }
  }

  // 组件挂载时，获取所有任务
  useEffect(() => {
    getAllTasks(filterStatus);
    // 组件卸载时，清空所有任务
    return () => {}
  }, [filterStatus]);


  return (
    <div className='my-5'>
        <div className='flex flex-col md:flex-row md:items-center justify-between'>
            <div className='flex items-center justify-between gap-3'>
                <h2 className='text-xl md:text-xl font-medium'>
                    My Tasks
                </h2>
            </div>

            {
                // 如果任务状态标签的第一个标签的计数大于 0，则显示任务状态标签
                tabs?.[0]?.count > 0 && (
                    <div className='flex items-center gap-3'>
                        <TaskStatusTabs
                          // 任务状态标签
                          tabs={tabs}
                          // 当前选中的任务状态
                          activeTab={filterStatus}
                          // 设置任务状态
                          setActiveTab={setFilterStatus}
                        />

                        <button 
                          className='hidden lg:flex download-btn-task'
                          onClick={handleDownloadReport}
                        >
                            <FileMinusCorner className='text-lg' />
                            Download Report
                        </button>
                    </div>
                )
            }
        </div>

        {/* grid 网格布局，grid-cols-1 表示一行显示一个，md:grid-cols-3 表示在 md 屏幕上显示 3 列，gap-4 表示每个网格之间的间距为 4px，mt-4 表示上边距为 4px，w-full 表示宽度为 100% */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
            {
                // 遍历所有任务，为每一个任务生成一个任务卡片
                allTasks?.map((item, index) => (
                    <TaskCard
                      key={item._id}
                      // 任务标题
                      title={item.title}
                      // 任务描述
                      description={item.description}
                      // 任务优先级
                      priority={item.priority}
                      // 任务状态
                      status={item.status}
                      // 任务进度
                      progress={item.progress}
                      // 任务创建时间
                      createdAt={item.createdAt}
                      // 任务截止日期
                      dueDate={item.dueDate}
                      // 任务指派给
                      assignedTo={Array.isArray(item.assignedTo) ? item.assignedTo.map((u) => u?.profileImageUrl) : (item.assignedTo ? [item.assignedTo.profileImageUrl] : [])}
                      // 任务附件数量
                      attachmentCount={item.attachments?.length || 0}
                      // 任务完成待办数量
                      completedTodoCount={item.completedTodoCount || 0}
                      // 任务待办清单
                      todoChecklist={item.todoChecklist || []}
                      // 点击事件
                      onClick={() => handleClick(item)}
                    />
                ))
            }
        </div>
    </div>
  )
}

export default ManageTask