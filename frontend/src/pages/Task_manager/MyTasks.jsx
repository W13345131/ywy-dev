import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { FileMinusCorner } from 'lucide-react';
import TaskStatusTabs from '../../components/TaskManager/TaskStatusTabs';
import TaskCard from '../../components/TaskManager/Cards/TaskCard';



function MyTasks() {


  // 所有任务
  const [allTasks, setAllTasks] = useState([]);
  // 任务状态标签
  const [tabs, setTabs] = useState([]);
  // 当前选中的任务状态
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
                count: statusSummary?.all || 0,
            },
            {
                label: 'Pending',
                count: statusSummary?.pendingTasks || 0,
            },
            {
                label: 'In Progress',
                count: statusSummary?.inProgressTasks || 0,
            },
            {
                label: 'Completed',
                count: statusSummary?.completedTasks || 0,
            },
        ];

        // 设置任务状态标签
        setTabs(statusArray);

    } catch (error) {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to get all tasks');
    }
  }

  // 点击任务卡片跳转到任务详情页
  const handleClick = (taskId) => {
    // 导航到任务详情页
    navigate(`/user/task-manager/task-details/${taskId}`);
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
                          tabs={tabs}
                          activeTab={filterStatus}
                          setActiveTab={setFilterStatus}
                        />
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
                      title={item.title}
                      description={item.description}
                      priority={item.priority}
                      status={item.status}
                      progress={item.progress}
                      createdAt={item.createdAt}
                      dueDate={item.dueDate}
                      // 如果 assignedTo 是数组，遍历 assignedTo 数组，为每一个用户生成一个头像
                      // 如果 assignedTo 是对象，则生成一个头像
                      // 如果 assignedTo 不存在，则生成一个空数组
                      assignedTo={Array.isArray(item.assignedTo) ? item.assignedTo.map((u) => u?.profileImageUrl) : (item.assignedTo ? [item.assignedTo.profileImageUrl] : [])}
                      // 任务附件数量
                      attachmentCount={item.attachments?.length || 0}
                      // 任务完成待办数量
                      completedTodoCount={item.completedTodoCount || 0}
                      // 任务待办清单
                      todoChecklist={item.todoChecklist || []}
                      // 点击事件
                      onClick={() => handleClick(item._id)}
                    />
                ))
            }
        </div>
    </div>
  )
}

export default MyTasks