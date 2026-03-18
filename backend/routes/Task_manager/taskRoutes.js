import express from 'express'
import protect from '../../middleware/auth.js'
import adminOnly from '../../middleware/admin.js'

import {
    getDashboardData,
    getUserDashboardData,
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    assignTaskChecklist,
} from '../../controllers/Task_Manager/taskController.js'

const router = express.Router()

// 获取任务仪表盘数据(Admin Only Routes)
router.get('/dashboard-data', protect, adminOnly, getDashboardData)
// 获取用户任务仪表盘数据(Member Only Routes)
router.get('/user-dashboard-data', protect, getUserDashboardData)
// 获取所有任务，admin获取所有，member获取自己的
router.get('/', protect, getTasks)
router.get('/:id', protect, getTaskById)
router.post('/', protect, adminOnly, createTask)
// 更新任务
router.put('/:id', protect, updateTask)
router.delete('/:id', protect, adminOnly, deleteTask)
// 更新任务状态
router.put('/:id/status', protect, updateTaskStatus)
// 更新任务列表
router.put('/:id/todo', protect, assignTaskChecklist)

export default router