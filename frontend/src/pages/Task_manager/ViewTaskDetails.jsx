import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import moment from 'moment';
import AvatarGroup from '../../components/TaskManager/AvatarGroup';
import { ExternalLink } from 'lucide-react';


// 查看任务详情
function ViewTaskDetails() {

  // 获取任务 ID
  const {id} = useParams();

  // 任务
  const [task, setTask] = useState(null);

  // 获取任务状态颜色
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'text-cyan-500 border-cyan-50 border border-cyan-500/10';
      case 'Completed':
        return 'text-lime-500 border-lime-50 border border-lime-500/20';
      default:
        return 'text-violet-500 border-violet-50 border border-violet-500/10';
    }
  }

  // 获取任务详情
  const getTaskDetailsById = async () => {
    try {
      // 获取任务详情
      const response = await axiosInstance.get(API_PATHS.TASK_MANAGER.GET_TASK_BY_ID(id));
      // 如果获取到任务详情，则设置任务
      if (response.data) {
        // 设置任务
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to get task details');
    }
  }

  // 更新待办清单
  const updateTodoChecklist = async (index) => {
    // 获取待办清单
    const todoChecklist = [...task?.todoChecklist];
    // 获取任务 ID
    const taskId = id;
    // 如果待办清单存在，则更新待办清单
    if (todoChecklist && todoChecklist[index]) {
        // 切换 todoChecklist 数组中某一项的 completed 状态（完成 / 未完成）
        // true  → false
        // false → true
        todoChecklist[index].completed = !todoChecklist[index].completed;
    }

    try {
        // 更新待办清单
        const response = await axiosInstance.put(API_PATHS.TASK_MANAGER.UPDATE_TASK_TODO_CHECKLIST(taskId), {
            // 待办清单
            todoChecklist,
        });

        // 如果更新待办清单成功，则设置任务
        if (response.status === 200) {
            setTask(response.data?.task || task);
        } else {
            todoChecklist[index].completed = !todoChecklist[index].completed;
        }
    } catch (error) {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to update todo checklist');
        todoChecklist[index].completed = !todoChecklist[index].completed;
    }

  }

  const handleLinkClick = (link) => {
    // 如果链接不是以 https:// 或 http:// 开头，则添加 https://
    if (!/^https?:\/\//i.test(link)) {
      // 添加 https://
      link = `https://${link}`;
    }
    window.open(link, '_blank');
  }

  useEffect(() => {
    // 如果任务 ID 存在，则获取任务详情
    if (id) {
      getTaskDetailsById();
    }
    // 组件卸载时，清空任务
    return () => {}
  }, [id]);

  return (
    <div className='mt-5 w-full min-h-[calc(100vh-8rem)]'>
        {task && (<div className='w-full mt-4'>
            <div className='form-card w-full'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-sm md:text-xl font-medium'>
                        {task?.title}
                    </h2>

                    <div className={`text-[11px] md:text-[13px] font-medium ${getStatusColor(task?.status)} px-4 py-0.5 rounded`}>
                        {task?.status}
                    </div>
                </div>
                <div className='mt-4'>
                    <InfoBox label='Description' value={task?.description} />
                </div>

                <div className='grid grid-cols-12 gap-4 mt-4'>
                    <div className='col-span-6 md:col-span-4'>
                        <InfoBox label='Priority' value={task?.priority} />
                    </div>

                    <div className='col-span-6 md:col-span-4'>
                        <InfoBox label='Due Date' value={task?.dueDate ? moment(task?.dueDate).format('Do MMM YYYY') : 'N/A'} />
                    </div>

                    <div className='col-span-6 md:col-span-4'>
                        <label htmlFor="" className='text-xs font-medium text-slate-500'>
                            Assigned To
                        </label>
                        <AvatarGroup
                          // 如果 assignedTo 是数组，遍历 assignedTo 数组，为每一个用户生成一个头像
                          // 如果 assignedTo 是对象，则生成一个头像
                          // 如果 assignedTo 不存在，则生成一个空数组
                          avatars={task?.assignedTo?.map((user) => user?.profileImageUrl) || []}
                          maxVisible={5}
                        />
                    </div>
                </div>

                <div className='mt-2'>
                    <label htmlFor="" className='text-xs font-medium text-slate-500'>
                        Todo Checklist
                    </label>
                    {
                        // 遍历待办清单，为每一个待办项生成一个待办清单组件
                        task?.todoChecklist?.map((item, index) => (
                            // 生成一个待办清单组件
                            <TodoCheckList
                              // 唯一标识
                              key={`todo_${index}`}
                              // 待办项文本
                              text={item.text}
                              // 是否完成
                              isChecked={item?.completed}
                              onChange={() => updateTodoChecklist(index)}
                            />
                        ))
                    }
                </div>

                {
                    // 如果任务附件数量大于 0，则显示任务附件
                    task?.attachments?.length > 0 && (
                        <div className='mt-2'>
                            <label htmlFor="" className='text-xs font-medium text-slate-500'>
                                Attachments
                            </label>
                            {
                                // 遍历任务附件，为每一个任务附件生成一个任务附件组件
                                task?.attachments?.map((link, index) => (
                                    <Attachment
                                      key={`link_${index}`}
                                      link={link}
                                      index={index}
                                      onClick={() => handleLinkClick(link)}
                                    />
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>)}
    </div>
  )
}

export default ViewTaskDetails

// 信息框
const InfoBox = ({ label, value }) => {
    return <>
    {/* 标签 */}
    <label htmlFor="" className='text-xs font-medium text-slate-500'>
        {label}
    </label>
    {/* 值 */}
    <p className='text-[13px] md:text-[13px] font-medium text-gray-700 mt-0.5 '>
        {value}
    </p>
    </>
}




// 待办清单
const TodoCheckList = ({ text, isChecked, onChange }) => {
    // 生成一个待办清单组件
    return <div className='flex items-center gap-3 p-3'>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer'
        />
        <p className='text-[13px] text-gray-800'>
            {text}
        </p>
    </div>
}


// 附件
const Attachment = ({ link, index, onClick }) => {
    // 生成一个附件组件
    return <div className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer' onClick={onClick}>
        {/* 附件链接 */}
        <div className='flex-1 flex items-center gap-3'>
            <span className='text-xs text-gray-400 font-semibold mr-2'>
                {/* 如果索引小于9，则前面加0，否则直接显示索引 */}
                {index < 9 ? `0${index + 1}` : index + 1}
            </span>

            {/* 附件链接 */}
            <p className='text-xs text-black'>
                {link}
            </p>
        </div>

        {/* 外链图标 */}
        <ExternalLink className='text-gray-400' />

    </div>
}
