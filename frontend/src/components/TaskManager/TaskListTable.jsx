import React from 'react'
import moment from 'moment'

const TaskListTable = ({ tableData }) => {

  // 获取状态徽章颜色
  const getStatusBadegeColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-500 border border-green-200';
      case 'Pending':
        return 'bg-purple-100 text-purple-500 border border-purple-200';
      case 'In Progress':
        return 'bg-cyan-100 text-cyan-500 border border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  }

  // 获取优先级徽章颜色
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'Low':
        return 'bg-green-100 text-green-500 border border-green-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-500 border border-orange-200';
      case 'High':
        return 'bg-red-100 text-red-500 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  }

  return (
    <div className='overflow-x-auto p-0 rounded-lg mt-3'>
        {/* min-w-full：最小宽度为100% */}
      <table className='min-w-full'>
        {/* thead：表头 */}
        <thead>
          {/* tr：行 */}
          <tr className='text-left'>
            {/* th：表头单元格 */}
            <th className='py-3 px-4 font-medium text-gray-800 text-[13px]'>Name</th>
            <th className='py-3 px-4 font-medium text-gray-800 text-[13px]'>Status</th>
            <th className='py-3 px-4 font-medium text-gray-800 text-[13px]'>Priority</th> 
            <th className='py-3 px-4 font-medium text-gray-800 text-[13px] hidden md:table-cell'>Created On</th>
          </tr>
        </thead>
        {/* tbody：表体 */}
        <tbody>
        {
            tableData.map((task) => (
                <tr key={task._id} className='border-t border-gray-200'>
                    {/* td：表体单元格 */}
                    {/* line-clamp-1：一行显示一个 */}
                    {/* overflow-hidden：超出隐藏 */}
                    <td className='py-4 px-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden'>{task.title}</td>
                    <td className='py-4 px-4'>
                        <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadegeColor(task.status)}`}>
                            {task.status}
                        </span>
                    </td>
                    <td className='py-4 px-4'>
                        <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(task.priority)}`}>
                            {task.priority}
                        </span>
                    </td>
                    {/* N/A：Not Available */}
                    <td className='py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell'>{task.createdAt ? moment(task.createdAt).format('DD MMM YYYY') : 'N/A'}</td>
                </tr>
            ))
        }
        </tbody>
      </table>
    </div>
  )
}

export default TaskListTable