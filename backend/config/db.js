// mongoose 是一个 ODM（Object Data Modeling）库。
// 作用：Node.js  ↔  MongoDB 之间的“翻译器”
import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        // 连接数据库
        const conn = await mongoose.connect(process.env.MONGO_URI)
        // 打印连接成功信息,conn.connection.host是数据库的地址
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        // 打印连接失败信息
        console.error(`Error connecting to MongoDB: ${error.message}`)
        // 退出进程,退出码为1,表示进程异常退出
        process.exit(1)
    }
}

export default connectDB;