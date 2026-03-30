// 引入dotenv
import dotenv from 'dotenv'
// 加载环境变量，并以 .env 为准覆盖残留的旧环境变量
dotenv.config({ override: true })

// 引入express
import express from 'express'
// 引入cors
import cors from 'cors'
// 引入path
import path from 'path'
// 引入fileURLToPath
import { fileURLToPath } from 'url'
// 引入connectDB
import connectDB from './config/db.js'
// 引入错误处理
import errorHandler from './middleware/errorHandler.js'


import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import flashcardRoutes from './routes/flashcardRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import progressRoutes from './routes/progressRoutes.js'
import userRoutes from './routes/Task_manager/userRoutes.js'
import taskRoutes from './routes/Task_manager/taskRoutes.js'
import reportRoutes from './routes/Task_manager/reportRoutes.js'
// Expense Tracker Routes
import incomeRoutes from './routes/Expense_tracker/incomeRoutes.js'
import expenseRoutes from './routes/Expense_tracker/expenseRoutes.js'
import expenseDashboardRoutes from './routes/Expense_tracker/expenseDashboardRoutes.js'

// Media Routes
import mediaUserRoutes from './routes/Media/userRoutes.js'
import mediaPostRoutes from './routes/Media/postRoutes.js'
import mediaStoryRoutes from './routes/Media/storyRoutes.js'
import mediaMessageRoutes from './routes/Media/messageRoutes.js'
// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 创建express应用
const app = express()

// 连接数据库
connectDB();

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://8.156.88.118',
    'https://ywy0701.com',
    'http://ywy0701.com',
    'https://www.ywy0701.com',
    'http://www.ywy0701.com',
    'https://api.ywy0701.com',
    'http://api.ywy0701.com',
];

// 跨域处理
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error('Not allowed by CORS'));
        },
        // 允许的请求方法
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        // 允许的请求头
        allowedHeaders: ["Content-Type", "Authorization"],
        // 允许携带凭证
        credentials: true,
    })
)   

// 解析json请求体
app.use(express.json())

// 解析urlencoded请求体,extended: true 表示允许解析复杂对象
app.use(express.urlencoded({ extended: true }))

// 静态文件服务
// 上传的文件保存在uploads目录下
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/flashcards', flashcardRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/progress', progressRoutes)


// Expense Tracker Routes
app.use('/api/expense-tracker/income', incomeRoutes)
app.use('/api/expense-tracker/expense', expenseRoutes)
app.use('/api/expense-tracker/expense-dashboard', expenseDashboardRoutes)


// Task Manager Routes
app.use('/api/task-manager/users', userRoutes)
app.use('/api/task-manager/tasks', taskRoutes)
app.use('/api/task-manager/reports', reportRoutes)


// Media Routes
app.use('/api/media/users', mediaUserRoutes)
app.use('/api/media/posts', mediaPostRoutes)
app.use('/api/media/stories', mediaStoryRoutes)
app.use('/api/media/messages', mediaMessageRoutes)  




// 错误处理
app.use(errorHandler);


// 404处理
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        statusCode: 404
    })
})


const PORT = process.env.PORT || 5555;
// 启动服务器,监听端口,打印服务器运行在哪个模式下,哪个端口
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})


// 处理未处理的拒绝(promise)
// 当一个promise被拒绝(rejected)且没有被任何地方处理时,这个事件会被触发
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`)
    // 退出进程,退出码为1,表示进程异常退出
    process.exit(1)
})