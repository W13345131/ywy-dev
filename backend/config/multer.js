// multer 是 Node.js 文件上传中间件。
// 作用：处理 HTTP 请求中的文件上传。
import multer from 'multer'
// path 用来处理文件路径。
import path from 'path'
// 这是 ES Module 环境下获取文件路径的方法
// 在 ES Module 中：
// __dirname  不存在
// __filename  不存在
import { fileURLToPath } from 'url'
// fs 是 Node.js 文件系统模块。
import fs from 'fs'

// 当前模块文件的 URL 地址
const __filename = fileURLToPath(import.meta.url)
// 当前模块文件的目录名
const __dirname = path.dirname(__filename)

// 生成一个上传文件夹的完整路径    /Users/app/project/uploads/documents
const uploadDir = path.join(__dirname, '../uploads/documents')

if(!fs.existsSync(uploadDir)) {
    // recursive 的作用是：递归创建所有不存在的目录
    fs.mkdirSync(uploadDir, { recursive: true })
}


// 定义了文件上传后保存在哪里，以及保存时叫什么名字
const storage = multer.diskStorage({
    // 决定文件保存在哪个文件夹
    // req	HTTP请求对象
    // file	上传文件信息
    // cb 是回调函数，用于通知 multer 文件保存成功或失败
    // cb(error, destination)：error 是错误信息，destination 是文件保存的目录
    destination: (req, file, cb) => {
        // 通知 multer 文件保存成功
        // 没有错误
        // 保存到 uploadDir
        cb(null, uploadDir)
    },
    // 决定文件保存时的名字
    // file 是 Multer 提供的文件信息对象
    filename: (req, file, cb) => {
        // 生成唯一文件名
        // Date.now() 是当前时间戳
        // Math.round(Math.random() * 1E9) 是生成一个0到1000000000之间的随机数
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // 拼接文件名
        cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
})


// 限制上传文件类型，只允许 PDF 文件上
const fileFilter = (req, file, cb) => {
    // 如果文件类型是 PDF
    if(file.mimetype === 'application/pdf') {
        cb(null, true)
    } else {
        // 通知 multer 文件保存失败
        // 错误信息：Only PDF files are allowed
        // 文件保存失败
        cb(new Error('Only PDF files are allowed'), false)
    }
}


// 创建一个 Multer 上传中间件实例，用于处理文件上
const upload = multer({ 
    // 文件保存方式
    storage: storage,
    // 过滤上传文件类型
    fileFilter: fileFilter,
    // 限制上传文件大小
    limits: {
        // parseInt: 把字符串转成数字
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
    }
})

export default upload
