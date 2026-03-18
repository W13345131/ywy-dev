import express from 'express'

// uploadDocument	上传文档
// getDocuments	获取文档列表
// getDocument	获取文档详情
// deleteDocument	删除文档
import {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
} from '../controllers/documentController.js'

import protect from '../middleware/auth.js'

// 引入 multer 配置
import upload from '../config/multer.js'

// 创建路由实例
const router = express.Router()

// 给所有路由添加 protect
router.use(protect)

router.post('/upload', upload.single('file'), uploadDocument)
router.get('/', getDocuments)
// 匹配任何 /xxx 形式的路径，并把 xxx 作为参数 id 传给 controller
router.get('/:id', getDocument)
router.delete('/:id', deleteDocument)


export default router;