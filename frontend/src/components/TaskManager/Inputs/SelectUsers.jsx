import React, { useState, useEffect } from 'react'
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../../../utils/apiPaths';
import { Users, User } from 'lucide-react';
import Modal from '../Modal';
import AvatarGroup from '../AvatarGroup';


// 在任务里选择成员，并通过弹窗勾选用户后回传给父组件（创建任务页面）
// selectedUsers：当前已经选中的用户 ID 数组
// setSelectedUsers：父组件传进来的更新方法
function SelectUsers({ selectedUsers, setSelectedUsers }) {

  // 所有用户数据
  const [allUsers, setAllUsers] = useState([]);
  // 是否打开弹窗
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 临时选中的用户 ID 数组
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
  
  // 获取所有用户数据
  const getAllUsers = async () => {
    try {
        // 获取所有用户数据
        const response = await axiosInstance.get(API_PATHS.TASK_MANAGER.GET_USERS);
        // 如果获取到用户数据，则设置所有用户数据
        if(response.data?.length > 0) {
            // 设置所有用户数据
            setAllUsers(response.data);
        }
    } catch (error) {
        console.log(error);
    }
  }

  // 切换用户选择状态
  // 如果已选中，就移除
  // 如果未选中，就添加
  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
        // prev 表示 当前的 state 数组，例如：prev = ["u1", "u2", "u3"]
        // includes() 方法用于判断数组是否包含某个值
        // 如果包含，则返回 true, 移除该用户 ID
        // 如果未包含，则返回 false, 添加该用户 ID
        prev.includes(userId)
        // 保留所有 不等于 userId 的元素；也就是说：等于 userId 的元素会被过滤掉。
        // 返回一个新的数组，这个数组是原来的数组，但是删除了等于 userId 的元素。
          ? prev.filter((id) => id !== userId)
          // 返回一个新的数组，这个数组是原来的数组，但是添加了 userId 元素。
          // ...prev：表示原来的数组
          // userId：表示要添加的元素
          : [...prev, userId]
    );
  }


  const handleAssign = () => {
    // 把临时选中的用户提交给父组件
    setSelectedUsers(tempSelectedUsers);
    // 关闭弹窗
    setIsModalOpen(false);
  }


  // 根据 selectedUsers 数组，获取所有选中的用户头像
  const selectedUserAvatars = allUsers
    // 过滤出所有选中的用户
    // 使用 includes() 方法判断用户 ID 是否在 selectedUsers 数组中
    // 如果包含，则返回 true, 保留该用户
    // 如果未包含，则返回 false, 过滤掉该用户
    .filter((user) => (selectedUsers || []).includes(user._id))
    // 获取所有选中的用户头像
    // 使用 map() 方法获取所有选中的用户头像
    // 使用 profileImageUrl 字段获取用户头像
    // 返回一个新的数组，这个数组是所有选中的用户头像。
    .map((user) => user.profileImageUrl);


  // 当弹窗打开时，获取所有用户数据
  useEffect(() => {
    if (isModalOpen) getAllUsers();
    // isModalOpen：表示弹窗是否打开,作用是：当弹窗打开时，获取所有用户数据
  }, [isModalOpen]);

  // 编辑任务时，有已选用户需拉取用户列表以显示头像
  useEffect(() => {
    if (selectedUsers?.length > 0 && allUsers.length === 0) getAllUsers();
  }, [selectedUsers]);

  // 当 selectedUsers 数组为空时，清空临时选中的用户数组
  useEffect(() => {
    if(!selectedUsers?.length) {
        setTempSelectedUsers([]);
    }
    // selectedUsers：表示当前选中的用户数组,作用是：当 selectedUsers 数组为空时，清空临时选中的用户数组
  }, [selectedUsers]);

  // 当弹窗打开时，设置临时选中的用户数组为 selectedUsers 数组
  useEffect(() => {
    setTempSelectedUsers(selectedUsers);
    // isModalOpen：表示弹窗是否打开,作用是：当弹窗打开时，设置临时选中的用户数组为 selectedUsers 数组
  }, [isModalOpen, selectedUsers]);

  return (
    <div className='space-y-4 mt-2'>
        {
            // 如果选中的用户头像数组为空，则显示添加成员按钮
            selectedUserAvatars.length === 0 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='card-btn'
                >
                    {/* 添加成员按钮 */}
                    <Users className='text-sm' width={16} height={16} /> Add Members
                </button>
            )
        }

        {
            // 如果选中的用户头像数组大于0，则显示选中的用户头像
            selectedUserAvatars.length > 0 && (
                <div onClick={() => setIsModalOpen(true)} className='cursor-pointer'>
                    {/* 显示选中的用户头像 */}
                    <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
                </div>
            )
        }

        {/* 弹窗 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title='Select Users'
        >
          {/* 弹窗内容 */}
          <div className='space-y-4'>
            {/* 用户列表 */}
            <div className='h-[60vh] overflow-y-auto'>
            {
                // 遍历所有用户数据
                allUsers.map((user) => (
                    // 用户列表项
                    <div
                      key={user._id}
                      className='flex items-center gap-4 p-3 border-b border-gray-200'
                    >
                        {/* 用户头像 */}
                        {user.profileImageUrl ? (
                          <img
                            // 如果用户头像 URL 以 http 开头，则直接使用该 URL
                            // 否则，使用 BASE_URL 拼接用户头像 URL
                            // BASE_URL：表示后端 API 的基 URL
                            src={user.profileImageUrl.startsWith('http') ? user.profileImageUrl : `${BASE_URL}${user.profileImageUrl}`}
                            alt={user.username}
                            className='w-10 h-10 rounded-full object-cover'
                          />
                        ) : (
                        //   如果用户没有头像，则显示用户图标
                          <div className='w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center'>
                            <User size={18} strokeWidth={2.5} className='text-white' />
                          </div>
                        )}
                        <div className='flex-1'>
                            <p className='font-medium text-gray-800'>
                                {user.username}
                            </p>
                            <p className='text-[13px] text-gray-500'>
                                {user.email}
                            </p>
                        </div>
                        {/* 选择框 */}
                        <input 
                          type="checkbox"
                          // 如果临时选中的用户 ID 数组包含当前用户 ID，则选中
                          // 否则，不选中
                          checked={tempSelectedUsers.includes(user._id)}
                          // 切换用户选择状态
                          // 如果已选中，就移除
                          // 如果未选中，就添加
                          onChange={() => toggleUserSelection(user._id)}
                          className='w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded-sm outline-none'
                        />
                    </div>
                ))
            }
            </div>
            <div className='flex justify-end gap-4 pt-4'>
                <button onClick={() => setIsModalOpen(false)} className='card-btn'>
                    Cancel
                </button>
                <button onClick={handleAssign} className='card-btn-task'>
                    DONE
                </button>
            </div>
          </div>
        </Modal>
    </div>
  )
}

export default SelectUsers