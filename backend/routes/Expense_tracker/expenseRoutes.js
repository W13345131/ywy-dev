import express from 'express'

import {
    addExpense,
    getAllExpenses,
    deleteExpense,
    downloadExpenseExcel
} from '../../controllers/Expense_tracker/expenseController.js'

import protect from '../../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.post('/add',protect, addExpense)
router.get('/getall',protect, getAllExpenses)
router.delete('/delete/:id',protect, deleteExpense)
router.get('/download',protect, downloadExpenseExcel)

export default router
