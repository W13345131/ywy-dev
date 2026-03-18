import express from 'express'

import {
    addIncome,
    getAllIncomes,
    deleteIncome,
    downloadIncomeExcel
} from '../../controllers/Expense_tracker/incomeController.js'

import protect from '../../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.post('/add',protect, addIncome)
router.get('/getall',protect, getAllIncomes)
router.delete('/delete/:id',protect, deleteIncome)
router.get('/download',protect, downloadIncomeExcel)

export default router