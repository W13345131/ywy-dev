import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { Trash } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import SelectDropdown from '../../components/TaskManager/Inputs/SelectDropdown';
import SelectUsers from '../../components/TaskManager/Inputs/SelectUsers';
import TodoListInput from '../../components/TaskManager/Inputs/TodoListInput';
import AddAttachmentsInput from '../../components/TaskManager/Inputs/AddAttachmentsInput';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import moment from 'moment';
import Modal from '../../components/TaskManager/Modal';
import DeleteAlert from '../../components/TaskManager/DeleteAlert';


// 注册英文本地化
registerLocale('en', enUS);

function CreateTask() {

  // 获取当前路径的参数,useLocation 是 React Router 提供的钩子函数，用于获取当前路径的参数
  const location = useLocation();
  // 获取当前路径的参数,useLocation 是 React Router 提供的钩子函数，用于获取当前路径的参数
  const { taskId } = location.state || {};
  // 获取当前路径的参数,useNavigate 是 React Router 提供的钩子函数，用于导航到另一个路径
  const navigate = useNavigate();

  // 任务数据
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: null,
    assignedTo: [],
    attachments: [],
    todoChecklist: [],
  });

  // 当前任务数据
  const [currentTask, setCurrentTask] = useState(null);

  // 错误信息
  const [error, setError] = useState("");

  // 加载状态
  const [loading, setLoading] = useState(false);

  // 删除确认弹窗
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // 处理任务数据变化
  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({
      // 合并之前的任务数据和新的任务数据
      ...prevData,
      [key]: value,
    }));
  };

  // 清空任务数据
  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: null,
      assignedTo: [],
      attachments: [],
      todoChecklist: [],
    });
  };

  // 优先级数据
  const PRIORITY_DATA = [
    {
      value: 'Low',
      label: 'Low',
    },
    {
      value: 'Medium',
      label: 'Medium',
    },
    {
      value: 'High',
      label: 'High',
    },
  ];


  // 创建任务
  const createTask = async () => {
    // 设置加载状态
    setLoading(true);

    try {
        // 转换待办清单数据
        const todolist = taskData.todoChecklist?.map((item) => ({
            // 待办内容
            text: item,
            // 是否完成
            completed: false,
        }));

        // 创建任务
        const response = await axiosInstance.post(API_PATHS.TASK_MANAGER.CREATE_TASK, {
            // 合并之前的任务数据和新的任务数据
            ...taskData,
            // 转换截止日期数据
            dueDate: new Date(taskData.dueDate).toISOString(),
            // 转换待办清单数据
            todoChecklist: todolist,
        });

        // 显示成功信息
        toast.success('Task created successfully');

        // 清空任务数据
        clearData();
    } catch (error) {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to create task');
    } finally {
        setLoading(false);
    }
  }


  // 更新任务
  const updateTask = async () => {

    setLoading(true);

    try {
      // 转换待办清单数据
      const todolist = taskData.todoChecklist?.map((item) => {
        // 获取当前任务的待办清单
        const prevTodoCheckList = currentTask?.todoChecklist || [];
        // 获取当前任务的待办清单中是否包含当前待办项，如果包含，则返回当前待办项的完成状态，否则返回 false
        const matchedTask = prevTodoCheckList.find((task) => task.text === item);
        return {
          // 待办内容
          text: item,
          // 是否完成,如果包含，则返回当前待办项的完成状态，否则返回 false
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      // 更新任务
      const response = await axiosInstance.put(API_PATHS.TASK_MANAGER.UPDATE_TASK(taskId), {
        // 合并之前的任务数据和新的任务数据
        ...taskData,
        // 转换截止日期数据
        dueDate: new Date(taskData.dueDate).toISOString(),
        // 转换待办清单数据
        todoChecklist: todolist,
      });

      toast.success('Task updated successfully');

    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to update task');
    } finally {
      setLoading(false);
    }

  }


  // 提交任务，创建或更新任务
  const handleSubmit = async () => {
    setError(null);

    // 如果任务标题为空，则设置错误信息
    if (!taskData.title.trim()) {
      setError('Title is required');
      return;
    }

    // 如果任务描述为空，则设置错误信息
    if (!taskData.description.trim()) {
      setError('Description is required');
      return;
    }

    // 如果任务优先级为空，则设置错误信息
    if (!taskData.priority) {
      setError('Priority is required');
      return;
    }

    // 如果任务截止日期为空，则设置错误信息
    if (!taskData.dueDate) {
      setError('Due Date is required');
      return;
    }

    // 如果任务指派给为空，则设置错误信息
    if (taskData.assignedTo.length === 0) {
      setError('Assigned To is required');
      return;
    }

    // 如果任务待办清单为空，则设置错误信息
    if (taskData.todoChecklist.length === 0) {
      setError('TODO Checklist is required');
      return;
    }

    // 如果任务 ID 存在，则更新任务
    if (taskId) {
        updateTask();
        return;
    }

    // 如果任务 ID 不存在，则创建任务
    createTask();
  }


  // 获取任务详情
  const getTaskDetailsById = async () => {

    try {
      // 获取任务详情
      const response = await axiosInstance.get(API_PATHS.TASK_MANAGER.GET_TASK_BY_ID(taskId));
      // 如果获取到任务详情，则设置当前任务数据
      if (response.data) {
        // 获取任务详情
        const taskInfo = response.data;
        // 设置当前任务数据
        setCurrentTask(taskInfo);

        // 把 taskInfo.assignedTo 统一转换成一个只包含用户 id 的数组
        // 第一步：判断是不是数组
        const assignedIds = Array.isArray(taskInfo.assignedTo)
          // 如果 u 是对象并且有 _id 字段，则返回 u._id，否则返回 u
          // filter(Boolean) 作用是：删除数组中的 falsy 值，例如：undefined, null, false, 0, '' 等
          ? taskInfo.assignedTo.map((u) => (typeof u === 'object' && u?._id ? u._id : u)).filter(Boolean)
          // 如果 assignedTo 存在，则返回 assignedTo._id 或 assignedTo
          : taskInfo.assignedTo ? [taskInfo.assignedTo._id || taskInfo.assignedTo] : [];

        // 设置任务数据
        setTaskData((prevState) => ({
          // 任务标题
          title: taskInfo.title,
          // 任务描述
          description: taskInfo.description,
          // 任务优先级
          priority: taskInfo.priority,
          // 任务截止日期
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format('YYYY-MM-DD')
            : null,
          // 任务指派给
          assignedTo: assignedIds,
          // 任务附件
          attachments: taskInfo.attachments || [],
          // 任务待办清单,把任务待办清单的 text 转换为数组
          todoChecklist: taskInfo.todoChecklist?.map((item) => item?.text) || [],
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to get task details');
    } 
  }


  // 删除任务
  const deleteTask = async () => {
    try {
      // 删除任务
      const response = await axiosInstance.delete(API_PATHS.TASK_MANAGER.DELETE_TASK(taskId));
      // 如果删除任务成功，则显示成功信息，并导航到任务管理页面
      if (response.data) {
        // 显示成功信息
        toast.success('Task deleted successfully');
        // 导航到任务管理页面
        navigate('/admin/task-manager');
      }
    } catch (error) {
      // 如果删除任务失败，则显示错误信息
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to delete task');
    }
  }


  useEffect(() => {
    // 如果任务 ID 存在，则获取任务详情
    if (taskId) {
      // 获取任务详情
      getTaskDetailsById(taskId);
    }
    return () => {}
  }, [taskId]);


  // 转换截止日期数据
  const dueDateValue = (() => {
    // 如果截止日期为空，则返回 null
    if (!taskData.dueDate) return null;
    // 转换截止日期数据
    try {
      // 如果截止日期是 Date 类型，则返回截止日期，否则转换截止日期数据
      const d = taskData.dueDate instanceof Date ? taskData.dueDate : parseISO(taskData.dueDate);
      // 如果截止日期是无效的，则返回 null，否则返回截止日期
      return isNaN(d.getTime()) ? null : d;
    } catch { return null; }
    // ()立即执行函数
  })();

  return (
    <div>
    <div className='mt-5 w-full'>
        <div className='w-full mt-4'>
            <div className='form-card w-full'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-xl md:text-xl font-medium'>
                        {/* 如果任务 ID 存在，则显示更新任务，否则显示创建任务 */}
                        {taskId ? 'Update Task' : 'Create Task'}
                    </h2>
                    {
                      // 如果任务 ID 存在，则显示删除按钮
                        taskId && (
                            <button
                              className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1
                              border border-rose-100 hover:border-rose-300 cursor-pointer'
                              onClick={() => setOpenDeleteAlert(true)}
                            >
                                <Trash className='text-base' /> Delete
                            </button>
                        )
                    }
                </div>
                <div className='mt-4'>
                    <label htmlFor="" className='text-xs font-medium text-slate-600'>
                        Task Title
                    </label>
                    <input
                      placeholder='Create App UI'
                      value={taskData.title}
                      onChange={({target}) => handleValueChange("title", target.value)}
                      className='form-input'
                    />
                </div>

                <div className='mt-3'>
                    <label htmlFor="" className='text-xs font-medium text-slate-600'>
                        Description
                    </label>

                    <textarea
                      placeholder='Describe task'
                      className='form-input'
                      rows={4}
                      value={taskData.description}
                      onChange={({target}) => handleValueChange("description", target.value)}
                    />
                </div>

                <div className='grid grid-cols-12 gap-4 mt-2 items-start task-form-row'>

                    <div className='col-span-6 md:col-span-4 flex flex-col'>
                        <label htmlFor="" className='text-xs font-medium text-slate-600'>
                            Priority
                        </label>
                        <SelectDropdown
                          options={PRIORITY_DATA}
                          value={taskData.priority}
                          onChange={(value) => handleValueChange("priority", value)}
                          placeholder='Select Priority'
                          
                        />
                    </div>

                    <div className='col-span-6 md:col-span-4 flex flex-col'>
                        <label htmlFor="" className='text-xs font-medium text-slate-600'>
                            Due Date
                        </label>
                        <div className='mt-2'>
                        <DatePicker
                          locale="en"
                          dateFormat="MMM d, yyyy"
                          selected={dueDateValue}
                          onChange={(date) => handleValueChange("dueDate", date ? format(date, 'yyyy-MM-dd') : null)}
                          className='w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md placeholder:text-slate-500 cursor-pointer'
                          placeholderText='Select due date'
                        />
                        </div>
                    </div>

                <div className='col-span-12 md:col-span-3 flex flex-col'>
                    <label htmlFor="" className='text-xs font-medium text-slate-600'>
                        Assigned To
                    </label>
                    <SelectUsers
                      selectedUsers={taskData.assignedTo}
                      setSelectedUsers={(users) => handleValueChange("assignedTo", users)}
                    />
                </div>
                </div>

                <div className='mt-3'>
                    <label htmlFor="" className='text-xs font-medium text-slate-600'>
                        TODO Checklist
                    </label>

                    <TodoListInput
                      todoChecklist={taskData?.todoChecklist}
                      setTodoChecklist={(value) => handleValueChange("todoChecklist", value)}
                    />
                </div>

                <div className='mt-3'>
                    <label htmlFor="" className='text-xs font-medium text-slate-600'>
                        Add Attachments
                    </label>

                    <AddAttachmentsInput
                      attachments={taskData?.attachments}
                      setAttachments={(value) => handleValueChange("attachments", value)}
                    />
                </div>

                {
                    // 如果错误信息存在，则显示错误信息
                    error && (
                        <p className='text-xs text-red-500 mt-5 font-medium'>{error}</p>
                    )
                }

                {/* 居右 */}
                <div className='flex justify-end mt-7'>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className='add-btn-task'
                    >
                        {
                            // 如果任务 ID 存在，则显示更新任务，否则显示创建任务
                            taskId ? 'Update Task' : 'Create Task'
                        }
                    </button>
                </div>
            </div>
        </div>
    </div>
    <Modal
      isOpen={openDeleteAlert}
      onClose={() => setOpenDeleteAlert(false)}
      title='Delete Task'
    >
      <DeleteAlert
        content='Are you sure you want to delete this task? This action cannot be undone and the task will be permanently deleted.'
        onDelete={() => deleteTask()}
      />
    </Modal>
    </div>
  )
}

export default CreateTask