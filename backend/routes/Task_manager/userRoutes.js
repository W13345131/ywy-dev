import express from 'express'
import protect from '../../middleware/auth.js'
import adminOnly from '../../middleware/admin.js'

import {
    getUsers,
    getUserById,
} from '../../controllers/Task_manager/userController.js'


const router = express.Router()

// 获取所有用户 (Admin Only Routes)
router.get('/', protect, adminOnly, getUsers)
// 获取单个用户
router.get('/:id', protect, getUserById)

export default router