import express from 'express'

import {
    getExpenseDashboardData
} from '../../controllers/Expense_tracker/expenseDashboardController.js'

import protect from '../../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.get('/', protect, getExpenseDashboardData)

export default router