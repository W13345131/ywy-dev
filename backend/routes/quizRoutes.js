import express from 'express'

// getQuizzes	获取某个文档的 quizzes
// getQuizById	获取某个 quiz
// submitQuiz	提交 quiz
// getQuizResults	获取 quiz 结果
// deleteQuiz	删除 quiz
import {
    getQuizzes,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz,
} from '../controllers/quizController.js'

import protect from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

// 获取某个文档的 quizzes
router.get('/:documentId', getQuizzes)
// 获取某个 quiz
router.get('/quiz/:id', getQuizById)
// 提交 quiz
router.post('/:id/submit', submitQuiz)
// 获取 quiz 结果
router.get('/:id/results', getQuizResults)
// 删除 quiz
router.delete('/:id', deleteQuiz)

export default router;