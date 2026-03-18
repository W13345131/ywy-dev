import express from 'express'
import protect from '../../middleware/auth.js'
import adminOnly from '../../middleware/admin.js'

import {
    exportTasksReport,
    exportUsersReport,
} from '../../controllers/Task_Manager/reportController.js'

const router = express.Router()

// 导出任务excel
router.get('/export/tasks', protect, adminOnly, exportTasksReport)
// 导出用户
router.get('/export/users', protect, adminOnly, exportUsersReport)

export default router;