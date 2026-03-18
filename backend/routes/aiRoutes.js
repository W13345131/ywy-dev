// Express 是 Node.js 中最常用的 Web API 框架
import express from 'express'


//generateFlashcards	生成 flashcards
//generateQuiz	生成 quiz
//generateSummary	生成文档总结
//chat	和文档聊天
//explainConcept	解释概念
//getChatHistory	获取聊天记录
import {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory,
} from '../controllers/aiController.js'

import protect from '../middleware/auth.js'

// 创建路由实例
const router = express.Router()

// 给所有路由添加 protect
router.use(protect)

router.post('/generate-flashcards', generateFlashcards)
router.post('/generate-quiz', generateQuiz)
router.post('/generate-summary', generateSummary)
router.post('/chat', chat)
router.post('/explain-concept', explainConcept)
router.get('/chat-history/:documentId', getChatHistory)

export default router