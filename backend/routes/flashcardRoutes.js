import express from 'express'


// getFlashcards	获取某个文档的 flashcards
// getAllFlashcardSets	获取所有 flashcard 集合
// reviewFlashcard	复习某张卡片
// toggleStarFlashcard	收藏 / 取消收藏卡片
// deleteFlashcardSet	删除整个 flashcard 集合
import {
    getFlashcards,
    getAllFlashcardSets,
    reviewFlashcard,
    toggleStarFlashcard,
    deleteFlashcardSet,
} from '../controllers/flashcardController.js'

import protect from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

// 获取所有 flashcard 集合
router.get('/', getAllFlashcardSets)

// 获取某个文档的 flashcards
router.get('/:documentId', getFlashcards)
// 复习某张卡片
router.post('/:cardId/review', reviewFlashcard)
// 收藏 / 取消收藏卡片
router.put('/:cardId/star', toggleStarFlashcard)
// 删除整个 flashcard 集合
router.delete('/:id', deleteFlashcardSet)

export default router